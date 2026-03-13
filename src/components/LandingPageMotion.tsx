"use client";

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';

gsap.registerPlugin(ScrollTrigger);

function setupTiltCards(cards: HTMLElement[]) {
  const cleanups: Array<() => void> = [];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!finePointer) {
    return cleanups;
  }

  cards.forEach((card) => {
    const inner = (card.querySelector('[data-tilt-inner]') as HTMLElement | null) ?? card;

    const handleMove = (event: PointerEvent) => {
      const bounds = card.getBoundingClientRect();
      const xRatio = (event.clientX - bounds.left) / bounds.width - 0.5;
      const yRatio = (event.clientY - bounds.top) / bounds.height - 0.5;
      const rotateY = gsap.utils.clamp(-6, 6, xRatio * 12);
      const rotateX = gsap.utils.clamp(-6, 6, yRatio * -12);

      gsap.to(inner, {
        rotateX,
        rotateY,
        y: -4,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: true,
        transformPerspective: 1200,
        transformOrigin: 'center center',
      });
    };

    const handleLeave = () => {
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    card.addEventListener('pointermove', handleMove);
    card.addEventListener('pointerleave', handleLeave);

    cleanups.push(() => {
      card.removeEventListener('pointermove', handleMove);
      card.removeEventListener('pointerleave', handleLeave);
    });
  });

  return cleanups;
}

export function LandingPageMotion() {
  const { isDesktop, prefersReducedMotion, ready } = useMotionPreferences(1024);

  useEffect(() => {
    if (!ready) {
      return;
    }

    document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion);

    if (prefersReducedMotion) {
      return () => {
        document.documentElement.classList.remove('reduced-motion');
      };
    }

    const cleanupHandlers: Array<() => void> = [];
    const context = gsap.context(() => {
      const tiltTargets = Array.from(document.querySelectorAll<HTMLElement>('#que-hacemos [data-tilt-card]'));
      cleanupHandlers.push(...setupTiltCards(tiltTargets));

      const methodSection = document.getElementById('metodo');
      const methodStage = document.querySelector<HTMLElement>('[data-method-stage]');
      const methodPath = document.querySelector<SVGPathElement>('[data-method-path]');
      const methodSteps = Array.from(document.querySelectorAll<HTMLElement>('[data-method-step]'));
      const methodGraphic = document.querySelector<HTMLElement>('[data-method-graphic]');

      if (!methodSection || !methodStage || methodSteps.length === 0) {
        return;
      }

      if (methodPath) {
        const pathLength = methodPath.getTotalLength();
        methodPath.style.strokeDasharray = `${pathLength}`;
        methodPath.style.strokeDashoffset = `${pathLength}`;
      }

      if (isDesktop) {
        gsap.set(methodSteps, { y: 40, opacity: 0.22, scale: 0.94 });
        if (methodGraphic) {
          gsap.set(methodGraphic, { y: 56, opacity: 0.18, scale: 0.94 });
        }
      } else {
        gsap.set(methodSteps, { opacity: 0, y: 28, scale: 0.96 });
        gsap.set(methodSteps[0], { opacity: 1, y: 0, scale: 1 });
        if (methodGraphic) {
          gsap.set(methodGraphic, { y: 32, opacity: 0, scale: 0.94 });
        }
      }

      const methodTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: methodSection,
          start: 'top top',
          end: isDesktop ? '+=1700' : '+=2200',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          pinReparent: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (isDesktop) {
        if (methodPath) {
          methodTimeline.to(methodPath, { strokeDashoffset: 0, opacity: 1, duration: 0.6, ease: 'none' }, 0);
        }

        methodSteps.forEach((step, index) => {
          const glow = step.querySelector<HTMLElement>('[data-step-glow]');
          const position = 0.18 + index * 0.18;

          methodTimeline.to(
            step,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              borderColor: 'rgba(196, 91, 255, 0.62)',
              boxShadow: '0 18px 50px rgba(118, 34, 214, 0.18)',
              duration: 0.22,
            },
            position,
          );

          if (glow) {
            methodTimeline.to(
              glow,
              {
                opacity: 1,
                scale: 1,
                duration: 0.2,
              },
              position,
            );
          }
        });

        if (methodGraphic) {
          methodTimeline.to(
            methodGraphic,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.28,
            },
            0.96,
          );
        }
      } else {
        if (methodPath) {
          gsap.set(methodPath, { opacity: 0 });
        }

        methodSteps.forEach((step, index) => {
          const glow = step.querySelector<HTMLElement>('[data-step-glow]');
          const position = index * 0.22;
          const previousStep = index > 0 ? methodSteps[index - 1] : null;

          if (previousStep) {
            methodTimeline.to(
              previousStep,
              {
                opacity: 0,
                y: -20,
                scale: 0.96,
                duration: 0.12,
              },
              position,
            );
          }

          methodTimeline.to(
            step,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              borderColor: 'rgba(196, 91, 255, 0.62)',
              boxShadow: '0 16px 44px rgba(118, 34, 214, 0.18)',
              duration: 0.14,
            },
            position + 0.04,
          );

          if (glow) {
            methodTimeline.to(
              glow,
              {
                opacity: 1,
                scale: 1,
                duration: 0.14,
              },
              position + 0.04,
            );
          }
        });

        if (methodGraphic) {
          methodTimeline.to(
            methodSteps[methodSteps.length - 1],
            {
              opacity: 0.22,
              y: -14,
              duration: 0.12,
            },
            0.94,
          );

          methodTimeline.to(
            methodGraphic,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.18,
            },
            1.02,
          );
        }
      }
    });

    ScrollTrigger.refresh();

    return () => {
      cleanupHandlers.forEach((cleanup) => cleanup());
      context.revert();
      document.documentElement.classList.remove('reduced-motion');
    };
  }, [isDesktop, prefersReducedMotion, ready]);

  return null;
}
