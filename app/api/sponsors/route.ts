import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        alt: true,
        order: true,
      },
    });

    return NextResponse.json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return NextResponse.json({ error: "Failed to fetch sponsors" }, { status: 500 });
  }
}
