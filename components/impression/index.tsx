import Image from "next/image";
import { CountingNumber } from "../ui/counting-number";
import { Separator } from "../ui/separator";
import { TypingText } from "../ui/typing-text";

const texts = [
  {
    num: 70000,
    format: "+",
    duration: 1,
    text: "cựu người học",
  },
  {
    num: 90,
    format: "%",
    duration: 2,
    text: "sinh viên tốt nghiệp có việc làm ổn định",
  },
  {
    num: 95.9,
    format: "%",
    duration: 4,
    text: "đơn vị sử dụng lao động hài lòng về chất lượng người học tốt nghiệp từ Trường Đại học Luật TP.HCM",
  },
  {
    num: 100,
    format: "%",
    duration: 3,
    text: "chương trình đào tạo đạt chất lượng kiểm định",
  },
];

export const Impression = () => {
  return (
    <section id="an-tuong" className="">
      <Image
        src="/sinh-vien-tot-nghiep.webp"
        width={1920}
        height={1080}
        alt="Sinh viên tốt nghiệp"
        className="absolute h-dvh w-full object-cover"
        sizes="100vw"
      />
      <div className="justify-center-safe container items-center-safe relative flex h-dvh w-screen">
        <div className="items-center-safe justify-center-safe z-10 flex rounded bg-ulaw-light/80 backdrop-blur-md shadow-2xl px-10 py-20">
          <div className="flex flex-col gap-4">
            {texts.map((text, index) => (
              <div key={index} className="flex flex-col gap-2">
                <CountingNumber
                  from={0}
                  to={text.num}
                  className="font-extrabold font-mono text-5xl md:text-6xl text-white drop-shadow-lg"
                  duration={text.duration}
                  format={(value) => {
                    const formattedValue = Number.isInteger(text.num) ? Math.round(value) : value.toFixed(1);
                    return `${formattedValue}${text.format}`;
                  }}
                />

                <TypingText
                  text={text.text}
                  className="font-medium text-white/90 md:text-xl text-base tracking-wide"
                  speed={30}
                  showCursor={false}
                />
                {index < texts.length - 1 && <Separator className="h-[2px] bg-white" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
