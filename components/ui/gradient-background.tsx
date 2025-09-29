"use client";

import { type HTMLMotionProps, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type GradientBackgroundProps = HTMLMotionProps<"div"> & {
  transition?: Transition;
  safariBackground?: string;
};

function GradientBackground({
  className,
  transition = { duration: 10, ease: "easeInOut", repeat: Infinity },
  safariBackground,
  ...props
}: GradientBackgroundProps) {
  const isSafari = useMemo(() => {
    if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1) {
      return true;
    }
    return false;
  }, []);

  if (isSafari) {
    return <div className={cn(className, safariBackground)}>{props.children as React.ReactNode}</div>;
  }
  return (
    <motion.div
      data-slot="gradient-background"
      className={cn(
        "size-full bg-[length:300%_300%] bg-gradient-to-br from-0% from-fuchsia-400 via-50% via-violet-500 to-100% to-fuchsia-600",
        className,
      )}
      animate={{
        backgroundPosition: ["0% 0%", "50% 50%", "100% 0%", "50% 100%", "0% 50%", "100% 100%", "0% 0%"],
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={transition}
      {...props}
    />
  );
}

export { GradientBackground, type GradientBackgroundProps };
