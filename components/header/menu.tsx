import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path fill="transparent" strokeWidth="3" stroke="var(--color-emerald-800)" strokeLinecap="round" {...props} />
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

export const MenuItem = ({ content, href, onClick }: { content: ReactNode; href: string; onClick?: () => void }) => {
  return (
    <motion.li
      className="m-0 mb-5 flex cursor-pointer justify-self-start p-0 font-semibold text-emerald-700 text-xl"
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <a href={href} onClick={onClick} className="block w-full">
        {content}
      </a>
    </motion.li>
  );
};

export const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button
    className="absolute top-[30px] left-[29px] z-[9999] cursor-pointer rounded-full border-none bg-transparent text-emerald-800 outline-none"
    onClick={toggle}
    aria-label="Open navigation menu"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
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
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);
