import Image from "next/image";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { Separator } from "./ui/separator";

export const Banner = () => {
  return (
    <section className="relative flex h-dvh snap-start snap-always items-center justify-center">
      <div className="container grid gap-8 md:grid-cols-2 md:gap-0">
        <div className="justify-center-safe items-center-safe flex">
          <Image src="/logo.png" width={395} height={640} alt="Banner" className="h-auto w-2/3" fetchPriority="high" />
        </div>
        <div className="justify-center-safe flex flex-col items-start space-y-2 px-4 sm:items-center md:items-start">
          <h1>
            <ShimmeringText
              text="TRƯỜNG ĐẠI HỌC LUẬT THÀNH PHỐ HỒ CHÍ MINH"
              className="font-bold text-base leading-normal tracking-wide xl:text-lg 2xl:text-2xl"
              color="var(--color-emerald-900)"
              shimmerColor="var(--color-emerald-100)"
              duration={3}
              repeatDelay={1.5}
            />
          </h1>
          <h1>
            <ShimmeringText
              text="KỶ NIỆM 50 NĂM TRUYỀN THỐNG"
              className="font-black text-2xl leading-normal tracking-wide xl:text-3xl 2xl:text-4xl"
              color="var(--color-emerald-900)"
              shimmerColor="var(--color-emerald-100)"
              duration={3}
              repeatDelay={1.5}
            />
          </h1>
          <h1>
            <ShimmeringText
              text="(1976 – 2026)"
              className="font-bold text-base leading-normal tracking-wide xl:text-lg 2xl:text-xl"
              color="var(--color-emerald-900)"
              shimmerColor="var(--color-emerald-100)"
              duration={3}
              repeatDelay={1.5}
            />
          </h1>
          <Separator className="my-3 bg-emerald-900/20" />
          <p className="font-light text-base text-emerald-900 xl:text-lg 2xl:text-xl">
            Chuỗi chương trình kỷ niệm 50 năm truyền thống và 30 năm ngày mang tên Trường Đại học Luật Thành phố Hồ Chí
            Minh một thông điệp mạnh mẽ, vừa nhìn lại chặng đường lịch sử đầy tự hào (50 năm vững truyền thống) vừa định
            hướng cho một tương lai phát triển rực rỡ và bền vững (sáng tương lai)
          </p>

          <Separator className="my-3 bg-emerald-900/20" />
          <p className="font-bold text-2xl text-emerald-900/90 xl:text-3xl 2xl:text-4xl">Lễ kỷ niệm chính thức</p>
          <p className="font-light text-base text-emerald-900/90 xl:text-lg 2xl:text-xl">30/03/2026</p>
        </div>
      </div>
    </section>
  );
};
