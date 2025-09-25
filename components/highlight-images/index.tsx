"use client";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import { ShimmeringText } from "../ui/shimmering-text";
import { useMediaQuery } from "usehooks-ts";

export const HighlightImages = () => {
  const matches = useMediaQuery("(min-width: 768px)");
  const mobileRender = (
    <>
      <Marquee vertical pauseOnHover repeat={100}>
        {new Array(20).fill(1).map((_, idx) => (
          <Image
            key={idx + 1}
            src={`/tieu-bieu/img_${idx + 1}.webp`}
            alt={`Image ${idx + 1}`}
            width={1000}
            height={1000}
            className="object-cover rounded-lg w-64 shadow-lg"
          />
        ))}
      </Marquee>
      <Marquee vertical pauseOnHover reverse repeat={100}>
        {new Array(21).fill(1).map((_, idx) => (
          <Image
            key={idx + 20}
            src={`/tieu-bieu/img_${idx + 20}.webp`}
            alt={`Image ${idx + 1}`}
            width={1000}
            height={1000}
            className="object-cover rounded-lg w-64 shadow-lg"
          />
        ))}
      </Marquee>
    </>
  );
  const desktopRender = (
    <>
      <Marquee vertical pauseOnHover repeat={100}>
        {new Array(14).fill(1).map((_, idx) => (
          <Image
            key={idx + 1}
            src={`/tieu-bieu/img_${idx + 1}.webp`}
            alt={`Image ${idx + 1}`}
            width={1000}
            height={1000}
            className="object-cover rounded-lg w-64 shadow-lg"
          />
        ))}
      </Marquee>
      <Marquee vertical pauseOnHover reverse repeat={100}>
        {new Array(14).fill(1).map((_, idx) => (
          <Image
            key={idx + 14}
            src={`/tieu-bieu/img_${idx + 14}.webp`}
            alt={`Image ${idx + 1}`}
            width={1000}
            height={1000}
            className="object-cover rounded-lg w-64 shadow-lg"
          />
        ))}
      </Marquee>
      <Marquee vertical pauseOnHover repeat={100}>
        {new Array(13).fill(1).map((_, idx) => (
          <Image
            key={idx + 28}
            src={`/tieu-bieu/img_${idx + 28}.webp`}
            alt={`Image ${idx + 1}`}
            width={1000}
            height={1000}
            className="object-cover rounded-lg w-64 shadow-lg"
          />
        ))}
      </Marquee>
    </>
  );
  return (
    <section className="pt-10">
      <div className="container">
        <ShimmeringText
          text="Những hình ảnh tiêu biểu"
          className="font-bold text-2xl sm:text-4xl lg:text-5xl leading-normal tracking-wide"
          color="var(--color-sky-800)"
          shimmerColor="var(--color-sky-100)"
          duration={3}
          repeatDelay={1.5}
        />
      </div>
      <div className="relative mt-8 flex h-[600px] sm:h-[800px] w-full items-center justify-center overflow-hidden gap-2 container">
        {matches ? desktopRender : mobileRender}
        {/*<div className="pointer-events-none absolute inset-x-0 top-0 h-1/8 bg-gradient-to-b from-sky-50"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/8 bg-gradient-to-t from-sky-50"></div>*/}
      </div>
    </section>
  );
};
