import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  body: z.string().min(10, "Wish must be at least 10 characters").max(1000, "Wish is too long"),
  images: z.array(z.string().startsWith("/uploads/")).optional().nullable(),
  isPublished: z.boolean().default(false),
  isStatic: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

// GET all testimonials (admin)
export async function GET(request: NextRequest) {
  try {
    await requireSession(request);

    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("publishedOnly") === "true";

    const testimonials = await prisma.testimonial.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    // Parse images JSON field for each testimonial
    const formattedTestimonials = testimonials.map((t) => ({
      ...t,
      images: t.images ? (t.images as string[]) : null,
    }));

    return NextResponse.json(formattedTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch testimonials";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

// POST create new testimonial (admin)
export async function POST(request: NextRequest) {
  try {
    await requireSession(request);

    const json = await request.json();
    const parsed = testimonialSchema.safeParse(json);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { images, ...rest } = parsed.data;

    const testimonial = await prisma.testimonial.create({
      data: {
        ...rest,
        images: images ? (images as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    return NextResponse.json(
      {
        ...testimonial,
        images: testimonial.images ? (testimonial.images as string[]) : null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create testimonial";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

// PUT update testimonial
export async function PUT(request: NextRequest) {
  try {
    await requireSession(request);

    const json = await request.json();
    const { id, ...data } = json;

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 });
    }

    const parsed = testimonialSchema.partial().safeParse(data);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { images, ...rest } = parsed.data;

    const updateData: Prisma.TestimonialUpdateInput = { ...rest };
    if (images !== undefined) {
      updateData.images = images ? (images as Prisma.InputJsonValue) : Prisma.JsonNull;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...testimonial,
      images: testimonial.images ? (testimonial.images as string[]) : null,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update testimonial";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

// DELETE testimonial
export async function DELETE(request: NextRequest) {
  try {
    await requireSession(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete testimonial";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}
