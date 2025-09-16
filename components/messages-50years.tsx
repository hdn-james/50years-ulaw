import Link from 'next/link';
import { ShimmeringText } from './ui/shimmering-text';

export const Message50Years = () => {
  return (
    <section className="container grid grid-cols-1 py-14 md:grid-cols-2">
      <div>Hinh</div>
      <div className="max-w-xl space-y-8 px-4 text-justify">
        <h1>
          <ShimmeringText
            text={'"50 năm ULAW - Vững truyền thống, sáng tương lai"'}
            className="text-center font-semibold text-3xl"
            color="var(--color-amber-300)"
            shimmerColor="var(--color-amber-100)"
            duration={1}
            repeatDelay={1.5}
          />
        </h1>
        <div className="space-y-4 font-medium text-amber-50 text-xl">
          <p>
            Chủ đề của chuỗi chương trình kỷ niệm 50 năm truyền thống và 30 năm
            ngày mang tên Trường Đại học Luật Thành phố Hồ Chí Minh một thông
            điệp mạnh mẽ, vừa nhìn lại chặng đường lịch sử đầy tự hào (50 năm
            vững truyền thống) vừa định hướng cho một tương lai phát triển rực
            rỡ và bền vững (sáng tương lai). Thông điệp thể hiện sự kết nối giữa
            quá khứ và hiện tại, giữa những giá trị được kế thừa và những mục
            tiêu mới mẻ cần chinh phục.{' '}
            <Link className="italic underline hover:text-amber-100" href="">
              (Xem thêm)
            </Link>
          </p>
          <ol className="list-inside list-[lower-alpha] space-y-4 pl-4">
            <li>
              50 năm ULAW: Trường Đại học Luật Thành phố Hồ Chí Minh đã trải qua
              50 năm hình thành và phát triển. Con số <q>50 năm</q> là một dấu
              mốc quan trọng, thể hiện một nửa thế kỷ hình thành, cống hiến và
              trưởng thành. Đây là khoảng thời gian đủ dài để tích lũy kinh
              nghiệm, xây dựng uy tín và tạo ra những giá trị bền vững
            </li>
            <li>
              Vững truyền thống: <q>Truyền thống</q> là những giá trị cốt lõi,
              những nền tảng vững chắc mà ULAW đã xây dựng và gìn giữ trong suốt
              50 năm. Đó là:
              <ul className="mt-4 list-inside list-disc space-y-2 pl-4">
                <li>
                  Chất lượng đào tạo: Uy tín về việc đào tạo ra các thế hệ cử
                  nhân có năng lực chuyên môn và đạo đức nghề nghiệp;
                </li>
                <li>
                  Đội ngũ giảng viên: Sự tâm huyết, trình độ chuyên môn cao của
                  các thầy cô giáo qua nhiều thế hệ;
                </li>
                <li>
                  Văn hóa học thuật: Môi trường học tập nghiêm túc, nghiên cứu
                  khoa học, và tinh thần đoàn kết của sinh viên, cựu sinh viên.
                </li>
                <li>
                  Đóng góp cho xã hội: Vai trò của trường trong việc cung cấp
                  nguồn nhân lực pháp luật, tham gia xây dựng và hoàn thiện hệ
                  thống pháp luật Việt Nam.
                </li>
                <li>
                  <q>Vững</q> là khẳng định rằng những giá trị truyền thống này
                  không những được duy trì mà còn được củng cố, phát triển vững
                  chắc theo thời gian, tạo nên bản sắc và sức mạnh nội tại của
                  nhà trường.
                </li>
              </ul>
            </li>
            <li>
              Sáng tương lai:
              <ul className="mt-4 list-inside list-disc space-y-2 pl-4">
                <li>
                  <q>Tương lai</q> đề cập đến những mục tiêu, định hướng phát
                  triển của ULAW trong giai đoạn tiếp theo. Đó là tầm nhìn về sự
                  đổi mới, tiến bộ và thích ứng với những thay đổi của thời đại;
                </li>
                <li>
                  <q>Sáng</q> mang ý nghĩa về sự rực rỡ, thành công, và triển
                  vọng tốt đẹp. Nó thể hiện niềm tin và hy vọng rằng ULAW sẽ
                  tiếp tục phát triển mạnh mẽ, đạt được những thành tựu lớn hơn
                  nữa trong tương lai, góp phần vào sự phát triển của ngành luật
                  và đất nước. Trong đó, chú trọng:
                  <ul className="mt-4 list-inside list-[circle] space-y-2 pl-4">
                    <li>Nâng cao chất lượng đào tạo, hội nhập quốc tế;</li>
                    <li>Phát triển nghiên cứu khoa học, ứng dụng công nghệ;</li>
                    <li>
                      Đào tạo nguồn nhân lực chất lượng cao đáp ứng nhu cầu xã
                      hội.
                    </li>
                    <li>
                      Mở rộng hợp tác quốc tế, khẳng định vị thế trong khu vực
                      và thế giới.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
