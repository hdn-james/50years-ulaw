import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

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

const updateOrderSchema = z.array(
  z.object({
    sectionId: z.string(),
    order: z.number().int().min(0),
    isVisible: z.boolean().optional(),
  }),
);

// GET: Fetch current section order
export async function GET(request: NextRequest) {
  try {
    // Check if sections exist in DB
    const existingSections = await prisma.sectionOrder.findMany({
      orderBy: { order: "asc" },
    });

    // If no sections exist, initialize with defaults
    if (existingSections.length === 0) {
      const createdSections = await prisma.$transaction(
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
      return NextResponse.json(createdSections);
    }

    // Check if any new sections need to be added
    const existingIds = new Set(existingSections.map((s: { sectionId: string }) => s.sectionId));
    const missingSections = DEFAULT_SECTIONS.filter((s) => !existingIds.has(s.sectionId));

    if (missingSections.length > 0) {
      const maxOrder = Math.max(...existingSections.map((s: { order: number }) => s.order), -1);
      await prisma.$transaction(
        missingSections.map((section, index) =>
          prisma.sectionOrder.create({
            data: {
              sectionId: section.sectionId,
              name: section.name,
              order: maxOrder + index + 1,
              isVisible: true,
            },
          }),
        ),
      );

      // Fetch updated list
      const updatedSections = await prisma.sectionOrder.findMany({
        orderBy: { order: "asc" },
      });
      return NextResponse.json(updatedSections);
    }

    return NextResponse.json(existingSections);
  } catch (error) {
    console.error("[Sections API] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

// PUT: Update section order
export async function PUT(request: NextRequest) {
  try {
    await requireSession(request);

    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.flatten() }, { status: 400 });
    }

    const updates = parsed.data;

    // Update all sections in a transaction
    await prisma.$transaction(
      updates.map((update) =>
        prisma.sectionOrder.update({
          where: { sectionId: update.sectionId },
          data: {
            order: update.order,
            ...(update.isVisible !== undefined && { isVisible: update.isVisible }),
          },
        }),
      ),
    );

    // Fetch and return updated sections
    const updatedSections = await prisma.sectionOrder.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(updatedSections);
  } catch (error) {
    console.error("[Sections API] PUT error:", error);
    return NextResponse.json({ error: "Failed to update section order" }, { status: 500 });
  }
}

// PATCH: Toggle section visibility
export async function PATCH(request: NextRequest) {
  try {
    await requireSession(request);

    const body = await request.json();
    const { sectionId, isVisible } = body;

    if (!sectionId || typeof isVisible !== "boolean") {
      return NextResponse.json({ error: "sectionId and isVisible are required" }, { status: 400 });
    }

    const updated = await prisma.sectionOrder.update({
      where: { sectionId },
      data: { isVisible },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[Sections API] PATCH error:", error);
    return NextResponse.json({ error: "Failed to toggle section visibility" }, { status: 500 });
  }
}
