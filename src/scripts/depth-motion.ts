import { initBrandFlight } from './brand-flight';
/**
 * Site-wide depth motion. One language: content is a stack of sheets that rise from
 * beneath the page and settle flat as you scroll, while backgrounds recede.
 *
 * - Headings: lines flip up from behind a mask (once, on enter).
 * - Cards and blocks: rise from depth (tilted back, lower, further away), scrubbed with scroll.
 * - Dark/ink sections: a sheet that widens over the page while the previous content recedes.
 * - Images: open from an inset window while the photo settles in scale.
 * - Home hero: flower and copy separate into layers on the way out.
 * - Cards on fine pointers: tilt toward the cursor with a moving highlight.
 * - Footer: the wordmark draws in line, then fills with the flower, which follows the cursor.
 *
 * Hidden start states are only ever set from here, so the page is complete without JS.
 * Reduced motion, the diagnosis tool and the legal pages get no motion.
 */
type Gsap = typeof import('gsap').gsap;

/** Intensities. Tune here; everything else derives from these. */
const DEPTH = {
  riseY: 90,
  riseZ: -160,
  riseTilt: 16,
  riseOpacity: 0.25,
  perspective: 1400,
  headingTilt: -75,
  sheetInset: 6,
  sheetRadius: 36,
  recede: 0.94,
  imageInset: 14,
  imageScale: 1.22,
  hoverTilt: 5,
  scrub: 0.9,
};
const MOBILE = 0.55;

const RISE = [
  '.business-solution', '.business-phase-grid > article', '.business-training', '.business-start > div',
  '.business-faq details', '.home-work .project-track',
  '.solutions-offer-grid > *', '.solutions-proof-grid > *', '.solutions-task-list > *', '.solution-problem-grid > *',
  '.team-roster > *', '.founder-grid > *', '.contact-grid > *',
].join(',');
const SHEETS = '.business-method, .solutions-offer, .contact-section';
const IMAGES = '.portrait';
const TILT = '.business-solution, .solutions-offer-grid > a, .solution-problem-grid > a';
const HEADINGS = 'main h2';

export async function initDepthMotion() {
  const main = document.querySelector<HTMLElement>('main');
  if (!main || main.matches('.diagnosis-page, .legal-page')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
    import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText);
  await document.fonts?.ready;

  const mm = gsap.matchMedia();
  mm.add(
    { desktop: '(min-width: 741px)', mobile: '(max-width: 740px)', reduce: '(prefers-reduced-motion: reduce)' },
    context => {
      const { desktop, reduce } = context.conditions as Record<string, boolean>;
      if (reduce) return;
      const k = desktop ? 1 : MOBILE;
      const fold = window.innerHeight * 0.92;
      const belowFold = (el: Element) => el.getBoundingClientRect().top > fold;

      headings(gsap, SplitText, main, belowFold, k);
      rise(gsap, main, belowFold, k);
      sheets(gsap, main, k);
      images(gsap, main, belowFold, k);
      if (desktop) heroExit(gsap, main);
      const fine = desktop && window.matchMedia('(pointer: fine)').matches;
      const untilt = fine ? tilt(main) : undefined;
      const unmark = footerMark(gsap, ScrollTrigger, fine);
      const unflight = desktop ? initBrandFlight(gsap, ScrollTrigger) : undefined;
      return () => { untilt?.(); unmark?.(); unflight?.(); };
    },
  );

  // Late layout shifts (fonts, images, carousel) move trigger positions.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  const teardown = () => { mm.revert(); document.removeEventListener('astro:before-swap', teardown); };
  document.addEventListener('astro:before-swap', teardown);
}

function headings(gsap: Gsap, SplitText: typeof import('gsap/SplitText').SplitText, main: HTMLElement, belowFold: (el: Element) => boolean, k: number) {
  main.querySelectorAll<HTMLElement>(HEADINGS).forEach(heading => {
    if (!belowFold(heading) || heading.closest('details, form, [data-motion-skip]')) return;
    // Headings use white-space:pre-line with "\n"; SplitText needs real breaks to keep them.
    if (!heading.children.length) preLineToBreaks(heading);
    SplitText.create(heading, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        gsap.set(heading, { perspective: 700 });
        return gsap.from(self.lines, {
          yPercent: 105,
          rotateX: DEPTH.headingTilt * k,
          transformOrigin: '50% 100%',
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
        });
      },
    });
  });
}

function preLineToBreaks(el: HTMLElement) {
  if (getComputedStyle(el).whiteSpace !== 'pre-line' || !el.textContent?.includes('\n')) return;
  const parts = el.textContent.split('\n');
  el.replaceChildren(...parts.flatMap((part, i) => (i ? [document.createElement('br'), part] : [part])));
}

function rise(gsap: Gsap, main: HTMLElement, belowFold: (el: Element) => boolean, k: number) {
  const items = [...main.querySelectorAll<HTMLElement>(RISE)].filter(el => belowFold(el) && !el.closest('[data-motion-skip]'));
  const parents = new Set(items.map(el => el.parentElement).filter(Boolean) as HTMLElement[]);
  parents.forEach(parent => gsap.set(parent, { perspective: DEPTH.perspective }));
  items.forEach(el => {
    // Siblings in the same row arrive slightly staggered.
    const column = Math.round(el.getBoundingClientRect().left / Math.max(window.innerWidth / 3, 1));
    gsap.fromTo(
      el,
      {
        y: DEPTH.riseY * k * (1 + column * 0.25),
        z: DEPTH.riseZ * k,
        rotateX: DEPTH.riseTilt * k,
        opacity: DEPTH.riseOpacity,
        transformOrigin: '50% 0%',
      },
      {
        y: 0, z: 0, rotateX: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'clamp(top bottom)', end: 'clamp(top 62%)', scrub: DEPTH.scrub },
      },
    );
  });
}

function sheets(gsap: Gsap, main: HTMLElement, k: number) {
  main.querySelectorAll<HTMLElement>(SHEETS).forEach(sheet => {
    if (sheet.getBoundingClientRect().top < window.innerHeight) return;
    const inset = DEPTH.sheetInset * k;
    gsap.fromTo(
      sheet,
      { clipPath: `inset(0% ${inset}% 0% ${inset}% round ${DEPTH.sheetRadius}px)` },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top 25%', scrub: DEPTH.scrub },
      },
    );
    // The content just before the sheet sinks back as the sheet slides over it.
    const previous = sheet.previousElementSibling as HTMLElement | null;
    if (previous && !previous.querySelector('[data-hero-flower]')) {
      gsap.to(previous, {
        scale: 1 - (1 - DEPTH.recede) * k, opacity: 0.55, transformOrigin: '50% 100%', ease: 'none',
        scrollTrigger: { trigger: sheet, start: 'top 85%', end: 'top 15%', scrub: DEPTH.scrub },
      });
    }
  });
}

function images(gsap: Gsap, main: HTMLElement, belowFold: (el: Element) => boolean, k: number) {
  main.querySelectorAll<HTMLElement>(IMAGES).forEach(frame => {
    const img = frame.querySelector('img');
    if (!img || !belowFold(frame)) return;
    const inset = DEPTH.imageInset * k;
    const trigger = { trigger: frame, start: 'clamp(top bottom)', end: 'clamp(center 55%)', scrub: DEPTH.scrub };
    gsap.fromTo(frame, { clipPath: `inset(${inset}% ${inset}% ${inset}% ${inset}%)` }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out', scrollTrigger: trigger });
    gsap.fromTo(img, { scale: 1 + (DEPTH.imageScale - 1) * k }, { scale: 1, ease: 'power2.out', scrollTrigger: { ...trigger } });
  });
}

function heroExit(gsap: Gsap, main: HTMLElement) {
  const hero = main.querySelector<HTMLElement>('.home-intro--flower');
  const flower = hero?.querySelector<HTMLElement>('[data-hero-flower]');
  if (!hero || !flower) return;
  const copy = hero.querySelectorAll<HTMLElement>('.hero-kicker, h1, .hero-bottom');
  const trigger = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
  // Different speeds per layer: the flower lags behind and sinks, the copy leaves faster.
  gsap.fromTo(flower, { yPercent: -50, y: 0 }, { yPercent: -50, y: 170, scale: 0.86, rotate: -5, opacity: 0.35, ease: 'none', scrollTrigger: trigger });
  copy.forEach((el, i) => gsap.to(el, { y: -70 - i * 35, opacity: 0.15, ease: 'none', scrollTrigger: { ...trigger } }));
}

function tilt(main: HTMLElement) {
  const cards = [...main.querySelectorAll<HTMLElement>(TILT)];
  cards.forEach(card => { if (card.parentElement) card.parentElement.style.perspective = `${DEPTH.perspective}px`; });
  const handlers = cards.map(card => {
    card.classList.add('depth-tilt');
    const move = (event: PointerEvent) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      // CSS `rotate` composes with GSAP's `transform`, so tilt and scroll motion never fight.
      const angle = Math.hypot(x, y) * 2 * DEPTH.hoverTilt;
      card.style.rotate = `${-y} ${x} 0 ${angle.toFixed(2)}deg`;
      card.style.setProperty('--depth-x', `${((x + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty('--depth-y', `${((y + 0.5) * 100).toFixed(1)}%`);
    };
    const leave = () => { card.style.rotate = ''; };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    return () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
      card.classList.remove('depth-tilt');
      card.style.rotate = '';
    };
  });
  return () => handlers.forEach(off => off());
}

function footerMark(gsap: Gsap, ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger, fine: boolean) {
  const mark = document.querySelector<SVGSVGElement>('[data-footer-mark] svg');
  if (!mark) return;
  const stroke = mark.querySelector<SVGTextElement>('.footer-mark-stroke')!;
  const fill = mark.querySelector<SVGGElement>('.footer-mark-fill')!;
  const flower = mark.querySelector<SVGImageElement>('.footer-mark-flower')!;
  const pan = mark.querySelector<SVGGElement>('.footer-mark-pan')!;
  // The footer may rest under the page (sticky curtain), so measure from the end of the document.
  const span = () => Math.min(mark.closest('footer')!.offsetHeight, window.innerHeight) * 0.9;
  const timeline = gsap.timeline({
    scrollTrigger: {
      start: () => ScrollTrigger.maxScroll(window) - span(),
      end: () => ScrollTrigger.maxScroll(window) - 4,
      scrub: DEPTH.scrub,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .fromTo(stroke, { strokeDasharray: '0 1400' }, { strokeDasharray: '1400 0', ease: 'none', duration: 0.65 }, 0)
    .fromTo(fill, { opacity: 0 }, { opacity: 1, ease: 'power1.in', duration: 0.5 }, 0.4)
    .fromTo(flower, { y: 140, scale: 1.25, transformOrigin: '50% 50%' }, { y: 0, scale: 1, ease: 'power2.out', duration: 0.6 }, 0.4);
  if (!fine) return () => timeline.scrollTrigger?.kill();
  const footer = mark.closest('footer')!;
  const toX = gsap.quickTo(pan, 'x', { duration: 1.2, ease: 'power3.out' });
  const toY = gsap.quickTo(pan, 'y', { duration: 1.2, ease: 'power3.out' });
  const move = (event: PointerEvent) => {
    const box = mark.getBoundingClientRect();
    toX(((event.clientX - box.left) / box.width - 0.5) * 160);
    toY(((event.clientY - box.top) / box.height - 0.5) * 70);
  };
  footer.addEventListener('pointermove', move);
  return () => { footer.removeEventListener('pointermove', move); timeline.scrollTrigger?.kill(); };
}
