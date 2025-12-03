"use client";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Separator } from "../ui/separator";
import { SlidingNumber } from "../ui/sliding-number";

export const History = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use desktop version by default to prevent hydration mismatch
  const dPath =
    mounted && isMobile
      ? "M0,70 C480,150 960,0 1440,160 L1440,800 L0,800 Z"
      : "M0,120 C480,250 960,0 1440,160 L1440,800 L0,800 Z";

  return (
    <section id="lich-su-phat-trien" className="relative py-10">
      {/* Red background with wave */}
      <div className="absolute inset-0 z-0">
        <svg
          className="h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="var(--color-ulaw-blue2)" d={dPath} />
        </svg>
      </div>

      {/* Content */}
      <div className="container relative z-20 h-full justify-start text-white">
        <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Lịch sử phát triển
        </h2>
        <div className="mt-28 flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1976} to={1976} duration={1} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường Cán bộ Tư pháp được thành lập địa chỉ đặt tại khu nhà số 47 đường 30/4. Đồng thời, Trường Đại học
            Tổng hợp TP.HCM (có bộ môn Luật sau nâng lên thành Khoa Luật) được thành lập.
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1976} to={1982} duration={1} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường Cán bộ Tư pháp được giao cho Bộ Tư pháp quản lý và đổi tên thành Trường Trung học Pháp lý TP.HCM.
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1982} to={1983} duration={1} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường Trung học Pháp lý TP.HCM phối hợp với Trường Đại học Pháp lý (nay là Trường Đại học Luật Hà Nội) mở
            các khóa Đại học chính quy.
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1976} to={1987} duration={1.5} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">Đổi tên thành Phân hiệu Đại học Pháp lý TP.HCM.</div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1987} to={1993} duration={2} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">Đổi tên thành Phân hiệu Đại học Luật TP.HCM.</div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-wrap font-extrabold text-4xl sm:w-1/4 text-shadow-ulaw-purple">
            <SlidingNumber from={0} to={30} duration={3} className="font-extrabold text-4xl" digitHeight={40} />
            <p>/</p>
            <SlidingNumber from={0} to={3} duration={3} className="font-extrabold text-4xl" digitHeight={40} />
            <p>/</p>
            <SlidingNumber from={1993} to={1996} duration={3} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Chính thức mang tên Trường Đại học Luật (thuộc Đại học Quốc gia TP.HCM) trên cơ sở hợp nhất giữa Phân hiệu
            Đại học Luật TP. HCM và Khoa Luật của Trường Đại học Tổng hợp TP.HCM.
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-wrap font-extrabold text-4xl sm:w-1/4">
            <SlidingNumber from={1996} to={2000} duration={4} className="font-extrabold text-4xl" digitHeight={40} />
            <p>&nbsp;-&nbsp;nay</p>
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường Đại học Luật tách ra khỏi Đại học Quốc gia và trực thuộc Bộ Giáo dục và Đào tạo cho đến nay.
          </div>
        </div>
      </div>

      {/* Big rotated text */}
      <div className="-rotate-90 absolute top-1/3 right-0 origin-bottom-right font-bold text-5xl text-shadow-emerald-300/50 text-sky-300/50 leading-none">
        1976 – 2026
      </div>
    </section>
  );
};
