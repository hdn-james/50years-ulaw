"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { steps } from "@/constants";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { MobileVersion } from "./mobile";

export function Message50Years() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Distance from top of viewport to top of component
      const offsetTop = rect.top + window.scrollY;
      const scrollY = window.scrollY - offsetTop;

      if (scrollY < 0) {
        setActiveIndex(0);
        return;
      }

      const stepHeight = window.innerHeight; // full screen height per step
      const index = Math.min(steps.length - 1, Math.floor(scrollY / stepHeight));

      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isMobile) return <MobileVersion />;

  return (
    <div ref={containerRef} className="container relative flex max-w-7xl">
      {/* Left column (text) */}
      <div className="sticky top-0 flex h-dvh w-3/5 flex-col items-center justify-center p-6">
        {/*<h2 className="absolute top-20 text-center font-bold text-2xl text-blue-800 md:text-3xl">
          Thông điệp 50 năm truyền thống
        </h2>*/}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            {steps[activeIndex].text}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right column (images) */}
      <div className="w-2/5">
        {steps.map((step, i) => (
          <div key={step.key} className="flex h-dvh items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
              {step.img.map((image, idx) => (
                <motion.img
                  key={idx}
                  src={image}
                  alt={`Step ${i}`}
                  className={cn("rounded-xl shadow-xl", i === 0 && "rounded-none shadow-none")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
