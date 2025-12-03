import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const category = searchParams.get("category");

    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : undefined;
    const skip = limitNumber && pageNumber > 1 ? (pageNumber - 1) * limitNumber : 0;

    const newsItems = await prisma.content.findMany({
      where: {
        status: "PUBLISHED",
        ...(category && { category }),
      },
      orderBy: {
        publishedAt: "desc",
      },
      ...(limitNumber && { take: limitNumber }),
      ...(skip > 0 && { skip }),
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        thumbnailUrl: true,
        publishedAt: true,
      },
    });

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error("Error fetching news items:", error);
    return NextResponse.json({ error: "Failed to fetch news items" }, { status: 500 });
  }
}
