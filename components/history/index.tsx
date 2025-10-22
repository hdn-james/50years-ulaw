"use client";
import { useMediaQuery } from "usehooks-ts";
import { Separator } from "../ui/separator";
import { SlidingNumber } from "../ui/sliding-number";

export const History = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dPath = isMobile
    ? "M0,70 C480,150 960,0 1440,160 L1440,800 L0,800 Z"
    : "M0,120 C480,250 960,0 1440,160 L1440,800 L0,800 Z";
  return (
    <section className="relative py-10">
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
            Trường được thành lập với tên Trường Đào tạo cán bộ tư pháp miền Nam theo quyết định của Chính phủ cách mạng
            Lâm thời Miền Nam Việt Nam.
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1976} to={1987} duration={1} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường trở thành Phân hiệu Phân hiệu Đại học Pháp Lý TP.HCM trực thuộc Bộ Tư pháp.
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1987} to={1993} duration={2} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường đổi tên thành Phân hiệu đại học luật TP.HCM, trực thuộc Bộ Tư pháp.
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-1/4">
            <SlidingNumber from={1993} to={1996} duration={3} className="font-extrabold text-4xl" digitHeight={40} />
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường chính thức được đặt tên là Trường Đại học Luật TP.HCM, trực thuộc Đại học Quốc gia TP.HCM (trên cơ sở
            sáp nhập Phân hiệu Đại học Luật TP.HCM và Khoa Luật Trường Đại học Tổng hợp TP.HCM).
          </div>
        </div>

        <Separator className="my-8 w-10/12 sm:w-9/10" />

        <div className="flex w-10/12 flex-col justify-center gap-4 sm:w-9/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-wrap font-extrabold text-4xl sm:w-1/4">
            <SlidingNumber from={1996} to={2000} duration={4} className="font-extrabold text-4xl" digitHeight={40} />
            <p>&nbsp;-&nbsp;nay</p>
          </div>
          <div className="font-light text-xl sm:w-3/4">
            Trường trở thành Trường Đại học Luật TP.HCM, trực thuộc Bộ Giáo dục và Đào tạo.
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
