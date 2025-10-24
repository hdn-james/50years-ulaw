"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { timelineConfig } from "./config";

interface TimelineDotProps {
  phase: "before" | "main" | "after";
}

export const TimelineDot = ({ phase }: TimelineDotProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    margin: timelineConfig.scroll.triggerMargin,
    amount: timelineConfig.scroll.visibilityThreshold,
    once: timelineConfig.scroll.playOnce,
  });

  const getPhaseColor = () => {
    switch (phase) {
      case "before":
        return timelineConfig.colors.phases.before.dot;
      case "main":
        return timelineConfig.colors.phases.main.dot;
      case "after":
        return timelineConfig.colors.phases.after.dot;
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center")}>
      <motion.div
        ref={ref}
        className={cn("rounded-full border-4 border-white shadow-lg z-10 relative", getPhaseColor())}
        initial={{ scale: timelineConfig.animation.dot.scale.normal }}
        animate={{
          scale: inView ? timelineConfig.animation.dot.scale.active : timelineConfig.animation.dot.scale.normal,
          boxShadow: inView ? timelineConfig.effects.dotGlow.active : timelineConfig.effects.dotGlow.inactive,
        }}
        transition={timelineConfig.animation.dot.transition}
        style={{ width: 20, height: 20 }}
      />
      {/* Pulse ring animation when active */}
      {inView && (
        <motion.div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20",
            getPhaseColor(),
          )}
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{ width: 20, height: 20 }}
        />
      )}
    </div>
  );
};
