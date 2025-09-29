'use client';

import { motion, stagger, useCycle, type Variants } from 'framer-motion';
import { type ReactNode, useRef } from 'react';
import { routes } from '@/constants';
import { useDimensions } from '@/hooks';

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

const _nav: React.CSSProperties = {
  width: 300,
};

export function Header() {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);

  console.log(height);

  return (
    <motion.nav
      ref={containerRef}
      className="sticky top-0 z-[9999] w-dvw"
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
    >
      <motion.div className="absolute top-0 bottom-0 left-0 z-[9999] h-dvh w-screen bg-white/90" variants={sidebar} />
      <Navigation />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
}

const navVariants = {
  open: {
    transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) },
  },
  closed: {
    transition: { delayChildren: stagger(0.05, { from: 'last' }) },
  },
};

const Navigation = () => (
  <motion.ul className="absolute top-20 left-6 z-[9999] m-0 list-none p-6" variants={navVariants}>
    {routes.map((route) => (
      <MenuItem key={route.href} content={route.name} />
    ))}
  </motion.ul>
);

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const _colors = ['#FF008C', '#D309E1', '#9C1AFF', '#7700FF', '#4400FF'];

const MenuItem = ({ content }: { content: ReactNode }) => {
  return (
    <motion.li
      className="m-0 mb-5 flex cursor-pointer justify-self-start p-0 font-semibold text-emerald-700 text-xl"
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div>{content}</div>
    </motion.li>
  );
};

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path fill="transparent" strokeWidth="3" stroke="var(--color-emerald-800)" strokeLinecap="round" {...props} />
);

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button
    className="absolute top-[30px] left-[29px] z-[9999] cursor-pointer rounded-full border-none bg-transparent text-emerald-800 outline-none"
    onClick={toggle}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
);
