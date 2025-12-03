'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { highlights } from './constants';
import { HighlightImageCard } from './HighlightImageCard';

export const HighlightImages = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
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

        <Carousel className="w-full max-w-6xl mx-auto" setApi={setApi}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {highlights.map((highlight, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] sm:basis-[90%] md:basis-full">
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
          {/* Navigation buttons - hidden on mobile, visible on lg+ */}
          <CarouselPrevious variant={'ulaw'} className="hidden lg:flex" />
          <CarouselNext variant={'ulaw'} className="hidden lg:flex" />

          {/* Mobile scroll indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  current === index ? 'w-8 bg-ulaw-blue2' : 'w-2 bg-gray-300',
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={current === index ? 'true' : 'false'}
              />
            ))}
          </div>
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
