"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { steps } from "@/constants";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { MobileVersion } from "./mobile";

const MotionImage = motion.create(Image);

export function Message50Years() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;

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
      const index = Math.min(steps.length - 1, Math.round(scrollY / stepHeight));

      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, isMobile]);

  // Render mobile version only after mounted to prevent hydration mismatch
  if (mounted && isMobile) return <MobileVersion />;

  return (
    <section
      ref={containerRef}
      aria-label="Kỷ niệm 50 năm truyền thống Trường Đại học Luật TP.HCM"
      id="le-meeting-ky-niem-50-nam"
      className="relative mx-auto flex max-w-7xl justify-between"
    >
      {/* Left column (text) */}
      <div className="sticky top-0 left-0 flex h-dvh w-3/5 flex-col items-center justify-center p-6">
        {/*<h2 className="absolute top-20 text-center font-bold text-2xl text-blue-800 md:text-3xl">
          Thông điệp 50 năm truyền thống
        </h2>*/}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="xl:text-2xl leading-relaxed text-ulaw-navy"
          >
            {steps[activeIndex].text}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right column (images) */}
      <div className="w-2/5">
        {steps.map((step, i) => (
          <div key={step.key} className="flex h-dvh items-center justify-center scroll-snap-align-start">
            <div className="flex flex-col items-center-safe justify-center-safe gap-4">
              {step.img.map((image, idx) => (
                <MotionImage
                  key={idx}
                  src={image}
                  alt={`Step ${i}`}
                  width={499}
                  height={333}
                  className={cn("rounded-xl shadow-xl", i === 0 && "rounded-none shadow-none")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  loading={i === activeIndex ? "eager" : "lazy"}
                  sizes="(max-width: 600px) 100vw, 499px"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn("h-2 w-2 rounded-full transition-colors", i === activeIndex ? "bg-ulaw-blue" : "bg-gray-300")}
          />
        ))}
      </div>
    </section>
  );
}
