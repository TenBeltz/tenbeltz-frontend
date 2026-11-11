import { initHeaderSymbol } from './header-symbol';

type Gsap = typeof import('gsap').gsap;
type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger;

/** One decorative return journey, without changing the navigation or page content. */
export function initBrandFlight(gsap: Gsap, ScrollTrigger: ScrollTriggerType) {
  const symbol = document.querySelector<HTMLElement>('[data-header-symbol]');
  const section = document.querySelector<HTMLElement>('.business-start');
  const destination = section?.querySelector<HTMLElement>('.eyebrow');
  if (!symbol || !section || !destination) return;

  let timeline: ReturnType<Gsap['timeline']> | undefined;
  let flyer: HTMLElement | undefined;
  let done = false;
  const restore = () => {
    if (done) return;
    done = true;
    timeline?.kill();
    flyer?.remove();
    symbol.classList.remove('is-travelling');
    window.removeEventListener('resize', restore);
    window.removeEventListener('scroll', checkVisibility);
  };
  const checkVisibility = () => {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 80 || rect.top > innerHeight) restore();
  };
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top 82%',
    once: true,
    onEnter: () => {
      if (done || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      flyer = symbol.cloneNode(true) as HTMLElement;
      flyer.classList.add('brand-flight');
      flyer.removeAttribute('data-header-symbol');
      flyer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(flyer);
      const blossom = initHeaderSymbol(flyer);
      const travel = { progress: 0 };
      symbol.classList.add('is-travelling');
      const place = () => {
        if (!flyer) return;
        const origin = symbol.getBoundingClientRect();
        const end = destination.getBoundingClientRect();
        const t = travel.progress;
        // Settle in the margin beside the eyebrow, leaving all copy and links clear.
        const x = origin.left + (Math.max(28, end.left - 58) - origin.left) * t;
        const y = origin.top + (end.top + end.height / 2 - 16 - origin.top) * t;
        gsap.set(flyer, { x, y, scale: 1 + 1.1 * t });
      };
      place();
      void blossom(true);
      timeline = gsap.timeline({ onComplete: restore, onInterrupt: restore });
      timeline.to(travel, { progress: 1, duration: 1.65, ease: 'power2.inOut', onUpdate: place })
        .to(travel, { progress: 1, duration: 1.05, onUpdate: place })
        .call(() => { void blossom(false); })
        .to(travel, { progress: 0, duration: 1.65, ease: 'power2.inOut', onUpdate: place });
      window.addEventListener('resize', restore, { once: true });
      window.addEventListener('scroll', checkVisibility, { passive: true });
    },
  });
  return () => { trigger.kill(); restore(); };
}
