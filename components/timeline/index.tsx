"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimelineDot } from "./TimelineDot";
import { TimelineCard } from "./TimelineCard";
import { timelineEvents } from "./timelineData";

export const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="tong-quan-su-kien"
      className={cn(
        "relative py-8 sm:py-10 lg:py-20 min-h-screen overflow-hidden",
        "bg-gradient-to-b from-sky-50/30 to-blue-50/30",
      )}
    >
      <div className={cn("z-10 container")}>
        <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Tổng quan sự kiện
        </h2>

        <div ref={containerRef} className={cn("relative mt-8 max-w-6xl mx-auto flex gap-8 sm:gap-12 lg:gap-16")}>
          {/* Vertical line container */}
          <div className={cn("relative flex-shrink-0 w-8 sm:w-12 flex items-center justify-center")}>
            {/* Background line (full length, lighter) */}
            <div
              className={cn(
                "absolute top-0 bottom-0 w-0.5 sm:w-1",
                "bg-gradient-to-b from-emerald-200 via-blue-200 to-sky-200 rounded-full",
              )}
            />
            {/* Animated line that follows scroll */}
            <motion.div
              className={cn(
                "absolute top-0 w-0.5 sm:w-1 origin-top",
                "bg-gradient-to-b from-emerald-400 via-blue-500 to-sky-400 rounded-full shadow-md",
              )}
              style={{
                scaleY: scaleY,
                height: "100%",
              }}
            />
          </div>

          {/* Cards container */}
          <div className={cn("flex-1 space-y-8 sm:space-y-2 md:space-y-20 lg:space-y-24 pt-4 pb-8")}>
            {timelineEvents.map((event, index) => (
              <div key={event.id} className={cn("relative")}>
                {/* Dot aligned with card */}
                <div className={cn("absolute top-6 w-5 h-5", "-left-[58px] sm:-left-[82px] lg:-left-[98px]")}>
                  <TimelineDot phase={event.phase} />
                </div>

                {/* Card */}
                <TimelineCard event={event} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
