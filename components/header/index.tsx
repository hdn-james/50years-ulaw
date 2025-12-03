'use client';

import { motion, useCycle, type Variants } from 'framer-motion';
import { useRef } from 'react';

import { useDimensions } from '@/hooks';
import { MenuToggle } from './menu';
import { Navigation } from './navigation';

const sidebar: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: 'circle(22px at 40px 40px)',
    transition: {
      delay: 0.5,
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

export const Header = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      ref={containerRef}
      className="sticky top-0 z-[9999] w-dvw"
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
    >
      <motion.div className="absolute top-0 bottom-0 left-0 z-[9999] h-dvh w-screen bg-white/90" variants={sidebar} />
      <Navigation isOpen={isOpen} toggleOpen={() => toggleOpen()} />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
