import { motion, stagger } from "framer-motion";
import { routes } from "@/constants";
import { MenuItem } from "./menu";

const navVariants = {
  open: {
    transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) },
  },
  closed: {
    transition: { delayChildren: stagger(0.05, { from: "last" }) },
  },
};

export const Navigation = () => (
  <motion.ul className="absolute top-20 left-6 z-[9999] m-0 list-none p-6" variants={navVariants}>
    {routes.map((route) => (
      <MenuItem key={route.href} content={route.name} />
    ))}
  </motion.ul>
);
