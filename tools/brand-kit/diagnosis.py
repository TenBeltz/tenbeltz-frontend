#!/usr/bin/env python3
"""Export runtime diagnosis templates from the approved brand-kit report scenes.
Does not regenerate or modify brand/dist. Assets are copied byte for byte.
Run with the brand-kit Python environment from the repository root.
"""
import json
import shutil
from pathlib import Path
import build as brand
from documents import base

OUT = brand.ROOT / 'public' / 'brand' / 'diagnosis'
OUT.mkdir(parents=True, exist_ok=True)
assets = {
    'logo-color.png': brand.DIST / 'logos/tenbeltz-horizontal-color.png',
    'logo-white.png': brand.DIST / 'logos/tenbeltz-horizontal-white.png',
    'flower.png': brand.DIST / 'graphics/tenbeltz-flower-transparent.png',
    'contours.png': brand.DIST / 'graphics/tenbeltz-background-petal-contours-paper.png',
    'IBMPlexSans-Regular.ttf': brand.SOURCE / 'fonts/IBMPlexSans-Regular.ttf',
    'IBMPlexSans-Medium.ttf': brand.SOURCE / 'fonts/IBMPlexSans-Medium.ttf',
    'OFL.txt': brand.SOURCE / 'fonts/OFL.txt',
}
for name, source in assets.items():
    shutil.copyfile(source, OUT / name)
scenes = {}
for kind in ['cover', 'body', 'profile', 'closing']:
    scene = base(brand, 'report', 0, '', dark=kind == 'closing')
    # The original example's fictional client, page number and sample labels
    # are replaced by visitor metadata in the runtime renderer.
    scene.nodes = [n for n in scene.nodes if n['type'] != 'text']
    for node in scene.nodes:
        if node['type'] == 'image':
            node['path'] = 'logo-white.png' if kind == 'closing' else 'logo-color.png'
    if kind == 'cover':
        scene.image(assets['flower.png'], 279, 358, 275, 275)
        scene.nodes[-1]['path'] = 'flower.png'
    if kind == 'profile':
        scene.image(assets['contours.png'], 350, 105, 220, 124)
        scene.nodes[-1]['path'] = 'contours.png'
    scenes[kind] = dict(background=scene.bg, nodes=scene.nodes)
(OUT / 'templates.json').write_text(json.dumps(dict(
    edition=brand.IDENTITY['edition'], width=595.276, height=841.89,
    colors=brand.C, scenes=scenes,
    source='tools/brand-kit/documents.py:base; scenes.py:Scene',
), ensure_ascii=False, indent=2) + '\n')
print('Exported four report scene templates and seven original brand assets.')
