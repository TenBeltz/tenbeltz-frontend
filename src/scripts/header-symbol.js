// Reuse the five-petal construction from the brandbook's flower/symbol study.
export function initHeaderSymbol(target) {
  if (!target) return () => {};
  let request = 0, frame = 0, current = 1, scene;
  const ns = 'http://www.w3.org/2000/svg';
  const count = 60;
  let preparation;
  async function buildScene() {
    if (scene) return scene;
    const response = await fetch('/images/tenbeltz-mark.svg');
    if (!response.ok) throw new Error('Symbol unavailable');
    const documentSvg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    const paths = [...documentSvg.querySelectorAll('path')].map(p => p.getAttribute('d'));
    if (paths.length !== 5 || paths.some(p => !p)) throw new Error('Invalid symbol');
    const sample = (d, scale = 1) => {
      const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d);
      const length = p.getTotalLength();
      return Array.from({length: count}, (_, i) => { const point = p.getPointAtLength(length * i / count); return [point.x * scale, point.y * scale]; });
    };
    const base = sample('M 140 151 C 115 136 103 105 109 72 C 113 45 128 22 140 18 C 152 22 167 45 171 72 C 177 105 165 136 140 151 Z');
    const petals = Array.from({length:5}, (_, i) => { const a=i*Math.PI*2/5, c=Math.cos(a), s=Math.sin(a); return base.map(([x,y]) => [140+(x-140)*c-(y-156)*s,156+(x-140)*s+(y-156)*c]); });
    const center = points => points.reduce((a,p) => [a[0]+p[0]/count,a[1]+p[1]/count],[0,0]);
    const unused = new Set([0,1,2,3,4]);
    const pairs = paths.map(d => {
      const mark=sample(d,10), [x,y]=center(mark); let best=0, distance=Infinity;
      for (const i of unused) { const [px,py]=center(petals[i]); const n=(x-px)**2+(y-py)**2; if(n<distance){distance=n;best=i;} }
      unused.delete(best); const flower=petals[best]; let offset=0, score=Infinity;
      for(let j=0;j<count;j++){let n=0;for(let k=0;k<count;k++){const p=flower[(k+j)%count],q=mark[k];n+=(p[0]-q[0])**2+(p[1]-q[1])**2;}if(n<score){score=n;offset=j;}}
      return {flower:flower.map((_,k)=>flower[(k+offset)%count]),mark};
    });
    const svg=document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','-25 -15 330 350'); svg.setAttribute('aria-hidden','true');
    const nodes=pairs.map(()=>{const p=document.createElementNS(ns,'path');svg.appendChild(p);return p;});
    scene={svg, pairs, nodes, original: target.querySelector('img')};
    return scene;
  }
  function prepare() {
    return preparation ??= buildScene().catch(error => { preparation = undefined; throw error; });
  }
  if (target.hasAttribute('data-header-symbol') && matchMedia('(max-width: 740px) and (prefers-reduced-motion: no-preference)').matches) {
    const warm = () => { void prepare().catch(() => {}); };
    if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 1500 });
    else setTimeout(warm, 300);
  }
  function draw(t) {
    scene.nodes.forEach((node,i)=>{const {flower,mark}=scene.pairs[i];node.setAttribute('d',flower.map((p,k)=>`${k?'L':'M'}${(p[0]+(mark[k][0]-p[0])*t).toFixed(2)} ${(p[1]+(mark[k][1]-p[1])*t).toFixed(2)}`).join(' ')+' Z');});
  }
  return async open => {
    const id=++request;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { cancelAnimationFrame(frame); if(scene?.original) target.replaceChildren(scene.original); current=1; return; }
    try {
      await prepare(); if(id!==request) return;
      cancelAnimationFrame(frame); target.replaceChildren(scene.svg);
      const initial=current, end=open?0:1, start=performance.now(), duration=650;
      function tick(now) { const p=Math.min(1,(now-start)/duration), eased=1-(1-p)**3;current=initial+(end-initial)*eased;draw(current);if(p<1)frame=requestAnimationFrame(tick);else if(!open && scene.original)target.replaceChildren(scene.original); }
      frame=requestAnimationFrame(tick);
    } catch { /* Keep the original static symbol if animation cannot load. */ }
  };
}
