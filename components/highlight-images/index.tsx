"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Marquee } from "@/components/ui/marquee";

export const HighlightImages = () => {
  const [mounted, setMounted] = useState(false);
  const matches = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by waiting for client-side mount
  if (!mounted) {
    return (
      <section id="thu-vien-anh" className="pt-10">
        <div className="container">
          <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
            Những hình ảnh tiêu biểu
          </h2>
        </div>
        <div className="container relative mt-8 flex h-[600px] w-full items-center justify-center gap-2 overflow-hidden sm:h-[800px]">
          {/* Loading state */}
        </div>
      </section>
    );
  }
  const renderMarquee = (startIdx: number, count: number, reverse = false) => (
    <Marquee vertical pauseOnHover reverse={reverse} repeat={100}>
      {new Array(count).fill(1).map((_, idx) => (
        <Image
          key={startIdx + idx}
          src={`/tieu-bieu/img_${startIdx + idx}.webp`}
          alt={`Image ${startIdx + idx}`}
          width={256}
          height={144}
          sizes="(max-width: 768px) 100vw, 256px"
          className="w-64 h-auto rounded-lg object-cover shadow-lg aspect-video"
        />
      ))}
    </Marquee>
  );

  const mobileRender = (
    <>
      {renderMarquee(1, 20)}
      {renderMarquee(20, 21, true)}
    </>
  );

  const desktopRender = (
    <>
      {renderMarquee(1, 14)}
      {renderMarquee(14, 14, true)}
      {renderMarquee(28, 13)}
    </>
  );
  return (
    <section id="thu-vien-anh" className="pt-10">
      <div className="container">
        <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Những hình ảnh tiêu biểu
        </h2>
      </div>
      <div className="container relative mt-8 flex h-[600px] w-full items-center justify-center gap-2 overflow-hidden sm:h-[800px]">
        {matches ? desktopRender : mobileRender}
        {/*<div className="pointer-events-none absolute inset-x-0 top-0 h-1/8 bg-gradient-to-b from-sky-50"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/8 bg-gradient-to-t from-sky-50"></div>*/}
      </div>
    </section>
  );
};
