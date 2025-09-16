import { ShimmeringText } from './ui/shimmering-text';

export const Banner = () => {
  return (
    <section className="relative flex h-[calc(100vh-6.5rem)] flex-col items-center justify-center bg-center bg-cover bg-gold-luxury px-6 text-amber-400">
      <div className="justify-center-safe items-center-safe flex flex-col gap-4">
        <ShimmeringText
          text="TRƯỜNG ĐẠI HỌC LUẬT THÀNH PHỐ HỒ CHÍ MINH"
          className="font-black text-base leading-normal tracking-wide md:text-2xl lg:text-4xl xl:text-5xl"
          color="var(--color-emerald-800)"
          shimmerColor="var(--color-emerald-100)"
          duration={3}
          repeatDelay={1.5}
        />
        <ShimmeringText
          text="KỶ NIỆM 50 NĂM TRUYỀN THỐNG"
          className="font-black text-base leading-normal tracking-wide md:text-2xl lg:text-4xl xl:text-5xl"
          color="var(--color-emerald-800)"
          shimmerColor="var(--color-emerald-100)"
          duration={3}
          repeatDelay={3}
        />
        <ShimmeringText
          text="(1976 – 2026)"
          className="font-black text-base leading-normal tracking-wide md:text-2xl lg:text-4xl xl:text-5xl"
          color="var(--color-emerald-800)"
          shimmerColor="var(--color-emerald-100)"
          duration={3}
          repeatDelay={4.5}
        />
      </div>

      <div className="mt-8">
        <ShimmeringText
          text='"50 năm ULAW - Vững truyền thống, sáng tương lai"'
          className="font-semibold text-base text-shadow-amber-500 sm:text-base md:mt-6 md:text-xl lg:text-3xl xl:text-4xl"
          color="var(--color-amber-400)"
          shimmerColor="var(--color-amber-100)"
          duration={1}
          repeatDelay={1.5}
        />
      </div>
    </section>
  );
};
