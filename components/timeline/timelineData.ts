/**
 * Timeline Event Interface
 *
 * @property id - Unique identifier for the event
 * @property date - Display date (e.g., "Tháng 6/2025", "Ngày 30/3/2026")
 * @property title - Event title/name
 * @property description - Optional description text (mainly used for main event)
 * @property items - Optional array of activity items/bullet points
 * @property phase - Event phase: "before" (pre-event), "main" (ceremony), "after" (post-event)
 */
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  items?: string[];
  phase: "before" | "main" | "after";
}

/**
 * Timeline Events Data
 *
 * This array contains all timeline events in chronological order.
 * Each event will be displayed with:
 * - A dot on the vertical timeline (color-coded by phase)
 * - A card with event details
 * - Scroll-triggered animations
 *
 * To add a new event, simply add an object to this array.
 */
export const timelineEvents: TimelineEvent[] = [
  // ============================================
  // PRE-EVENT ACTIVITIES (Green/Emerald theme)
  // ============================================
  {
    id: "pre-1",
    date: "Tháng 6/2025",
    title: "Công trình cải tạo và xây dựng",
    phase: "before",
    items: ["Công trình cải tạo, nâng cấp đường vào cơ sở 3.", "Xây dựng vườn cây các thế hệ người học."],
  },
  {
    id: "pre-2",
    date: "Tháng 7/2025",
    title: "Xây dựng tài liệu và hoạt động văn nghệ",
    phase: "before",
    items: [
      "Xây dựng Kỷ yếu 50 năm truyền thống và các Clip phóng sự trên Đài truyền hình.",
      "Số hóa Phòng truyền thống.",
      "Hội diễn văn nghệ.",
    ],
  },
  {
    id: "pre-3",
    date: "Tháng 8/2025 - Tháng 3/2026",
    title: "Chuỗi hoạt động truyền thông và tìm hiểu",
    phase: "before",
    items: [
      "Thực hiện phim tài liệu, sách, ảnh giới thiệu về Trường.",
      'Thực hiện chuỗi video "ULAW qua các thế hệ".',
      'Tổ chức chuỗi bài viết/podcast "Dấu ấn 50 năm truyền thống Trường Đại học Luật TP.HCM".',
      "Phát động sinh viên tìm hiểu lịch sử hình thành và phát triển của Nhà trường.",
      "Cuộc thi thiết kế Logo, Clip, thi viết, sáng tác bài hát kỷ niệm Ngày truyền thống.",
    ],
  },
  {
    id: "pre-4",
    date: "Tháng 9 - 10/2025",
    title: "Phim tư liệu và hoạt động sinh viên",
    phase: "before",
    items: [
      "Phim tư liệu về các giai đoạn hình thành và phát triển của ULAW qua 50 năm.",
      "Tổ chức Hội thao sinh viên và Liên hoan Tiếng hát sinh viên.",
    ],
  },
  {
    id: "pre-5",
    date: "Tháng 12/2025 - Tháng 3/2026",
    title: "Gặp mặt và kết nối các thế hệ",
    phase: "before",
    items: [
      "Tổ chức Giải Golf 50 năm truyền thống Ulaw.",
      "Gặp mặt - Kết nối các thế hệ cựu người học.",
      "Gặp mặt - Kết nối các thế hệ cán bộ Đoàn, Hội sinh viên.",
    ],
  },
  {
    id: "pre-6",
    date: "Tháng 3/2026",
    title: "Hội thảo và xuất bản khoa học",
    phase: "before",
    items: [
      'Hội thảo quốc tế "Phát triển Trường Đại học Luật TP. HCM thành Đại học đa ngành - Kinh nghiệm quốc tế và Việt Nam".',
      'Hội thảo cấp quốc gia "Đào tạo tiến sĩ luật tại Trường Đại học Luật TP. HCM: hành trình từ thực tế và lan tỏa giá trị pháp lý".',
      'Xuất bản Ấn phẩm kỷ niệm (Sách "50 năm ULAW – Dấu ấn thời gian").',
      "Xuất bản Ấn phẩm khoa học - Số chuyên đề trên các tạp chí KHPL.",
      "Gặp mặt - Kết nối các thế hệ viên chức, cựu viên chức và người lao động qua các thời kỳ.",
      "Gặp mặt - Tri ân cán bộ hưu trí ulaw qua các thế hệ;",
      "Vinh danh, tri ân các tập thể và cá nhân có đóng góp xuất sắc.",
    ],
  },
  {
    id: "pre-7",
    date: "Hoạt động khác",
    title: "Hoạt động thiện nguyện",
    phase: "before",
    items: ["Các hoạt động thiện nguyện, vì cộng đồng mang dấu ấn ULAW."],
  },

  // ============================================
  // MAIN EVENT (Blue gradient theme)
  // ============================================
  {
    id: "main-event",
    date: "Ngày 30/3/2026",
    title: "LỄ KỶ NIỆM CHÍNH THỨC",
    description: "LỄ MEETING KỶ NIỆM 50 NĂM TRUYỀN THỐNG VÀ 30 NĂM NGÀY MANG TÊN TRƯỜNG ĐẠI HỌC LUẬT TP.HCM",
    phase: "main",
  },

  // ============================================
  // POST-EVENT ACTIVITIES (Sky blue theme)
  // ============================================
  {
    id: "post-1",
    date: "Tháng 4/2026",
    title: "Cập nhật truyền thông và báo cáo",
    phase: "after",
    items: [
      "Cập nhật thông tin truyền thông – Báo chí.",
      "Phát hành video highlight/phim tư liệu chính thức.",
      "Đăng tải toàn bộ hình ảnh chất lượng cao của sự kiện lên Trang thông tin điện tử và fanpage.",
      "Tổng hợp báo cáo truyền thông và chia sẻ với các đơn vị liên quan.",
      "Duy trì các nội dung về truyền thông và truyền tải cảm xúc trên kênh truyền thông của Trường.",
    ],
  },
];
