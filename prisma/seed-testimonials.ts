import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const staticTestimonials = [
  {
    body: '50 năm truyền thống, 30 năm phát triển! Chúc mừng Trường Đại học Luật TP.HCM tiếp tục vững bước trên chặng đường vẻ vang, phát huy tối đa giá trị cốt lõi: "Đoàn kết - Năng động - Sáng tạo - Trách nhiệm".',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Trân trọng và biết ơn những thế hệ thầy cô, cán bộ đã dày công vun đắp nên một HCMULAW uy tín, chất lượng như ngày hôm nay. Chúc Trường mãi là cái nôi đào tạo nhân lực pháp luật hàng đầu đất nước.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Chúc Trường Đại học Luật TP.HCM luôn giữ vững và phát huy tinh thần tiên phong trong nghiên cứu và giảng dạy luật học, đóng góp tích cực vào sự nghiệp xây dựng Nhà nước pháp quyền.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Hành trình nửa thế kỷ là minh chứng hùng hồn cho sự kiên trì, nỗ lực không ngừng nghỉ. Chúc Trường tiếp tục là điểm tựa vững chắc cho khát vọng cống hiến của các thế hệ sinh viên.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Mừng Trường vững vàng trong truyền thống, mạnh mẽ trong đổi mới. Chúc HCMULAW tiếp tục là niềm tự hào của hàng vạn cựu sinh viên.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Chúc Trường ngày càng phát triển vượt bậc, đạt được nhiều thành tựu hơn nữa trong hội nhập quốc tế, khẳng định vị thế là một trung tâm đào tạo và nghiên cứu luật ngang tầm khu vực.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Giảng đường tri thức – Khởi nguồn công lý. Chúc các thầy cô luôn dồi dào sức khỏe, nhiệt huyết để tiếp tục là người truyền lửa, chắp cánh cho những luật sư, thẩm phán, kiểm sát viên tương lai.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Chúc HCMULAW sẽ tiếp tục là môi trường học tập năng động, sáng tạo, nơi ươm mầm những tài năng pháp lý có tâm, có tầm cho đất nước.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Kính chúc tập thể cán bộ, giảng viên Trường Đại học Luật TP.HCM luôn đoàn kết, đạt nhiều thắng lợi mới trong công cuộc đổi mới giáo dục đại học.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Chúc các công trình nghiên cứu khoa học của Trường sẽ ngày càng ứng dụng sâu rộng vào thực tiễn đời sống và công tác lập pháp.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Xin gửi lời tri ân sâu sắc đến Trường, nơi đã trang bị kiến thức và đạo đức nghề nghiệp cho bao thế hệ. Chúc Trường bách niên trường tồn!',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Cựu sinh viên mãi hướng về Trường! Chúc mối liên kết giữa Trường và các thế hệ học viên ngày càng chặt chẽ, cùng nhau xây dựng thương hiệu HCMULAW rực rỡ hơn nữa.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Chúc các em sinh viên đang học tại Trường tiếp tục nỗ lực, gặt hái thành công và trở thành những công dân ưu tú mang tinh thần Luật TP.HCM.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: 'Chúc Trường Đại học Luật TP.HCM sẽ là ngọn hải đăng dẫn lối cho thế hệ trẻ yêu mến và muốn dấn thân vào con đường pháp luật.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
  {
    body: '50 năm tỏa sáng, 30 năm định danh. Chúc Trường không ngừng vươn lên, đóng góp xứng đáng vào sự nghiệp cải cách tư pháp và phát triển đất nước.',
    name: 'Anonymous',
    isStatic: true,
    isPublished: true,
    order: 0,
  },
];

async function main() {
  console.log('Start seeding static testimonials...');

  // Check if static testimonials already exist
  const existingCount = await prisma.testimonial.count({
    where: { isStatic: true },
  });

  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing static testimonials. Skipping seed.`);
    return;
  }

  // Create all static testimonials
  for (const testimonial of staticTestimonials) {
    const created = await prisma.testimonial.create({
      data: testimonial,
    });
    console.log(`Created testimonial: ${created.id}`);
  }

  console.log(`Seeding finished. Created ${staticTestimonials.length} static testimonials.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
