import Image from "next/image";
import { Separator } from "../ui/separator";
import { TypingText } from "../ui/typing-text";

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
    <section className="">
      <Image
        src="/sinh-vien-tot-nghiep.webp"
        width={1920}
        height={1080}
        alt="Sinh viên tốt nghiệp"
        className="absolute h-dvh w-full object-cover"
        sizes="100vw"
      />
      <div className="justify-center-safe container items-center-safe relative flex h-dvh w-screen">
        <div className="items-center-safe justify-center-safe z-10 flex rounded bg-ulaw-light/90 shadow-2xl px-10 py-20">
          <div className="flex flex-col gap-4">
            {texts.map((text, index) => (
              <div key={index} className="flex flex-col gap-2">
                <TypingText
                  text={text.num}
                  className="font-bold font-mono text-[3vh] md:text-4xl leading-none text-white"
                  speed={30}
                  showCursor={false}
                />

                <TypingText
                  text={text.text}
                  className="font-medium text-white md:text-lg text-[1.5vh]"
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
