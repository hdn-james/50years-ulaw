"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import { QuoteIcon } from "../svgs/quote";

// HCMULAW 50th Anniversary Messages
const testimonials = [
  {
    body: '50 năm truyền thống, 30 năm phát triển! Chúc mừng Trường Đại học Luật TP.HCM tiếp tục vững bước trên chặng đường vẻ vang, phát huy tối đa giá trị cốt lõi: "Đoàn kết - Năng động - Sáng tạo - Trách nhiệm".',
  },
  {
    body: "Trân trọng và biết ơn những thế hệ thầy cô, cán bộ đã dày công vun đắp nên một HCMULAW uy tín, chất lượng như ngày hôm nay. Chúc Trường mãi là cái nôi đào tạo nhân lực pháp luật hàng đầu đất nước.",
  },
  {
    body: "Chúc Trường Đại học Luật TP.HCM luôn giữ vững và phát huy tinh thần tiên phong trong nghiên cứu và giảng dạy luật học, đóng góp tích cực vào sự nghiệp xây dựng Nhà nước pháp quyền.",
  },
  {
    body: "Hành trình nửa thế kỷ là minh chứng hùng hồn cho sự kiên trì, nỗ lực không ngừng nghỉ. Chúc Trường tiếp tục là điểm tựa vững chắc cho khát vọng cống hiến của các thế hệ sinh viên.",
  },
  {
    body: "Mừng Trường vững vàng trong truyền thống, mạnh mẽ trong đổi mới. Chúc HCMULAW tiếp tục là niềm tự hào của hàng vạn cựu sinh viên.",
  },
  {
    body: "Chúc Trường ngày càng phát triển vượt bậc, đạt được nhiều thành tựu hơn nữa trong hội nhập quốc tế, khẳng định vị thế là một trung tâm đào tạo và nghiên cứu luật ngang tầm khu vực.",
  },
  {
    body: "Giảng đường tri thức – Khởi nguồn công lý. Chúc các thầy cô luôn dồi dào sức khỏe, nhiệt huyết để tiếp tục là người truyền lửa, chắp cánh cho những luật sư, thẩm phán, kiểm sát viên tương lai.",
  },
  {
    body: "Chúc HCMULAW sẽ tiếp tục là môi trường học tập năng động, sáng tạo, nơi ươm mầm những tài năng pháp lý có tâm, có tầm cho đất nước.",
  },
  {
    body: "Kính chúc tập thể cán bộ, giảng viên Trường Đại học Luật TP.HCM luôn đoàn kết, đạt nhiều thắng lợi mới trong công cuộc đổi mới giáo dục đại học.",
  },
  {
    body: "Chúc các công trình nghiên cứu khoa học của Trường sẽ ngày càng ứng dụng sâu rộng vào thực tiễn đời sống và công tác lập pháp.",
  },
  {
    body: "Xin gửi lời tri ân sâu sắc đến Trường, nơi đã trang bị kiến thức và đạo đức nghề nghiệp cho bao thế hệ. Chúc Trường bách niên trường tồn!",
  },
  {
    body: "Cựu sinh viên mãi hướng về Trường! Chúc mối liên kết giữa Trường và các thế hệ học viên ngày càng chặt chẽ, cùng nhau xây dựng thương hiệu HCMULAW rực rỡ hơn nữa.",
  },
  {
    body: "Chúc các em sinh viên đang học tại Trường tiếp tục nỗ lực, gặt hái thành công và trở thành những công dân ưu tú mang tinh thần Luật TP.HCM.",
  },
  {
    body: "Chúc Trường Đại học Luật TP.HCM sẽ là ngọn hải đăng dẫn lối cho thế hệ trẻ yêu mến và muốn dấn thân vào con đường pháp luật.",
  },
  {
    body: "50 năm tỏa sáng, 30 năm định danh. Chúc Trường không ngừng vươn lên, đóng góp xứng đáng vào sự nghiệp cải cách tư pháp và phát triển đất nước.",
  },
];

function TestimonialCard({ body }: (typeof testimonials)[number]) {
  return (
    <div className="w-96 py-4 px-6 bg-white rounded-2xl shadow">
      <div>
        <QuoteIcon className="size-14 text-ulaw-blue" />

        <blockquote className="mt-4 text-econdary-foreground text-justify">{body}</blockquote>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section>
      <div className="container">
        <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Lời chúc và chia sẻ kỷ niệm về Trường ĐH Luật TP.HCM
        </h2>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center gap-0 overflow-hidden py-8">
        {/* Marquee moving left to right (default) */}
        <Marquee pauseOnHover repeat={3} className="[--duration:120s]">
          {testimonials.map((review, index) => (
            <TestimonialCard key={index} {...review} />
          ))}
        </Marquee>
        {/* Marquee moving right to left (reverse) */}
        <Marquee pauseOnHover reverse repeat={3} className="[--duration:120s]">
          {testimonials.map((review, index) => (
            <TestimonialCard key={index} {...review} />
          ))}
        </Marquee>
        {/* Stylish gradient overlays */}
        {/*<div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background/95 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background/95 to-transparent"></div>
        <div className="pointer-events-none absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background/90 to-transparent"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/90 to-transparent"></div>*/}
      </div>
    </section>
  );
}
