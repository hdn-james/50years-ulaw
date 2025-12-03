import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  body: z.string().min(10, "Wish must be at least 10 characters").max(1000, "Wish is too long"),
  images: z.array(z.string().startsWith("/uploads/")).optional().default([]),
});

// GET all published testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        body: true,
        images: true,
        isStatic: true,
        order: true,
        createdAt: true,
      },
    });

    // Parse images JSON field
    const formattedTestimonials = testimonials.map((t: (typeof testimonials)[number]) => ({
      ...t,
      images: t.images ? (t.images as string[]) : [],
    }));

    return NextResponse.json(formattedTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST create new testimonial (public submission)
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = testimonialSchema.safeParse(json);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: parsed.data.name,
        body: parsed.data.body,
        images: parsed.data.images.length > 0 ? (parsed.data.images as Prisma.InputJsonValue) : Prisma.JsonNull,
        isPublished: false, // New submissions are unpublished by default
        isStatic: false,
        order: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your wish! It will be reviewed and published soon.",
        id: testimonial.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to submit wish";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
