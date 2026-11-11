"""Bake the hero flower "drawing" map from the approved artwork.

Outputs (grayscale, so lossy WebP keeps channels clean):
  public/images/hero/abstract-flower-lines.webp   line intensity (petal hairlines,
      folds and outlines), same size as the artwork
  public/images/hero/abstract-flower-growth.webp  growth order: geodesic distance
      from the stem base through the flower, 0 (stem) .. 255 (furthest tip), 256px

The hero shader draws the lines in the brand ink following the growth order, then
fills the artwork behind the drawing front. Regenerate whenever abstract-flower.webp changes:

  python tools/hero-flower/bake.py            # needs Pillow + numpy
  python tools/hero-flower/bake.py --preview  # also writes preview PNGs next to the output
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "public/images/hero/abstract-flower.webp"
OUTPUT = ROOT / "public/images/hero/abstract-flower-lines.webp"
GROWTH = ROOT / "public/images/hero/abstract-flower-growth.webp"
# Stem base as it sits in the artwork (pixel coords of the 1254px source).
STEM_BASE = (963, 1250)
GRID = 314  # growth field resolution (source / 4)


def blur(channel: np.ndarray, radius: float) -> np.ndarray:
    image = Image.fromarray(np.clip(channel, 0, 255).astype(np.uint8))
    return np.asarray(image.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)


def line_map(rgba: np.ndarray) -> np.ndarray:
    rgb = rgba[..., :3].astype(np.float32)
    alpha = rgba[..., 3].astype(np.float32)
    lum = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) * (alpha / 255)
    # Hairlines: dark fine detail relative to its neighbourhood (difference of Gaussians).
    fine = np.maximum(blur(lum, 2.2) - blur(lum, 0.6), 0)
    fine = np.clip(fine / np.percentile(fine[alpha > 30], 99.2), 0, 1) ** 0.85
    # Petal outlines: where opacity changes, in both directions.
    edge = np.abs(blur(alpha, 0.5) - blur(alpha, 1.4))
    edge = np.clip(edge / np.percentile(edge[edge > 1], 99.0), 0, 1) ** 0.8 * 0.8
    # Folds: strong luminance gradient (the darker inner petal ridges).
    soft = blur(lum, 1.2)
    gy, gx = np.gradient(soft)
    ridge = np.hypot(gx, gy)
    ridge = np.clip(ridge / np.percentile(ridge[alpha > 30], 99.3), 0, 1) ** 1.2
    lines = np.maximum.reduce([fine * 0.85, edge, ridge * 0.75])
    # Keep the drawing on the flower: drop specks from near-transparent haze.
    body = blur((alpha > 90).astype(np.float32) * 255, 3) / 255
    lines *= np.clip(body * 1.6, 0, 1)
    return np.clip(lines, 0, 1)


def growth_map(alpha: np.ndarray) -> np.ndarray:
    size = alpha.shape[0]
    small = np.asarray(
        Image.fromarray(alpha).resize((GRID, GRID), Image.Resampling.BOX), dtype=np.float32
    )
    inside = small > 10
    dist = np.full(small.shape, np.inf, dtype=np.float32)
    sx, sy = (int(STEM_BASE[0] * GRID / size), min(int(STEM_BASE[1] * GRID / size), GRID - 1))
    # Seed from the nearest opaque cell to the stem base.
    ys, xs = np.nonzero(inside)
    nearest = np.argmin((xs - sx) ** 2 + (ys - sy) ** 2)
    seed = (ys[nearest], xs[nearest])
    dist[seed] = 0
    queue: deque[tuple[int, int]] = deque([seed])
    steps = [(-1, 0, 1.0), (1, 0, 1.0), (0, -1, 1.0), (0, 1, 1.0),
             (-1, -1, 1.414), (-1, 1, 1.414), (1, -1, 1.414), (1, 1, 1.414)]
    # Small-label-correcting shortest path; fine at this grid size.
    while queue:
        y, x = queue.popleft()
        base = dist[y, x]
        for dy, dx, cost in steps:
            ny, nx = y + dy, x + dx
            if 0 <= ny < GRID and 0 <= nx < GRID and inside[ny, nx]:
                # Faint (translucent) areas cost a little more, so growth follows the ribs first.
                step = cost * (1.0 + 0.6 * (1.0 - small[ny, nx] / 255.0))
                if base + step < dist[ny, nx]:
                    dist[ny, nx] = base + step
                    queue.append((ny, nx))
    finite = np.isfinite(dist)
    far = dist[finite].max()
    # Unreached specks (detached wisps) appear at the end.
    field = np.where(finite, dist / far, 1.0)
    field = np.asarray(
        Image.fromarray((field * 255).astype(np.uint8)).resize((size, size), Image.Resampling.BICUBIC)
        .filter(ImageFilter.GaussianBlur(3)),
        dtype=np.float32,
    ) / 255
    return np.clip(field, 0, 1)


def main() -> None:
    rgba = np.asarray(Image.open(SOURCE).convert("RGBA"))
    lines = line_map(rgba)
    growth = growth_map(rgba[..., 3])
    Image.fromarray((lines * 255).round().astype(np.uint8), "L").save(OUTPUT, "WEBP", quality=82, method=6)
    Image.fromarray((growth * 255).round().astype(np.uint8), "L").resize((256, 256), Image.Resampling.LANCZOS).save(
        GROWTH, "WEBP", quality=90, method=6
    )
    for path in (OUTPUT, GROWTH):
        print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size // 1024} KiB)")
    if "--preview" in sys.argv:
        ink = np.full(rgba.shape[:2] + (3,), (247, 246, 242), dtype=np.float32)
        ink = ink * (1 - lines[..., None]) + np.array([88, 51, 70]) * lines[..., None]
        Image.fromarray(ink.astype(np.uint8)).save(OUTPUT.with_name("_preview-lines.png"))
        Image.fromarray((growth * 255).astype(np.uint8)).save(OUTPUT.with_name("_preview-growth.png"))


if __name__ == "__main__":
    main()
