/** The five original symbol shapes gather from a flower seen from above. */
export function initFooterSymbol() {
  const target = document.querySelector<HTMLElement>('[data-footer-symbol]');
  if (!target || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const footer = target.closest('footer');
  if (!footer) return;
  let started = false;
  const startIfVisible = () => {
    // The desktop footer sits beneath the main content as a curtain; intersection
    // alone would start the animation while it is still covered by the page.
    const distance = document.documentElement.scrollHeight - innerHeight - scrollY;
    const rect = target.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight || distance > footer.offsetHeight * .65) return;
    started = true;
    window.removeEventListener('scroll', startIfVisible);
    window.removeEventListener('resize', startIfVisible);
    void animateSymbol(target);
  };
  window.addEventListener('scroll', startIfVisible, { passive: true });
  window.addEventListener('resize', startIfVisible);
  if (!started) startIfVisible();
}

async function animateSymbol(target: HTMLElement) {
  try {
    const response = await fetch('/images/tenbeltz-mark.svg');
    if (!response.ok) return;
    const source = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    const paths = Array.from(source.querySelectorAll('path')).map(path => path.getAttribute('d') || '');
    if (paths.length !== 5 || paths.some(path => !path)) return;
    const ns = 'http://www.w3.org/2000/svg';
    const count = 120;
    type Point = [number, number];
    const sample = (d: string, scale = 1): Point[] => {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      const length = path.getTotalLength();
      return Array.from({ length: count }, (_, i) => {
        const point = path.getPointAtLength(length * i / count);
        return [point.x * scale, point.y * scale];
      });
    };
    const base = sample('M 140 151 C 115 136 103 105 109 72 C 113 45 128 22 140 18 C 152 22 167 45 171 72 C 177 105 165 136 140 151 Z');
    const petals = Array.from({ length: 5 }, (_, i) => {
      const angle = i * Math.PI * 2 / 5, c = Math.cos(angle), s = Math.sin(angle);
      return base.map(([x, y]): Point => [140 + (x - 140) * c - (y - 156) * s, 156 + (x - 140) * s + (y - 156) * c]);
    });
    const center = (points: Point[]): Point => points.reduce<Point>((a, p) => [a[0] + p[0] / count, a[1] + p[1] / count], [0, 0]);
    const unused = new Set([0, 1, 2, 3, 4]);
    const pairs = paths.map(d => {
      const mark = sample(d, 10), [x, y] = center(mark);
      let best = 0, distance = Infinity;
      for (const i of unused) {
        const [px, py] = center(petals[i]);
        const candidate = (x - px) ** 2 + (y - py) ** 2;
        if (candidate < distance) { distance = candidate; best = i; }
      }
      unused.delete(best);
      const flower = petals[best];
      let offset = 0, score = Infinity;
      for (let j = 0; j < count; j++) {
        let candidate = 0;
        for (let k = 0; k < count; k++) {
          const p = flower[(k + j) % count], q = mark[k];
          candidate += (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
        }
        if (candidate < score) { score = candidate; offset = j; }
      }
      return { flower: flower.map((_, k) => flower[(k + offset) % count]), mark };
    });
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '-25 -15 330 350');
    svg.setAttribute('aria-hidden', 'true');
    const nodes = pairs.map(() => { const path = document.createElementNS(ns, 'path'); svg.appendChild(path); return path; });
    const draw = (t: number) => nodes.forEach((node, i) => {
      const { flower, mark } = pairs[i];
      node.setAttribute('d', flower.map((p, k) => `${k ? 'L' : 'M'}${(p[0] + (mark[k][0] - p[0]) * t).toFixed(2)} ${(p[1] + (mark[k][1] - p[1]) * t).toFixed(2)}`).join(' ') + ' Z');
    });
    draw(0);
    const original = target.querySelector('img');
    if (!original) return;
    target.replaceChildren(svg);
    const start = performance.now(), duration = 3600;
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      draw(p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
      if (p < 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(frame);
      else target.replaceChildren(original);
    };
    requestAnimationFrame(frame);
  } catch {
    // The original static mark remains available if the animation cannot load.
  }
}
