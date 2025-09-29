import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/base-accordion";

export const Timeline = () => {
  return (
    <section className="relative py-10">
      <div
        className="-z-1 absolute h-full w-full blur-md"
        style={{
          backgroundImage: 'url("/logo.png")',
          backgroundBlendMode: "lighten",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="container z-10">
        <h2 className="font-bold text-2xl text-sky-800 leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Tổng quan sự kiện
        </h2>
        <Accordion
          variant="solid"
          defaultValue={["truoc-le", "sau-le", "chinh-thuc"]}
          openMultiple={true}
          className="mx-auto mt-8 w-full max-w-5xl 2xl:max-w-7xl"
        >
          <AccordionItem
            value="chinh-thuc"
            className="rounded-3xl bg-gradient-to-r from-emerald-400 via-40% via-sky-500 to-sky-400"
          >
            <AccordionHeader className="justify-end">
              <AccordionTrigger
                showIndicator={false}
                className="justify-center text-center font-semibold text-white text-[4vw] sm:text-xl xl:text-2xl"
              >
                LỄ KỶ NIỆM CHÍNH THỨC
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel className="text-center text-white">
              <p className="text-center font-bold text-[3.5vw] text-white xl:text-xl">Ngày 30/3/2026</p>
              <p className="mt-4 font-medium text-[2.5vw] sm:text-base text-white xl:text-lg">
                LỄ MITTING KỶ NIỆM 50 NĂM TRUYỀN THỐNG
              </p>
              <p className="mt-2 font-medium text-[2.5vw] sm:text-base xl:text-lg">
                VÀ 30 NĂM NGÀY MANG TÊN TRƯỜNG ĐẠI HỌC LUẬT TP.HCM
              </p>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="truoc-le" className="rounded-3xl bg-sky-50/60">
            <AccordionHeader className="justify-end">
              <AccordionTrigger className="justify-between text-left font-semibold text-emerald-700">
                CHUỖI HOẠT ĐỘNG TRƯỚC LỄ KỶ NIỆM (TỪ THÁNG 7/2025 ĐẾN THÁNG 3/2026)
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel className="mt-4">
              <Accordion variant="solid" openMultiple={true}>
                <AccordionItem value="nested-1" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Tháng 6/2025</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>Công trình cải tạo, nâng cấp đường vào cơ sở 3.</li>
                      <li>Xây dựng vườn cây các thế hệ người học.</li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem value="nested-2" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Tháng 7/2025</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>Xây dựng Kỷ yếu 50 năm truyền thống và các Clip phóng sự trên Đài truyền hình.</li>
                      <li>Số hóa Phòng truyền thống.</li>
                      <li>Hội diễn văn nghệ.</li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem value="nested-3" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Tháng 8/2025 đến Tháng 3/2026</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>Thực hiện phim tài liệu, sách, ảnh giới thiệu về Trường.</li>

                      <li>Thực hiện chuỗi video “ULAW qua các thế hệ”.</li>

                      <li>Tổ chức chuỗi bài viết/podcast “Dấu ấn 50 năm truyền thống Trường Đại học Luật TP.HCM”.</li>

                      <li>Phát động sinh viên tìm hiểu lịch sử hình thành và phát triển của Nhà trường.</li>

                      <li>Cuộc thi thiết kế Logo, Clip, thi viết, sáng tác bài hát kỷ niệm Ngày truyền thống.</li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem value="nested-4" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Tháng 9 - 10/2025</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>Phim tư liệu về các giai đoạn hình thành và phát triển của ULAW qua 50 năm.</li>
                      <li>Tổ chức Hội thao sinh viên và Liên hoan Tiếng hát sinh viên.</li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem value="nested-5" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Tháng 12/2025 đến Tháng 3/2026</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>Tổ chức Giải Golf 50 năm truyền thống Ulaw.</li>
                      <li>Gặp mặt - Kết nối các thế hệ cựu người học.</li>
                      <li>Gặp mặt - Kết nối các thế hệ cán bộ Đoàn, Hội sinh viên.</li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem value="nested-6" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Tháng 3/2026</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>
                        Hội thảo quốc tế “Phát triển Trường Đại học Luật TP. HCM thành Đại học đa ngành - Kinh nghiệm
                        quốc tế và Việt Nam”.
                      </li>
                      <li>
                        Hội thảo cấp quốc gia “Đào tạo tiến sĩ luật tại Trường Đại học Luật TP. HCM: hành trình từ thực
                        tế và lan tỏa giá trị pháp lý”.
                      </li>
                      <li>Xuất bản Ấn phẩm kỷ niệm (Sách “50 năm ULAW – Dấu ấn thời gian”).</li>
                      <li>Xuất bản Ấn phẩm khoa học - Số chuyên đề trên các tạp chí KHPL.</li>
                      <li>Gặp mặt - Kết nối các thế hệ viên chức, cựu viên chức và người lao động qua các thời kỳ.</li>
                      <li>Gặp mặt - Tri ân cán bộ hưu trí ulaw qua các thế hệ;</li>
                      <li>Vinh danh, tri ân các tập thể và cá nhân có đóng góp xuất sắc.</li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem value="nested-7" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Hoạt động khác</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>Các hoạt động thiện nguyện, vì cộng đồng mang dấu ấn ULAW.</li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="sau-le" className="rounded-3xl bg-sky-50/60">
            <AccordionHeader className="justify-end">
              <AccordionTrigger className="justify-between text-right font-semibold text-emerald-700">
                CÁC HOẠT ĐỘNG SAU LỄ
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel className="mt-4">
              <Accordion variant="solid" openMultiple={true}>
                <AccordionItem value="nested-1" className="rounded-3xl">
                  <AccordionHeader>
                    <AccordionTrigger className="text-emerald-600">Tháng 4/2026</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionPanel className="text-sky-700">
                    <ul className="list-inside list-disc space-y-3">
                      <li>Cập nhật thông tin truyền thông – Báo chí.</li>

                      <li>Phát hành video highlight/phim tư liệu chính thức.</li>

                      <li>
                        Đăng tải toàn bộ hình ảnh chất lượng cao của sự kiện lên Trang thông tin điện tử và fanpage.
                      </li>

                      <li>Tổng hợp báo cáo truyền thông và chia sẻ với các đơn vị liên quan.</li>

                      <li>
                        Duy trì các nội dung về truyền thông và truyền tải cảm xúc trên kênh truyền thông của Trường.
                      </li>
                    </ul>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
