import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().min(1, "Logo URL is required"),
  alt: z.string().min(1, "Alt text is required"),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// GET all sponsors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const sponsors = await prisma.sponsor.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return NextResponse.json({ error: "Failed to fetch sponsors" }, { status: 500 });
  }
}

// POST create new sponsor
export async function POST(request: NextRequest) {
  try {
    await requireSession(request);

    const json = await request.json();
    const parsed = sponsorSchema.safeParse(json);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const sponsor = await prisma.sponsor.create({
      data: parsed.data,
    });

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    console.error("Error creating sponsor:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create sponsor";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

// PUT update sponsor
export async function PUT(request: NextRequest) {
  try {
    await requireSession(request);

    const json = await request.json();
    const { id, ...data } = json;

    if (!id) {
      return NextResponse.json({ error: "Sponsor ID is required" }, { status: 400 });
    }

    const parsed = sponsorSchema.partial().safeParse(data);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(sponsor);
  } catch (error) {
    console.error("Error updating sponsor:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update sponsor";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

// DELETE sponsor
export async function DELETE(request: NextRequest) {
  try {
    await requireSession(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sponsor ID is required" }, { status: 400 });
    }

    await prisma.sponsor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete sponsor";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}
