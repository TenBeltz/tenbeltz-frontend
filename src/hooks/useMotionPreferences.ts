import { useEffect, useState } from 'react';

interface MotionPreferences {
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  ready: boolean;
}

export function useMotionPreferences(minWidth = 768): MotionPreferences {
  const [state, setState] = useState<MotionPreferences>({
    isDesktop: false,
    prefersReducedMotion: false,
    ready: false,
  });

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia(`(min-width: ${minWidth}px)`);

    const update = () => {
      setState({
        isDesktop: desktopQuery.matches,
        prefersReducedMotion: reducedMotionQuery.matches,
        ready: true,
      });
    };

    update();

    reducedMotionQuery.addEventListener('change', update);
    desktopQuery.addEventListener('change', update);

    return () => {
      reducedMotionQuery.removeEventListener('change', update);
      desktopQuery.removeEventListener('change', update);
    };
  }, [minWidth]);

  return state;
}
