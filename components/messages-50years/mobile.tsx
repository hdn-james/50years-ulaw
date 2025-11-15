import { steps } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
export const MobileVersion = () => {
  return (
    <div id="le-ky-niem-50-nam" className="container space-y-4 py-10">
      <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Thông điệp 50 năm truyền thống
      </h2>

      {steps.map((step) => (
        <div key={step.key} className="space-y-4 leading-relaxed text-ulaw-navy/90">
          <div className="mt-8">{step.text}</div>
          <div className="flex gap-4 w-full justify-center items-center">
            {step.img.map((image, idx) => (
              <Image
                key={idx}
                src={image}
                alt={step.key}
                width={400}
                height={400}
                className={cn("rounded-lg shadow-md h-auto object-cover", step.img.length <= 1 ? "w-full" : "w-2/5")}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
