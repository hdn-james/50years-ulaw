import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

type ScrollDirection = 'up' | 'down';

export const useScrollDirection = () => {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('up');

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() as number; // Get the previous value of scrollY
    if (current > previous) {
      setScrollDirection('down');
    } else if (current < previous) {
      setScrollDirection('up');
    }
  });

  return scrollDirection;
};
