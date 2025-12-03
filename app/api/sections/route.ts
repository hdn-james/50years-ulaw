import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Map sectionId to navigation href (matching actual section IDs in components)
const SECTION_HREF_MAP: Record<string, string> = {
  message50years: "#le-ky-niem-50-nam",
  impression: "#an-tuong",
  history: "#lich-su-phat-trien",
  timeline: "#tong-quan-su-kien",
  video: "#phim-tai-lieu",
  highlightImages: "#thu-vien-anh",
  activities: "#chuoi-hoat-dong-ky-niem",
  fromThePress: "#bao-chi-thong-tin-ve-su-kien",
  news: "#tin-tuc",
  memories: "#ky-uc-hanh-trinh-50-nam",
  testimonials: "#loi-chuc",
  sponsor: "#nha-tai-tro",
};

// Default sections with their display names
const DEFAULT_SECTIONS = [
  { sectionId: "message50years", name: "Thông điệp 50 năm" },
  { sectionId: "impression", name: "Ấn tượng" },
  { sectionId: "history", name: "Lịch sử phát triển" },
  { sectionId: "timeline", name: "Tổng quan sự kiện" },
  { sectionId: "video", name: "Phim tài liệu" },
  { sectionId: "highlightImages", name: "Thư viện ảnh" },
  { sectionId: "activities", name: "Chuỗi hoạt động kỷ niệm" },
  { sectionId: "fromThePress", name: "Báo chí thông tin về sự kiện" },
  { sectionId: "news", name: "Tin tức" },
  { sectionId: "memories", name: "Ký ức hành trình 50 năm" },
  { sectionId: "testimonials", name: "Lời chúc" },
  { sectionId: "sponsor", name: "Nhà tài trợ" },
];

// GET: Fetch section order for public consumption (only visible sections)
export async function GET() {
  try {
    // Check if sections exist in DB
    const existingSections = await prisma.sectionOrder.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      select: {
        sectionId: true,
        name: true,
        order: true,
      },
    });

    // If no sections exist, return defaults
    if (existingSections.length === 0) {
      // Initialize default sections in DB
      await prisma.$transaction(
        DEFAULT_SECTIONS.map((section, index) =>
          prisma.sectionOrder.create({
            data: {
              sectionId: section.sectionId,
              name: section.name,
              order: index,
              isVisible: true,
            },
          }),
        ),
      );

      return NextResponse.json(
        DEFAULT_SECTIONS.map((section, index) => ({
          sectionId: section.sectionId,
          name: section.name,
          order: index,
          href: SECTION_HREF_MAP[section.sectionId] || "",
        })),
      );
    }

    // Add href to each section
    const sectionsWithHref = existingSections.map((section) => ({
      ...section,
      href: SECTION_HREF_MAP[section.sectionId] || "",
    }));

    return NextResponse.json(sectionsWithHref);
  } catch (error) {
    console.error("[Sections API] GET error:", error);
    // Return default order on error so the site still works
    return NextResponse.json(
      DEFAULT_SECTIONS.map((section, index) => ({
        sectionId: section.sectionId,
        name: section.name,
        order: index,
        href: SECTION_HREF_MAP[section.sectionId] || "",
      })),
    );
  }
}
