import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const skip = searchParams.get("skip");

    const pressItems = await prisma.pressAboutUs.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        dateReleased: "desc",
      },
      ...(skip && { skip: parseInt(skip) }),
      ...(limit && { take: parseInt(limit) }),
      select: {
        id: true,
        title: true,
        dateReleased: true,
        description: true,
        thumbnailUrl: true,
        link: true,
      },
    });

    return NextResponse.json(pressItems);
  } catch (error) {
    console.error("Error fetching press items:", error);
    return NextResponse.json({ error: "Failed to fetch press items" }, { status: 500 });
  }
}
