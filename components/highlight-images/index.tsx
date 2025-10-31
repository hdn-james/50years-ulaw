"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HighlightImageCard } from "./HighlightImageCard";
import { highlights } from "./constants";

export const HighlightImages = () => {
  return (
    <section id="thu-vien-anh" className="py-12 md:py-20 overflow-hidden" aria-labelledby="highlight-images-heading">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2
            id="highlight-images-heading"
            className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl"
          >
            Những hình ảnh tiêu biểu
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Khám phá những khoảnh khắc đáng nhớ và thành tựu nổi bật trong hành trình 50 năm phát triển
          </p>
        </div>

        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent>
            {highlights.map((highlight, index) => (
              <CarouselItem key={index}>
                <HighlightImageCard
                  key={index}
                  category={highlight.category}
                  title={highlight.title}
                  description={highlight.description}
                  imageSrc={highlight.imageSrc}
                  index={index}
                  totalCards={highlights.length}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={"success"} />
          <CarouselNext variant={"success"} />
        </Carousel>

        {/* View All Button */}
        <div className="mt-12 md:mt-20 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-white bg-ulaw-blue rounded-lg hover:bg-ulaw-purple transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-ulaw-blue focus:ring-offset-2 hover:shadow-xl hover:scale-105"
            aria-label="Xem tất cả hình ảnh tiêu biểu"
          >
            Xem tất cả hình ảnh
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
