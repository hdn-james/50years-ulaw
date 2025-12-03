"use client";

import { BookOpen, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

async function fetchNews(limit: number, page: number) {
  const response = await fetch(`/api/news?limit=${limit}&page=${page}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  return response.json();
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
}

export const News = () => {
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isPending, startTransition] = React.useTransition();
  const itemsPerPage = 6;

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const data = await fetchNews(itemsPerPage, 1);
        setNewsItems(data);
        setHasMore(data.length === itemsPerPage);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsInitialLoading(false);
      }
    });
  }, []);

  const handleLoadMore = () => {
    startTransition(async () => {
      try {
        const nextPage = page + 1;
        const data = await fetchNews(itemsPerPage, nextPage);
        setNewsItems((prev) => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === itemsPerPage);
      } catch (error) {
        console.error("Error loading more news:", error);
      }
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (newsItems.length === 0 && !isInitialLoading) {
    return (
      <section id="tin-tuc" className="container py-10">
        <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Tin tức
        </h2>
        <div className="mt-10 flex items-center justify-center">
          <div className="text-muted-foreground">Chưa có tin tức nào</div>
        </div>
      </section>
    );
  }

  // Bento grid layout positions - alternating large cards every 6 items
  const getBentoLayout = (index: number) => {
    const groupIndex = Math.floor(index / 6); // Which group of 6
    const position = index % 6; // Position within the group
    const isLeftGroup = groupIndex % 2 === 0; // Alternate between left and right

    if (isLeftGroup) {
      // Pattern 1: Large on left (positions 0-5)
      const layouts = [
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - top left
        { span: "lg:col-span-2 lg:row-span-2", isLarge: true }, // Large - center/right
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - top right
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - bottom left
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - bottom center
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - bottom right
      ];
      return layouts[position];
    } else {
      // Pattern 2: Large on right (positions 0-5)
      const layouts = [
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - top left
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - top center
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - top right
        { span: "lg:col-span-2 lg:row-span-2", isLarge: true }, // Large - bottom left/center
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - bottom right top
        { span: "lg:col-span-1 lg:row-span-1", isLarge: false }, // Small - bottom right bottom
      ];
      return layouts[position];
    }
  };

  return (
    <section id="tin-tuc" className="container py-10">
      <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Tin tức
      </h2>

      {/* Bento Grid */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
        {newsItems.map((item, index) => {
          const layout = getBentoLayout(index);
          const isLarge = layout.isLarge;

          return (
            <Link
              key={item.id}
              href={`/tin-tuc/${item.slug}`}
              className={cn(
                "group relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]",
                layout.span,
              )}
            >
              {/* Image Background */}
              <div className="relative h-full min-h-[200px] w-full lg:min-h-[250px]">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover brightness-75 transition-all duration-300 group-hover:brightness-50"
                    sizes={isLarge ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800">
                    <BookOpen className="h-16 w-16 text-gray-600" />
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  {/* Category Badge */}
                  {item.category && (
                    <div className="mb-2 inline-flex w-fit items-center border-l-2 border-white pl-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
                        {item.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className={cn(
                      "font-bold leading-tight text-white transition-colors group-hover:text-blue-300",
                      isLarge ? "text-xl sm:text-2xl lg:text-3xl line-clamp-3" : "text-base sm:text-lg line-clamp-2",
                    )}
                  >
                    {item.title}
                  </h3>

                  {/* Description - only for large card */}
                  {isLarge && item.description && (
                    <p className="mt-2 text-sm text-gray-300 line-clamp-2 sm:text-base">{item.description}</p>
                  )}

                  {/* Date */}
                  {item.publishedAt && (
                    <div className="mt-2 text-xs text-gray-400 sm:text-sm">
                      {formatDate(item.publishedAt).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Play Button for Video Content (optional) */}
                {item.category?.toLowerCase().includes("video") && (
                  <div className="absolute right-4 top-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:bg-white/30">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-ulaw-blue bg-white px-6 py-3 font-medium text-ulaw-blue transition-all hover:bg-ulaw-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Đang tải..." : "Tải thêm tin tức"}
            <ChevronDown className={`h-5 w-5 ${isPending ? "animate-bounce" : ""}`} />
          </button>
        </div>
      )}
    </section>
  );
};
