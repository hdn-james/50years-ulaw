"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimelineEvent } from "./timelineData";

interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
}

export const TimelineCard = ({ event, index }: TimelineCardProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    margin: "0% 0px -25% 0px",
    amount: 0.3,
    once: true,
  });

  const getPhaseStyles = () => {
    switch (event.phase) {
      case "before":
        return {
          border: "border-emerald-200",
          bg: "bg-sky-50/80",
          title: "text-emerald-800",
          date: "text-emerald-700",
        };
      case "main":
        return {
          border: "border-ulaw-blue",
          bg: "bg-gradient-to-r from-ulaw-teal via-40% via-ulaw-blue to-ulaw-blue2",
          title: "text-white",
          date: "text-white",
        };
      case "after":
        return {
          border: "border-sky-200",
          bg: "bg-sky-50/80",
          title: "text-sky-800",
          date: "text-sky-700",
        };
      default:
        return {
          border: "border-gray-200",
          bg: "bg-white",
          title: "text-gray-900",
          date: "text-gray-600",
        };
    }
  };

  const styles = getPhaseStyles();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 60, scale: 0.9 }}
      transition={{
        duration: 0.7,
        delay: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "relative rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-sm transition-shadow",
        styles.border,
        styles.bg,
        event.phase === "main"
          ? "min-h-[180px] sm:min-h-[200px] flex flex-col justify-center shadow-2xl"
          : "shadow-lg hover:shadow-xl",
      )}
    >
      {/* Date badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={cn(
          "inline-block rounded-full px-3 py-1 mb-2 sm:mb-3 text-xs sm:text-sm font-semibold",
          event.phase === "main"
            ? "bg-white/20 text-white text-center sm:text-base"
            : "bg-white border border-current shadow-sm",
          styles.date,
        )}
      >
        {event.date}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={cn(
          "font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3",
          styles.title,
          event.phase === "main" && "text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl",
        )}
      >
        {event.title}
      </motion.h3>

      {/* Description (for main event) */}
      {event.description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={cn(
            "text-base sm:text-lg font-medium leading-relaxed",
            event.phase === "main" ? "text-center text-white mt-2" : styles.title,
          )}
        >
          {event.description}
        </motion.p>
      )}

      {/* Items list */}
      {event.items && event.items.length > 0 && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={cn(
            "list-disc list-inside space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base",
            event.phase === "main" ? "text-white" : "text-slate-700",
          )}
        >
          {event.items.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
              className="leading-relaxed"
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};
