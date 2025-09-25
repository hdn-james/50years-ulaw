import Image from "next/image";
import { TypingText } from "../ui/typing-text";
import { Separator } from "../ui/separator";

const texts = [
  {
    num: "70.000",
    text: "cựu người học",
  },
  {
    num: "90%",
    text: "sinh viên tốt nghiệp có việc làm ổn định",
  },
  {
    num: "95,9%",
    text: "đơn vị sử dụng lao động hài lòng về chất lượng người học tốt nghiệp từ Trường Đại học Luật TP.HCM",
  },
  {
    num: "100%",
    text: "chương trình đào tạo đạt chất lượng kiểm định",
  },
];

export const Impression = () => {
  return (
    <section className="w-full h-dvh">
      <div className="relative w-full h-dvh flex justify-center-safe items-center-safe">
        <Image
          src="/sinh-vien-tot-nghiep.webp"
          width={5472}
          height={3648}
          alt="Sinh viên tốt nghiệp"
          className="absolute object-cover w-full h-full"
        />
        <div
          className="h-[80dvh] sm:h-[70dvh] w-[90vw] sm:w-[60vw] items-center-safe justify-center-safe
          bg-emerald-500/90 z-10 flex shadow-2xl rounded p-10"
        >
          <div className="flex flex-col gap-4">
            {texts.map((text, index) => (
              <div key={index} className="flex flex-col gap-2">
                <TypingText
                  text={text.num}
                  className="text-4xl font-bold font-mono text-white"
                  speed={30}
                  showCursor={false}
                />

                <TypingText text={text.text} className="text-xl font-bold  text-white" speed={30} showCursor={false} />
                {index < texts.length - 1 && <Separator className="bg-white h-[2px]" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
