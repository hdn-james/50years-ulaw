import { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetailClient from "./NewsDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getNewsItem(slug: string) {
  try {
    // Use absolute URL for server-side fetching
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const url = `${baseUrl}/api/news/${slug}`;

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      cache: "force-cache",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching news item:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    return {
      title: "Không tìm thấy bài viết",
      description: "Bài viết bạn đang tìm kiếm không tồn tại.",
    };
  }

  const title = `${newsItem.title} - ULAW 50 Năm`;
  const description = newsItem.seoDescription || newsItem.description || newsItem.title;
  const imageUrl =
    newsItem.seoImageUrl || newsItem.thumbnailUrl || "https://50-nam-ulaw.huynhdainhan.work/og-image.png";
  const imageAlt = newsItem.seoImageAlt || newsItem.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: newsItem.publishedAt || undefined,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    notFound();
  }

  return <NewsDetailClient newsItem={newsItem} />;
}
