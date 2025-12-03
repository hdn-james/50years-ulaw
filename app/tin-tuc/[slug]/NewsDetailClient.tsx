import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

interface Author {
  id: string;
  username: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  body: string;
  thumbnailUrl: string | null;
  images: any;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seoDescription: string | null;
  seoImageUrl: string | null;
  seoImageAlt: string | null;
  author: Author | null;
  tags: Tag[];
}

interface NewsDetailClientProps {
  newsItem: NewsItem;
}

export default function NewsDetailClient({ newsItem }: NewsDetailClientProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="container mx-auto px-4 py-16">
      {/* Category Badge */}
      {newsItem.category && (
        <div className="mb-4">
          <span className="inline-flex items-center border-l-4 border-ulaw-blue pl-3 text-sm font-semibold uppercase tracking-wider text-ulaw-blue">
            {newsItem.category}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 leading-tight sm:text-4xl lg:text-5xl mb-6">{newsItem.title}</h1>

      {/* Description */}
      {newsItem.description && <p className="text-lg text-gray-700 mb-6 leading-relaxed">{newsItem.description}</p>}

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
        {newsItem.publishedAt && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={newsItem.publishedAt}>{formatDate(newsItem.publishedAt)}</time>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="max-w-4xl mx-auto">
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-ulaw-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-ulaw-blue prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r"
          dangerouslySetInnerHTML={{ __html: newsItem.body }}
        />

        {/* Tags */}
        {newsItem.tags && newsItem.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {newsItem.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back to News Button */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/#tin-tuc"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-ulaw-blue px-6 py-3 font-medium text-ulaw-blue transition-all hover:bg-ulaw-blue hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Xem thêm tin tức
        </Link>
      </div>
    </article>
  );
}
