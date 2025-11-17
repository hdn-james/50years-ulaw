"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface AnimatedDigitProps {
  value: number;
}

function AnimatedDigit({ value }: AnimatedDigitProps) {
  const [currentDigit, setCurrentDigit] = useState(value);
  const [prevDigit, setPrevDigit] = useState(value);

  useEffect(() => {
    if (value !== currentDigit) {
      setPrevDigit(currentDigit);
      setCurrentDigit(value);
    }
  }, [value, currentDigit]);

  return (
    <div className="relative inline-block overflow-hidden w-[1ch] h-full">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={currentDigit}
          initial={{ y: prevDigit < currentDigit ? "100%" : "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: prevDigit < currentDigit ? "-100%" : "100%" }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
          className="absolute inset-0 flex items-center justify-center tabular-nums"
        >
          {currentDigit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

interface AnimatedNumberProps {
  value: number;
  digits: number;
}

function AnimatedNumber({ value, digits }: AnimatedNumberProps) {
  const valueStr = String(value);
  const digitArray = valueStr.split("").map(Number);

  return (
    <div className="inline-flex h-full">
      {digitArray.map((digit, index) => (
        <AnimatedDigit key={`digit-${index}`} value={digit} />
      ))}
    </div>
  );
}

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const calculateScale = useCallback(() => {
    if (contentRef.current) {
      const viewportHeight = window.innerHeight;
      const contentHeight = contentRef.current.scrollHeight;
      const viewportWidth = window.innerWidth;
      const contentWidth = contentRef.current.scrollWidth;

      // Calculate scale based on both height and width constraints
      const scaleHeight = viewportHeight / (contentHeight + 80); // 80px for padding
      const scaleWidth = viewportWidth / (contentWidth + 64); // 64px for padding
      const newScale = Math.min(scaleHeight, scaleWidth, 1);

      setScale(newScale);
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    const targetDate = new Date("2026-03-30T00:00:00+07:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Auto hide splash screen after 10 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500); // Wait for exit animation
    }, 10000);

    // Calculate initial scale
    setTimeout(calculateScale, 100);

    // Recalculate on resize
    window.addEventListener("resize", calculateScale);

    return () => {
      clearInterval(timer);
      clearTimeout(hideTimer);
      window.removeEventListener("resize", calculateScale);
    };
  }, [onComplete, calculateScale]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 500); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-ulaw-teal via-ulaw-dark to-ulaw-navy overflow-hidden"
        >
          <div
            ref={contentRef}
            className="relative flex flex-col items-center justify-center px-4 py-4 sm:py-6 md:py-8 text-center"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease-out",
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 md:mb-8 lg:mb-12 flex-shrink-0"
            >
              <div className="relative w-[280px] h-[196px] sm:w-[350px] sm:h-[245px] md:w-[400px] md:h-[280px] lg:w-[500px] lg:h-[350px]">
                <Image src="/logo1.webp" alt="ULAW 50 Năm - 1976-2026" fill className="object-contain" priority />
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-6 md:mb-8 flex-shrink-0"
            >
              <p className="mb-4 md:mb-6 text-base md:text-lg font-medium text-white/90">Đếm ngược đến ngày kỷ niệm</p>
              <div className="grid grid-cols-4 gap-3 md:gap-6">
                {/* Days */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-white/15 p-4 md:p-6 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none h-[40px] md:h-[60px] lg:h-[70px] flex items-center justify-center">
                    <AnimatedNumber value={timeLeft.days} digits={3} />
                  </div>
                  <div className="mt-3 text-xs md:text-sm lg:text-base font-medium text-white/80">Ngày</div>
                </div>

                {/* Hours */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-white/15 p-4 md:p-6 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none h-[40px] md:h-[60px] lg:h-[70px] flex items-center justify-center">
                    <AnimatedNumber value={timeLeft.hours} digits={2} />
                  </div>
                  <div className="mt-3 text-xs md:text-sm lg:text-base font-medium text-white/80">Giờ</div>
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-white/15 p-4 md:p-6 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none h-[40px] md:h-[60px] lg:h-[70px] flex items-center justify-center">
                    <AnimatedNumber value={timeLeft.minutes} digits={2} />
                  </div>
                  <div className="mt-3 text-xs md:text-sm lg:text-base font-medium text-white/80">Phút</div>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-white/15 p-4 md:p-6 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none h-[40px] md:h-[60px] lg:h-[70px] flex items-center justify-center">
                    <AnimatedNumber value={timeLeft.seconds} digits={2} />
                  </div>
                  <div className="mt-3 text-xs md:text-sm lg:text-base font-medium text-white/80">Giây</div>
                </div>
              </div>
            </motion.div>

            {/* Target Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-6 md:mb-8 flex-shrink-0"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">30 Tháng 3, 2026</p>
            </motion.div>

            {/* Skip Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              onClick={handleSkip}
              className="group mt-4 rounded-full border-2 border-white/50 bg-white/10 px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-medium text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tiếp tục
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </motion.button>
          </div>

          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--color-ulaw-light)] blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[var(--color-ulaw-green)] blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.22, 0.12],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-ulaw-purple)] blur-3xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
