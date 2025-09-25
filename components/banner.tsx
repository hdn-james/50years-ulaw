import Image from "next/image";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { Separator } from "./ui/separator";

export const Banner = () => {
  return (
    <section className="relative flex h-dvh snap-start snap-always items-center justify-center">
      <div className="container grid md:grid-cols-2 gap-8 md:gap-0">
        <div className="justify-center-safe items-center-safe flex">
          <Image src="/logo.png" width={39.5 * 10} height={64 * 10} alt="Banner" className="h-auto w-2/3" />
        </div>
        <div className="justify-center-safe flex flex-col items-start sm:items-center md:items-start space-y-2 px-4">
          <h1>
            <ShimmeringText
              text="TRƯỜNG ĐẠI HỌC LUẬT THÀNH PHỐ HỒ CHÍ MINH"
              className="font-bold text-base xl:text-lg 2xl:text-2xl leading-normal tracking-wide"
              color="var(--color-emerald-900)"
              shimmerColor="var(--color-emerald-100)"
              duration={3}
              repeatDelay={1.5}
            />
          </h1>
          <h1>
            <ShimmeringText
              text="KỶ NIỆM 50 NĂM TRUYỀN THỐNG"
              className="font-black text-2xl xl:text-3xl 2xl:text-4xl leading-normal tracking-wide"
              color="var(--color-emerald-900)"
              shimmerColor="var(--color-emerald-100)"
              duration={3}
              repeatDelay={1.5}
            />
          </h1>
          <h1>
            <ShimmeringText
              text="(1976 – 2026)"
              className="font-bold text-base xl:text-lg 2xl:text-xl leading-normal tracking-wide"
              color="var(--color-emerald-900)"
              shimmerColor="var(--color-emerald-100)"
              duration={3}
              repeatDelay={1.5}
            />
          </h1>
          <Separator className="my-3 bg-emerald-900/20" />
          <p className="font-light text-base xl:text-lg 2xl:text-xl text-emerald-900">
            Chuỗi chương trình kỷ niệm 50 năm truyền thống và 30 năm ngày mang tên Trường Đại học Luật Thành phố Hồ Chí
            Minh một thông điệp mạnh mẽ, vừa nhìn lại chặng đường lịch sử đầy tự hào (50 năm vững truyền thống) vừa định
            hướng cho một tương lai phát triển rực rỡ và bền vững (sáng tương lai)
          </p>

          <Separator className="my-3 bg-emerald-900/20" />
          <p className="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-emerald-900/90">Lễ kỷ niệm chính thức</p>
          <p className="font-light text-base xl:text-lg 2xl:text-xl text-emerald-900/90">30/03/2026</p>
        </div>
      </div>
    </section>
  );
};
