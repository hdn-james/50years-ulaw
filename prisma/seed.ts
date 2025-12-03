import { ContentStatus, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/utils";

type SamplePressItem = {
  title: string;
  dateReleased: Date;
  description: string;
  thumbnailUrl?: string;
  link?: string;
  status: ContentStatus;
};

const prisma = new PrismaClient();

const ADMIN_DEFAULT_USERNAME = process.env.ADMIN_DEFAULT_USERNAME ?? "admin";
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD ?? "change-me";
const ULAW_ADMIN_USERNAME = "ulaw-admin";
const ULAW_ADMIN_DEFAULT_PASSWORD = process.env.ULAW_ADMIN_DEFAULT_PASSWORD ?? "change-me";
const AUTH_SALT_ROUNDS = Number.parseInt(process.env.AUTH_SALT_ROUNDS ?? "12", 10);

type SampleContent = {
  title: string;
  slug: string;
  description: string;
  category: string;
  body: string;
  status: ContentStatus;
  publishedAt?: string;
  seoDescription?: string;
  seoImageUrl?: string;
  seoImageAlt?: string;
  thumbnailUrl?: string;
  tags: string[];
};

const sampleContents: SampleContent[] = [
  {
    title: "Nửa thế kỷ vươn mình của Trường Đại học Luật TP.HCM",
    slug: "nua-the-ky-vuon-minh-cua-truong-dai-hoc-luat-tp-hcm",
    description:
      "Trường Đại học Luật TP.HCM kỷ niệm 50 năm truyền thống và 30 năm mang tên trường với nhiều thành tựu và cột mốc đáng tự hào.",
    category: "Tin tức - Sự kiện",
    body: `<h2>Nửa thế kỷ vươn mình của Trường Đại học Luật TP.HCM</h2>

<p>Trường Đại học Luật TP.HCM đã trải qua 50 năm xây dựng và phát triển, từ một trường chuyên ngành luật thành một trong những cơ sở đào tạo luật hàng đầu Việt Nam.</p>

<h3>Những cột mốc quan trọng</h3>

<ul>
<li><strong>1975</strong>: Thành lập với tên gọi ban đầu</li>
<li><strong>1994</strong>: Chính thức mang tên Trường Đại học Luật TP.HCM</li>
<li><strong>2025</strong>: Kỷ niệm 50 năm truyền thống và 30 năm mang tên trường</li>
</ul>

<h3>Thành tựu nổi bật</h3>

<ul>
<li>Đào tạo hàng chục nghìn cử nhân, thạc sĩ, tiến sĩ luật</li>
<li>Mở rộng quy mô với 3 cơ sở đào tạo</li>
<li>Hợp tác quốc tế với nhiều trường đại học danh tiếng</li>
<li>Đóng góp tích cực vào việc xây dựng và hoàn thiện hệ thống pháp luật Việt Nam</li>
</ul>

<p>Trong năm 2025, Trường tổ chức nhiều hoạt động kỷ niệm ý nghĩa, khẳng định vị thế và vai trò trong việc đào tạo nguồn nhân lực pháp lý chất lượng cao.</p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-11-20").toISOString(),
    seoDescription: "Kỷ niệm 50 năm truyền thống Trường Đại học Luật TP.HCM",
    thumbnailUrl:
      "https://www.hcmulaw.edu.vn/Resources/Images/SubDomain/HomePage/.0.50%20nam%20truyen%20thong/ava%20web.jpg",
    tags: ["50 năm truyền thống", "kỷ niệm", "lịch sử", "ULAW"],
  },
  {
    title: "Hội thảo quốc tế về Luật Hình sự xuyên quốc gia khu vực Châu Á - Thái Bình Dương",
    slug: "hoi-thao-quoc-te-luat-hinh-su-xuyen-quoc-gia",
    description:
      "Trường Đại học Luật TP.HCM tổ chức Hội thảo quốc tế về Luật Hình sự xuyên quốc gia với sự tham gia của nhiều chuyên gia trong và ngoài nước.",
    category: "Hoạt động khoa học",
    body: `<h2>Hội thảo quốc tế về Luật Hình sự xuyên quốc gia khu vực Châu Á - Thái Bình Dương</h2>

<p>Ngày 27-28 tháng 11 năm 2025, Trường Đại học Luật TP.HCM tổ chức Hội thảo quốc tế về "Luật Hình sự xuyên quốc gia khu vực Châu Á – Thái Bình Dương".</p>

<h3>Mục tiêu Hội thảo</h3>

<ul>
<li>Trao đổi kinh nghiệm về xử lý tội phạm xuyên quốc gia</li>
<li>Thảo luận về các vấn đề pháp lý mới nổi trong khu vực</li>
<li>Tăng cường hợp tác quốc tế trong lĩnh vực tư pháp hình sự</li>
</ul>

<h3>Nội dung chính</h3>

<ol>
<li><strong>Tội phạm mạng</strong>: Các thách thức pháp lý trong thời đại số</li>
<li><strong>Hợp tác tư pháp quốc tế</strong>: Dẫn độ và tương trợ tư pháp</li>
<li><strong>Rửa tiền và tài trợ khủng bố</strong>: Các biện pháp phòng ngừa và xử lý</li>
<li><strong>Buôn người và di cư bất hợp pháp</strong>: Bảo vệ nạn nhân và trừng phạt</li>
</ol>

<p>Hội thảo quy tụ các chuyên gia, học giả, nhà nghiên cứu từ nhiều quốc gia trong khu vực Châu Á - Thái Bình Dương, góp phần nâng cao chất lượng nghiên cứu và giảng dạy luật hình sự tại Việt Nam.</p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-11-25").toISOString(),
    seoDescription: "Hội thảo quốc tế về Luật Hình sự xuyên quốc gia tại ULAW",
    thumbnailUrl: "https://source.unsplash.com/800x600/?conference,law,international",
    tags: ["hội thảo quốc tế", "luật hình sự", "hợp tác quốc tế", "nghiên cứu khoa học"],
  },
  {
    title: "Trường Đại học Luật TP.HCM làm việc với đại diện UNESCO tại Việt Nam",
    slug: "truong-dai-hoc-luat-tp-hcm-lam-viec-voi-unesco",
    description:
      "Đoàn đại diện UNESCO tại Việt Nam đến thăm và làm việc với Trường Đại học Luật TP.HCM về các cơ hội hợp tác trong lĩnh vực giáo dục và nghiên cứu pháp lý.",
    category: "Hợp tác quốc tế",
    body: `<h2>Trường Đại học Luật TP.HCM làm việc với đại diện UNESCO tại Việt Nam</h2>

<p>Trong khuôn khổ hợp tác quốc tế, Trường Đại học Luật TP.HCM đã có buổi làm việc với đại diện UNESCO tại Việt Nam để trao đổi về các cơ hội hợp tác tiềm năng.</p>

<h3>Nội dung làm việc</h3>

<ul>
<li><strong>Hợp tác nghiên cứu</strong>: Các chủ đề về quyền con người, quyền trẻ em, và pháp luật văn hóa</li>
<li><strong>Trao đổi học thuật</strong>: Chương trình trao đổi giảng viên và sinh viên</li>
<li><strong>Đào tạo năng lực</strong>: Tổ chức các khóa đào tạo ngắn hạn về luật quốc tế</li>
</ul>

<h3>Ý nghĩa</h3>

<p>Sự hợp tác với UNESCO sẽ giúp Trường:</p>
<ul>
<li>Nâng cao chất lượng đào tạo theo chuẩn quốc tế</li>
<li>Mở rộng mạng lưới hợp tác toàn cầu</li>
<li>Tăng cường nghiên cứu khoa học về các vấn đề pháp lý quốc tế</li>
<li>Đóng góp vào việc thực hiện các mục tiêu phát triển bền vững của Liên Hợp Quốc</li>
</ul>

<p>Đây là bước đi quan trọng trong chiến lược quốc tế hóa của Trường Đại học Luật TP.HCM, khẳng định vị thế là cơ sở đào tạo luật hàng đầu khu vực.</p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-11-10").toISOString(),
    seoDescription: "ULAW hợp tác với UNESCO về giáo dục và nghiên cứu pháp lý",
    thumbnailUrl: "https://source.unsplash.com/800x600/?unesco,cooperation,education",
    tags: ["UNESCO", "hợp tác quốc tế", "nghiên cứu", "đào tạo"],
  },
  {
    title: "Viên chức, Người lao động ULAW chung tay quyên góp 400 triệu đồng hỗ trợ đồng bào lũ lụt",
    slug: "ulaw-quyen-gop-400-trieu-dong-ho-tro-dong-bao-lu-lut",
    description:
      "Cán bộ, giảng viên, nhân viên Trường Đại học Luật TP.HCM đã quyên góp 400 triệu đồng để chia sẻ khó khăn với đồng bào các tỉnh miền Trung bị thiệt hại do lũ lụt.",
    category: "Tin tức - Sự kiện",
    body: `<h2>Viên chức, Người lao động ULAW chung tay chia sẻ khó khăn</h2>

<p>Với tinh thần "tương thân tương ái", toàn thể cán bộ, giảng viên, nhân viên và người lao động Trường Đại học Luật TP.HCM đã quyên góp được 400 triệu đồng để hỗ trợ đồng bào bị thiệt hại bởi lũ lụt.</p>

<h3>Các địa phương được hỗ trợ</h3>

<ul>
<li>Tỉnh Khánh Hòa</li>
<li>Tỉnh Lâm Đồng</li>
<li>Tỉnh Đắk Lắk</li>
<li>Tỉnh Gia Lai</li>
</ul>

<h3>Hình thức hỗ trợ</h3>

<p>Số tiền quyên góp được sử dụng để:</p>
<ul>
<li>Mua lương thực, thực phẩm thiết yếu</li>
<li>Hỗ trợ xây dựng lại nhà cửa</li>
<li>Mua sắm đồ dùng học tập cho học sinh</li>
<li>Hỗ trợ phục hồi sản xuất</li>
</ul>

<h3>Thông điệp ý nghĩa</h3>

<p>Hoạt động từ thiện này thể hiện tinh thần đoàn kết, trách nhiệm xã hội của cộng đồng ULAW. Ban lãnh đạo nhà trường cũng dự kiến dành 1,5 tỷ đồng để hỗ trợ các sinh viên đang học tập tại Trường có gia đình bị thiệt hại bởi mưa lũ.</p>

<p><em>"Mỗi đóng góp nhỏ bé đều mang lại ý nghĩa lớn lao, giúp đồng bào vượt qua khó khăn và sớm ổn định cuộc sống"</em> - Ban lãnh đạo Trường chia sẻ.</p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-11-15").toISOString(),
    seoDescription: "ULAW quyên góp 400 triệu đồng hỗ trợ đồng bào vùng lũ",
    thumbnailUrl: "https://source.unsplash.com/800x600/?charity,community,helping",
    tags: ["từ thiện", "lũ lụt", "cộng đồng", "trách nhiệm xã hội"],
  },
  {
    title: "Toạ đàm hướng nghiệp: Sinh viên luật và cơ hội nghề nghiệp trong lĩnh vực tư pháp",
    slug: "toa-dam-huong-nghiep-sinh-vien-luat",
    description:
      "Tọa đàm cung cấp thông tin về cơ hội nghề nghiệp cho sinh viên luật trong bối cảnh chuyển đổi số và hội nhập quốc tế.",
    category: "Thông tin đào tạo",
    body: `<h2>Toạ đàm hướng nghiệp "Sinh viên luật và cơ hội nghề nghiệp trong lĩnh vực tư pháp giữa bối cảnh chuyển đổi số"</h2>

<p>Nhằm trang bị kiến thức và định hướng nghề nghiệp cho sinh viên, Trường Đại học Luật TP.HCM tổ chức Tọa đàm hướng nghiệp về cơ hội việc làm trong lĩnh vực tư pháp.</p>

<h3>Nội dung chính</h3>

<p><strong>1. Xu hướng nghề nghiệp mới</strong></p>
<ul>
<li>Luật sư tư vấn về công nghệ và dữ liệu số</li>
<li>Chuyên gia tuân thủ (Compliance Officer)</li>
<li>Chuyên viên pháp lý doanh nghiệp công nghệ</li>
<li>Luật sư chuyên về sở hữu trí tuệ số</li>
</ul>

<p><strong>2. Kỹ năng cần thiết</strong></p>
<ul>
<li>Tư duy phân tích và giải quyết vấn đề</li>
<li>Kỹ năng nghiên cứu và viết pháp lý</li>
<li>Khả năng làm việc nhóm và giao tiếp</li>
<li>Hiểu biết về công nghệ và chuyển đổi số</li>
</ul>

<p><strong>3. Cơ hội việc làm</strong></p>
<ul>
<li>Các tòa án, viện kiểm sát</li>
<li>Văn phòng luật sư, công ty luật</li>
<li>Doanh nghiệp (bộ phận pháp chế)</li>
<li>Cơ quan nhà nước</li>
<li>Tổ chức quốc tế, NGO</li>
</ul>

<h3>Diễn giả</h3>

<p>Tọa đàm có sự tham gia của các chuyên gia, luật sư hàng đầu và đại diện các tổ chức tuyển dụng, chia sẻ kinh nghiệm thực tế và tư vấn cho sinh viên về lộ trình phát triển nghề nghiệp.</p>

<p>Đây là hoạt động thường niên của Trường nhằm kết nối sinh viên với thị trường lao động, giúp các em tự tin hơn trong việc lựa chọn và theo đuổi nghề nghiệp luật.</p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-11-05").toISOString(),
    seoDescription: "Tọa đàm hướng nghiệp cho sinh viên luật về cơ hội việc làm",
    thumbnailUrl: "https://source.unsplash.com/800x600/?students,career,seminar",
    tags: ["hướng nghiệp", "sinh viên", "cơ hội việc làm", "chuyển đổi số"],
  },
  {
    title: "Trường Đại học Luật TP.HCM ra mắt ULAW Golf Club",
    slug: "ulaw-ra-mat-golf-club",
    description:
      "ULAW Golf Club chính thức ra mắt, tạo nên sân chơi kết nối cộng đồng cựu sinh viên, giảng viên và doanh nghiệp.",
    category: "50 năm truyền thống",
    body: `<h2>Trường Đại học Luật TP.HCM ra mắt ULAW Golf Club - Nâng tầm kết nối cộng đồng</h2>

<p>Trong chuỗi hoạt động kỷ niệm 50 năm truyền thống, Trường Đại học Luật TP.HCM đã chính thức ra mắt ULAW Golf Club, một câu lạc bộ golf dành cho cộng đồng ULAW.</p>

<h3>Mục đích thành lập</h3>

<ul>
<li><strong>Kết nối cộng đồng</strong>: Tạo sân chơi cho cựu sinh viên, giảng viên, cán bộ và các đối tác</li>
<li><strong>Phát triển quan hệ</strong>: Mở rộng mạng lưới kết nối trong giới pháp lý và doanh nghiệp</li>
<li><strong>Sức khỏe và thể thao</strong>: Khuyến khích lối sống lành mạnh, cân bằng công việc và đời sống</li>
<li><strong>Gây quỹ học bổng</strong>: Một phần hoạt động hướng đến mục đích từ thiện</li>
</ul>

<h3>Giải Golf ULAW mở rộng lần 3 năm 2025</h3>

<p>Chào mừng Ngày Nhà giáo Việt Nam 20/11 và hướng đến kỷ niệm 50 năm truyền thống, Giải Golf ULAW mở rộng lần 3 được tổ chức với quy mô lớn, thu hút hơn 100 golfer tham gia.</p>

<p><strong>Kết quả đạt được:</strong></p>
<ul>
<li>Tạo quỹ học bổng cho sinh viên có hoàn cảnh khó khăn</li>
<li>Tăng cường sự gắn kết trong cộng đồng ULAW</li>
<li>Quảng bá hình ảnh Trường ra bên ngoài</li>
</ul>

<h3>Kế hoạch tương lai</h3>

<p>ULAW Golf Club dự kiến tổ chức các hoạt động định kỳ, giải đấu thường niên và các sự kiện giao lưu, góp phần xây dựng cộng đồng ULAW ngày càng lớn mạnh và gắn kết.</p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-10-28").toISOString(),
    seoDescription: "ULAW Golf Club ra mắt, kết nối cộng đồng và phát triển quan hệ",
    thumbnailUrl:
      "https://www.hcmulaw.edu.vn/Resources/Images/SubDomain/HomePage/.0.50%20nam%20truyen%20thong/Ra%20m%E1%BA%AFt%20Ulaw%20Golf%20CLub/Ban%20Chu%20nhiem%20CLB.jpg",
    tags: ["Golf Club", "cộng đồng", "kết nối", "50 năm"],
  },
  {
    title: "Hội thảo quốc tế về việc làm thỏa đáng trong bối cảnh chuyển đổi số",
    slug: "hoi-thao-quoc-te-viec-lam-thoa-dang",
    description:
      "Hội thảo bàn về khung pháp lý và chính sách thúc đẩy phát triển việc làm thỏa đáng tại Việt Nam trong bối cảnh chuyển đổi số.",
    category: "Hoạt động khoa học",
    body: `<h2>Hội thảo quốc tế "Khung pháp lý và chính sách thúc đẩy phát triển việc làm thỏa đáng tại Việt Nam trong bối cảnh chuyển đổi số"</h2>

<p>Trường Đại học Luật TP.HCM phối hợp với các tổ chức quốc tế tổ chức Hội thảo về việc làm thỏa đáng trong bối cảnh chuyển đổi số.</p>

<h3>Bối cảnh</h3>

<p>Cuộc cách mạng công nghiệp 4.0 và chuyển đổi số đang tạo ra những thay đổi sâu sắc trong thị trường lao động Việt Nam:</p>
<ul>
<li>Sự xuất hiện của các hình thức việc làm mới (gig economy, remote work)</li>
<li>Thách thức trong việc bảo vệ quyền lợi người lao động</li>
<li>Nhu cầu cập nhật khung pháp lý phù hợp</li>
</ul>

<h3>Các chủ đề chính</h3>

<p><strong>1. Khung pháp lý về việc làm số</strong></p>
<ul>
<li>Điều chỉnh quan hệ lao động trên nền tảng số</li>
<li>Bảo vệ quyền lợi người lao động trong nền kinh tế số</li>
<li>Trách nhiệm của nền tảng số</li>
</ul>

<p><strong>2. Chính sách thúc đẩy việc làm</strong></p>
<ul>
<li>Đào tạo và phát triển kỹ năng số</li>
<li>Hỗ trợ doanh nghiệp chuyển đổi số</li>
<li>An sinh xã hội cho người lao động</li>
</ul>

<p><strong>3. Kinh nghiệm quốc tế</strong></p>
<ul>
<li>Nghiên cứu điển hình từ các nước ASEAN</li>
<li>Bài học từ EU và các nước phát triển</li>
<li>Khuyến nghị cho Việt Nam</li>
</ul>

<h3>Ý nghĩa</h3>

<p>Hội thảo cung cấp nền tảng để các nhà hoạch định chính sách, học giả, doanh nghiệp và người lao động thảo luận, đề xuất giải pháp hoàn thiện pháp luật lao động, đáp ứng yêu cầu của thời đại mới.</p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-10-15").toISOString(),
    seoDescription: "Hội thảo quốc tế về việc làm thỏa đáng và chuyển đổi số",
    thumbnailUrl: "https://source.unsplash.com/800x600/?digital,workplace,technology",
    tags: ["hội thảo", "việc làm", "chuyển đổi số", "pháp luật lao động"],
  },
  {
    title: "Tuyển dụng viên chức năm 2025 của Trường Đại học Luật TP.HCM",
    slug: "tuyen-dung-vien-chuc-nam-2025",
    description:
      "Thông báo tuyển dụng viên chức cho các vị trí giảng viên và nhân viên hành chính tại Trường Đại học Luật TP.HCM năm 2025.",
    category: "Thông báo",
    body: `<h2>Thông báo về việc tuyển dụng viên chức năm 2025 của Trường Đại học Luật TP.HCM</h2>

<p>Để đáp ứng nhu cầu phát triển trong giai đoạn mới, Trường Đại học Luật TP.HCM thông báo tuyển dụng viên chức năm 2025.</p>

<h3>Các vị trí tuyển dụng</h3>

<p><strong>1. Giảng viên</strong></p>
<ul>
<li>Luật Hiến pháp và Hành chính</li>
<li>Luật Dân sự</li>
<li>Luật Hình sự</li>
<li>Luật Kinh tế</li>
<li>Luật Quốc tế</li>
<li>Tiếng Anh chuyên ngành</li>
</ul>

<p><strong>2. Nhân viên hành chính</strong></p>
<ul>
<li>Chuyên viên phòng Khoa học - Hợp tác quốc tế</li>
<li>Chuyên viên phòng Đào tạo</li>
<li>Thư viện viên</li>
<li>Chuyên viên công nghệ thông tin</li>
</ul>

<h3>Yêu cầu chung</h3>

<ul>
<li>Có bằng tốt nghiệp đại học trở lên phù hợp với vị trí</li>
<li>Đối với giảng viên: Ưu tiên có học vị Thạc sĩ, Tiến sĩ</li>
<li>Có năng lực chuyên môn, nghiệp vụ tốt</li>
<li>Có phẩm chất đạo đức, lối sống lành mạnh</li>
<li>Sức khỏe tốt, đáp ứng yêu cầu công việc</li>
</ul>

<h3>Quyền lợi</h3>

<ul>
<li>Lương và phụ cấp theo quy định nhà nước</li>
<li>Đóng đầy đủ bảo hiểm xã hội, y tế, thất nghiệp</li>
<li>Được đào tạo, bồi dưỡng nâng cao trình độ</li>
<li>Môi trường làm việc chuyên nghiệp, năng động</li>
<li>Cơ hội thăng tiến rõ ràng</li>
</ul>

<h3>Hồ sơ và thời gian</h3>

<p>Ứng viên quan tâm vui lòng nộp hồ sơ trước ngày 31/12/2024 theo địa chỉ: Phòng Tổ chức - Hành chính, Trường Đại học Luật TP.HCM, số 02 Nguyễn Tất Thành, Phường Xóm Chiếu, TP.HCM.</p>

<p>Chi tiết xem tại website: <a href="https://hcmulaw.edu.vn">https://hcmulaw.edu.vn</a></p>`,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2024-11-22").toISOString(),
    seoDescription: "Tuyển dụng viên chức năm 2025 tại ULAW",
    thumbnailUrl: "https://source.unsplash.com/800x600/?recruitment,job,university",
    tags: ["tuyển dụng", "viên chức", "giảng viên", "cơ hội việc làm"],
  },
];

const samplePressItems: SamplePressItem[] = [
  {
    title: "Trường Đại học Luật TP.HCM kỷ niệm 50 năm truyền thống và 30 năm mang tên trường",
    dateReleased: new Date("2024-11-28"),
    description:
      "Lễ kỷ niệm 50 năm truyền thống và 30 năm mang tên Trường Đại học Luật TP.HCM được tổ chức trọng thể với sự tham dự của nhiều lãnh đạo, cựu sinh viên và đối tác. Đây là dịp để nhìn lại chặng đường phát triển vẻ vang của Nhà trường, đồng thời khẳng định vị thế là cơ sở đào tạo pháp luật hàng đầu tại Việt Nam.",
    thumbnailUrl:
      "https://www.hcmulaw.edu.vn/Resources/Images/SubDomain/HomePage/.0.50%20nam%20truyen%20thong/ava%20web.jpg",
    link: "https://thanhnien.vn/truong-dai-hoc-luat-tp-hcm-ky-niem-50-nam-truyen-thong-185241114.htm",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Mô hình đại học số toàn diện đào tạo cán bộ pháp luật",
    dateReleased: new Date("2024-11-28"),
    description:
      "Trường Đại học Luật TP.HCM triển khai mô hình đại học số toàn diện, ứng dụng công nghệ thông tin và chuyển đổi số vào toàn bộ hoạt động đào tạo, nghiên cứu và quản lý. Đây là bước đi chiến lược nhằm nâng cao chất lượng đào tạo nguồn nhân lực pháp lý đáp ứng yêu cầu thời đại mới.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?digital,university,technology",
    link: "https://thanhnien.vn/mo-hinh-dai-hoc-so-toan-dien-dao-tao-can-bo-phap-luat-185241128.htm",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Trường Đại học Luật TP.HCM ra mắt website kỷ niệm 50 năm và Phòng truyền thống công nghệ số",
    dateReleased: new Date("2024-11-20"),
    description:
      "Nhân dịp kỷ niệm 50 năm truyền thống, Trường Đại học Luật TP.HCM chính thức ra mắt website chuyên biệt về chuỗi hoạt động kỷ niệm và triển khai Phòng truyền thống công nghệ số. Đây là nơi lưu giữ và trưng bày các tư liệu quý giá về lịch sử hình thành và phát triển của Nhà trường.",
    thumbnailUrl:
      "https://www.hcmulaw.edu.vn/Resources/Images/SubDomain/HomePage/2025.11.22%20Tr%C6%B0%E1%BB%9Dng%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20Lu%E1%BA%ADt%20TP.HCM%20ra%20m%E1%BA%AFt%20website%20v%E1%BB%81%20chu%E1%BB%97i%20ho%E1%BA%A1t%20%C4%91%E1%BB%99ng%2050%20n%C4%83m%20v%C3%A0%20tri%E1%BB%83n%20khai%20Ph%C3%B2ng%20truy%E1%BB%81n%20th%E1%BB%91ng%20c%C3%B4ng%20ngh%E1%BB%87%20s%E1%BB%91/02.jpg",
    link: "https://hcmulaw.edu.vn/tin-tuc/ra-mat-website-50-nam",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Viên chức ULAW quyên góp 400 triệu đồng hỗ trợ đồng bào vùng lũ",
    dateReleased: new Date("2024-11-18"),
    description:
      "Thể hiện tinh thần tương thân tương ái, cán bộ, giảng viên và nhân viên Trường Đại học Luật TP.HCM đã quyên góp được 400 triệu đồng để hỗ trợ đồng bào các tỉnh Khánh Hòa, Lâm Đồng, Đắk Lắk, Gia Lai bị thiệt hại do lũ lụt. Nhà trường cũng dành 1,5 tỷ đồng hỗ trợ sinh viên có gia đình gặp khó khăn.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?charity,donation,community",
    link: "https://hcmulaw.edu.vn/tin-tuc/quyen-gop-ho-tro-dong-bao-lu-lut",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Hội thảo quốc tế 'Luật Hình sự xuyên quốc gia khu vực Châu Á - Thái Bình Dương'",
    dateReleased: new Date("2024-11-15"),
    description:
      "Trường Đại học Luật TP.HCM tổ chức Hội thảo quốc tế về Luật Hình sự xuyên quốc gia với sự tham gia của các chuyên gia, học giả từ nhiều nước trong khu vực. Hội thảo tập trung thảo luận về tội phạm mạng, rửa tiền, buôn người và các vấn đề pháp lý nổi cộm trong bối cảnh toàn cầu hóa.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?conference,international,law",
    link: "https://hcmulaw.edu.vn/hoat-dong-khoa-hoc/hoi-thao-luat-hinh-su-xuyen-quoc-gia",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "ULAW Golf Club chính thức ra mắt, kết nối cộng đồng pháp lý",
    dateReleased: new Date("2024-11-10"),
    description:
      "Trường Đại học Luật TP.HCM ra mắt ULAW Golf Club nhằm tạo sân chơi kết nối cho cựu sinh viên, giảng viên và các đối tác. Giải Golf ULAW mở rộng lần 3 thu hút hơn 100 golfer tham gia, góp phần gây quỹ học bổng cho sinh viên có hoàn cảnh khó khăn.",
    thumbnailUrl:
      "https://www.hcmulaw.edu.vn/Resources/Images/SubDomain/HomePage/.0.50%20nam%20truyen%20thong/Ra%20m%E1%BA%AFt%20Ulaw%20Golf%20CLub/Ban%20Chu%20nhiem%20CLB.jpg",
    link: "https://hcmulaw.edu.vn/50-nam/ra-mat-ulaw-golf-club",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Tọa đàm 'Sinh viên luật và cơ hội nghề nghiệp trong lĩnh vực tư pháp'",
    dateReleased: new Date("2024-11-05"),
    description:
      "Nhằm định hướng nghề nghiệp cho sinh viên, Trường tổ chức tọa đàm về cơ hội việc làm trong lĩnh vực tư pháp giữa bối cảnh chuyển đổi số. Các chuyên gia chia sẻ về xu hướng nghề nghiệp mới như luật sư tư vấn công nghệ, chuyên gia tuân thủ, và chuyên viên pháp lý doanh nghiệp.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?career,students,guidance",
    link: "https://hcmulaw.edu.vn/thong-tin-dao-tao/toa-dam-huong-nghiep",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Trường Đại học Luật TP.HCM làm việc với đại diện UNESCO tại Việt Nam",
    dateReleased: new Date("2024-10-28"),
    description:
      "Đoàn đại diện UNESCO tại Việt Nam đến thăm và làm việc với Trường về các cơ hội hợp tác trong lĩnh vực giáo dục, nghiên cứu pháp lý về quyền con người, quyền trẻ em và pháp luật văn hóa. Đây là bước tiến quan trọng trong chiến lược quốc tế hóa của Trường.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?unesco,cooperation,meeting",
    link: "https://hcmulaw.edu.vn/hop-tac-quoc-te/lam-viec-voi-unesco",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Hội thảo 'Khung pháp lý thúc đẩy việc làm thỏa đáng trong bối cảnh chuyển đổi số'",
    dateReleased: new Date("2024-10-15"),
    description:
      "Hội thảo quốc tế bàn về khung pháp lý và chính sách thúc đẩy phát triển việc làm thỏa đáng tại Việt Nam trong bối cảnh chuyển đổi số. Các chuyên gia thảo luận về việc làm trên nền tảng số, bảo vệ quyền lợi người lao động và kinh nghiệm từ các nước trong khu vực.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?work,digital,conference",
    link: "https://hcmulaw.edu.vn/hoat-dong-khoa-hoc/hoi-thao-viec-lam-thoa-dang",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Sinh viên Trường Đại học Luật TP.HCM đạt giải Nhất cuộc thi tranh biện toàn quốc",
    dateReleased: new Date("2024-09-20"),
    description:
      "Đội tuyển tranh biện của Trường Đại học Luật TP.HCM xuất sắc giành giải Nhất tại cuộc thi tranh biện pháp luật toàn quốc 2024. Thành tích này khẳng định chất lượng đào tạo và năng lực của sinh viên ULAW trong việc vận dụng kiến thức pháp lý và kỹ năng tranh luận.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?debate,students,competition",
    link: "https://tuoitre.vn/sinh-vien-dhlt-tphcm-gianh-giai-nhat-tranh-bien-20240920.htm",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Ký kết hợp tác chiến lược với Liên đoàn Luật sư Việt Nam",
    dateReleased: new Date("2024-08-10"),
    description:
      "Trường Đại học Luật TP.HCM và Liên đoàn Luật sư Việt Nam ký kết thỏa thuận hợp tác toàn diện trong đào tạo, nghiên cứu và thực hành pháp luật. Thỏa thuận mở ra nhiều cơ hội cho sinh viên thực tập tại các văn phòng luật sư và tham gia các hoạt động nghề nghiệp thực tế.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?partnership,law,cooperation",
    link: "https://dantri.com.vn/giao-duc/ky-ket-hop-tac-chien-luoc-voi-lien-doan-luat-su-viet-nam-20240810.htm",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Khai giảng khóa đào tạo thạc sĩ Luật kinh tế quốc tế",
    dateReleased: new Date("2024-07-05"),
    description:
      "Chương trình thạc sĩ Luật kinh tế quốc tế chính thức khai giảng với sự tham gia giảng dạy của các chuyên gia quốc tế từ Hàn Quốc, Nhật Bản và châu Âu. Chương trình được thiết kế đáp ứng nhu cầu nguồn nhân lực cho các doanh nghiệp hoạt động trong môi trường kinh doanh quốc tế.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?graduation,masters,education",
    link: "https://vietnamnet.vn/khai-giang-khoa-dao-tao-thac-si-luat-kinh-te-quoc-te-2024.html",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Thông báo tuyển dụng viên chức năm 2025",
    dateReleased: new Date("2024-11-22"),
    description:
      "Trường Đại học Luật TP.HCM công bố kế hoạch tuyển dụng viên chức năm 2025 cho các vị trí giảng viên và nhân viên hành chính. Đây là cơ hội để những người có năng lực và đam mê với giáo dục pháp luật gia nhập đội ngũ của một trong những trường luật hàng đầu Việt Nam.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?recruitment,hiring,university",
    link: "https://hcmulaw.edu.vn/thong-bao/tuyen-dung-vien-chuc-2025",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Ký túc xá cơ sở 3: Môi trường sống văn minh và hiện đại cho sinh viên",
    dateReleased: new Date("2024-06-20"),
    description:
      "Ký túc xá tại cơ sở 3 của Trường Đại học Luật TP.HCM được đầu tư xây dựng theo tiêu chuẩn hiện đại với đầy đủ tiện nghi, tạo môi trường sống, học tập lý tưởng cho sinh viên. Công trình là minh chứng cho cam kết của Nhà trường trong việc chăm lo đời sống sinh viên.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?dormitory,students,modern",
    link: "https://hcmulaw.edu.vn/tuyen-sinh/ky-tuc-xa-co-so-3",
    status: ContentStatus.PUBLISHED,
  },
  {
    title: "Chương trình Rising Scholars Fellowship Programme",
    dateReleased: new Date("2024-05-15"),
    description:
      "Trường Đại học Luật TP.HCM nhận được thư mời tham gia chương trình Rising Scholars Fellowship Programme dành cho các học giả trẻ xuất sắc trong khu vực. Đây là cơ hội quý báu để giảng viên và nghiên cứu sinh của Trường nâng cao năng lực nghiên cứu và mở rộng mạng lưới học thuật quốc tế.",
    thumbnailUrl: "https://source.unsplash.com/800x600/?scholars,fellowship,research",
    link: "https://hcmulaw.edu.vn/hop-tac-quoc-te/rising-scholars-fellowship",
    status: ContentStatus.PUBLISHED,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, AUTH_SALT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { username: ADMIN_DEFAULT_USERNAME },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      username: ADMIN_DEFAULT_USERNAME,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`👤 Admin user ready: ${adminUser.username}`);

  // Create ulaw-admin user
  const ulawAdminPasswordHash = await bcrypt.hash(ULAW_ADMIN_DEFAULT_PASSWORD, AUTH_SALT_ROUNDS);

  const ulawAdminUser = await prisma.user.upsert({
    where: { username: ULAW_ADMIN_USERNAME },
    update: {
      passwordHash: ulawAdminPasswordHash,
      role: UserRole.ADMIN,
    },
    create: {
      username: ULAW_ADMIN_USERNAME,
      passwordHash: ulawAdminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`👤 ULAW Admin user ready: ${ulawAdminUser.username}`);

  for (const sample of sampleContents) {
    const content = await prisma.content.upsert({
      where: { slug: sample.slug },
      update: {
        title: sample.title,
        description: sample.description,
        category: sample.category,
        body: sample.body,
        status: sample.status,
        publishedAt: sample.publishedAt ? new Date(sample.publishedAt) : null,
        seoDescription: sample.seoDescription ?? sample.description,
        seoImageUrl: sample.seoImageUrl,
        seoImageAlt: sample.seoImageAlt,
        thumbnailUrl: sample.thumbnailUrl,
        authorId: adminUser.id,
      },
      create: {
        title: sample.title,
        slug: sample.slug,
        description: sample.description,
        category: sample.category,
        body: sample.body,
        status: sample.status,
        publishedAt: sample.publishedAt ? new Date(sample.publishedAt) : null,
        seoDescription: sample.seoDescription ?? sample.description,
        seoImageUrl: sample.seoImageUrl,
        seoImageAlt: sample.seoImageAlt,
        thumbnailUrl: sample.thumbnailUrl,
        authorId: adminUser.id,
      },
    });

    await prisma.contentTag.deleteMany({ where: { contentId: content.id } });

    for (const tagName of sample.tags) {
      const tagSlug = slugify(tagName);
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name: tagName },
        create: { name: tagName, slug: tagSlug },
      });

      await prisma.contentTag.create({
        data: {
          contentId: content.id,
          tagId: tag.id,
        },
      });
    }

    console.log(`📝 Seeded content: ${sample.title}`);
  }

  // Seed Press About Us items
  for (const pressItem of samplePressItems) {
    // Check if item already exists
    const existing = await prisma.pressAboutUs.findFirst({
      where: {
        title: pressItem.title,
        dateReleased: pressItem.dateReleased,
      },
    });

    if (existing) {
      // Update existing item
      await prisma.pressAboutUs.update({
        where: { id: existing.id },
        data: {
          description: pressItem.description,
          thumbnailUrl: pressItem.thumbnailUrl,
          link: pressItem.link,
          status: pressItem.status,
        },
      });
      console.log(`📰 Updated press item: ${pressItem.title}`);
    } else {
      // Create new item
      await prisma.pressAboutUs.create({
        data: {
          title: pressItem.title,
          dateReleased: pressItem.dateReleased,
          description: pressItem.description,
          thumbnailUrl: pressItem.thumbnailUrl,
          link: pressItem.link,
          status: pressItem.status,
        },
      });
      console.log(`📰 Created press item: ${pressItem.title}`);
    }
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
