"use client";

import { BookOpen, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

interface PressItem {
  id: string;
  title: string;
  dateReleased: string;
  description: string;
  thumbnailUrl: string | null;
  link: string | null;
}

export const FromThePress = () => {
  const [featuredItem, setFeaturedItem] = React.useState<PressItem | null>(null);
  const [listItems, setListItems] = React.useState<PressItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const ITEMS_PER_PAGE = 3;

  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch all items to determine total count
        const response = await fetch("/api/press");
        if (response.ok) {
          const allData = await response.json();
          if (allData.length > 0) {
            setFeaturedItem(allData[0]);
            const totalItems = allData.length - 1; // Exclude featured item
            setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
            // Set initial page items
            const items = allData.slice(1, 1 + ITEMS_PER_PAGE);
            setListItems(items);
          }
        }
      } catch (error) {
        console.error("Error fetching press items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchPage = async (page: number) => {
    try {
      const skip = 1 + (page - 1) * ITEMS_PER_PAGE; // Skip featured + previous pages
      const response = await fetch(`/api/press?skip=${skip}&limit=${ITEMS_PER_PAGE}`);
      if (response.ok) {
        const data = await response.json();
        setListItems(data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching press items:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchPage(page);
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <section id="bao-chi-thong-tin-ve-su-kien" className="container py-10">
        <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Báo chí thông tin về sự kiện
        </h2>
        <div className="mt-10 flex items-center justify-center">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </section>
    );
  }

  if (!featuredItem && listItems.length === 0) {
    return (
      <section id="bao-chi-thong-tin-ve-su-kien" className="container py-10">
        <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Báo chí thông tin về sự kiện
        </h2>
        <div className="mt-10 flex items-center justify-center">
          <div className="text-muted-foreground">Chưa có bài báo nào được công bố</div>
        </div>
      </section>
    );
  }

  return (
    <section id="bao-chi-thong-tin-ve-su-kien" className="container py-10">
      <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Báo chí thông tin về sự kiện
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Featured Item - Left Side */}
        {featuredItem && (
          <div className="group overflow-hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded-lg">
              {featuredItem.thumbnailUrl ? (
                <Image
                  src={featuredItem.thumbnailUrl}
                  alt={featuredItem.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="pt-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                <BookOpen className="h-4 w-4" />
                <time dateTime={featuredItem.dateReleased}>{formatDate(featuredItem.dateReleased).toUpperCase()}</time>
              </div>
              <h3 className="mb-3 font-bold text-lg leading-tight text-gray-900 line-clamp-2">{featuredItem.title}</h3>
              {featuredItem.description && (
                <p className="mb-4 text-gray-600 text-sm line-clamp-2">{featuredItem.description}</p>
              )}
              {featuredItem.link && (
                <Link
                  href={featuredItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-blue-600 text-sm transition-colors hover:text-blue-800"
                >
                  Đọc thêm
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* List Items - Right Side */}
        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            {listItems.map((item) => (
              <div key={item.id} className="group flex overflow-hidden">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden bg-gray-100 sm:h-40 sm:w-40  rounded-lg">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="160px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                      <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                      <time dateTime={item.dateReleased}>{formatDate(item.dateReleased).toUpperCase()}</time>
                    </div>
                    <h3 className="mb-2 font-bold text-base leading-tight text-gray-900 line-clamp-2 sm:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  {item.link && (
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-blue-600 text-sm transition-colors hover:text-blue-800"
                    >
                      Đọc thêm
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  "flex h-9 w-9 items-center justify-center transition-colors",
                  currentPage === 1 ? "cursor-not-allowed text-gray-300" : "text-gray-700 hover:text-ulaw-blue",
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page Numbers */}
              {generatePageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center text-gray-500">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center text-sm font-medium transition-colors rounded",
                      currentPage === page
                        ? "bg-ulaw-blue text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-ulaw-blue",
                    )}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  "flex h-9 w-9 items-center justify-center transition-colors",
                  currentPage === totalPages
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-700 hover:text-ulaw-blue",
                )}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
