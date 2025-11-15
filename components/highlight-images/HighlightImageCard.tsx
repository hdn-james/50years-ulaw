"use client";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import type { HighlightImageCardProps } from "./types";

export const HighlightImageCard = ({
  title,
  description,
  imageSrc,
  category,
  index,
  totalCards,
}: HighlightImageCardProps) => {
  return (
    <Card className="group overflow-hidden border-none rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white transition-transform duration-300">
      <CardContent className="p-0">
        {/* Background Image */}
        <div className="relative w-full aspect-video h-auto overflow-hidden rounded-3xl">
          <Image
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 lg:p-12">
            {/* Badge at top */}
            {category && (
              <div className="self-start">
                <span className="inline-block px-4 py-2 text-xs text-ulaw-navy font-mono font-medium uppercase tracking-wider bg-white/50 backdrop-blur-md rounded-md">
                  {category}
                </span>
              </div>
            )}

            {/* Title and link at bottom */}
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight max-w-2xl">{title}</h3>
                <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-xl line-clamp-2">
                  {description}
                </p>
              </div>

              {/* Animated link */}
              <div className="flex items-center gap-3 text-white font-medium group-hover:gap-4 transition-all duration-300">
                <span className="transition-all duration-400">Xem chi tiết</span>
                <svg
                  className="w-5 h-5 transition-transform g"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
