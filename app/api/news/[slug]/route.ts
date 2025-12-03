import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const newsItem = await prisma.content.findUnique({
      where: {
        slug: slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        body: true,
        thumbnailUrl: true,
        images: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        seoDescription: true,
        seoImageUrl: true,
        seoImageAlt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!newsItem) {
      return NextResponse.json({ error: "News item not found" }, { status: 404 });
    }

    // Transform tags to a simpler format and convert dates to ISO strings
    const formattedNewsItem = {
      ...newsItem,
      publishedAt: newsItem.publishedAt ? newsItem.publishedAt.toISOString() : null,
      createdAt: newsItem.createdAt.toISOString(),
      updatedAt: newsItem.updatedAt.toISOString(),
      tags: newsItem.tags.map((t) => t.tag),
    };

    return NextResponse.json(formattedNewsItem);
  } catch (error) {
    console.error("Error fetching news item:", error);
    return NextResponse.json({ error: "Failed to fetch news item" }, { status: 500 });
  }
}
