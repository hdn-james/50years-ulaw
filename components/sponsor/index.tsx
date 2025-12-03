"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import * as React from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  alt: string;
  order: number;
}

const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => {
  return (
    <div className="rounded-2xl border-t-8 border-ulaw-blue bg-white p-10 group cursor-pointer transition-all">
      <div className="relative w-full h-24 sm:h-28">
        <Image
          src={sponsor.logoUrl}
          alt={sponsor.alt}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
};

export const Sponsors = () => {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const itemsPerPage = 6;

  React.useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("/api/sponsors");
        if (response.ok) {
          const data = await response.json();
          setSponsors(data);
        }
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Group sponsors into pages of 6
  const sponsorPages = React.useMemo(() => {
    const pages = [];
    for (let i = 0; i < sponsors.length; i += itemsPerPage) {
      pages.push(sponsors.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [sponsors]);

  if (loading) {
    return (
      <section id="nha-tai-tro" className="container min-h-screen flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl text-start w-full text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Nhà tài trợ chính
        </h2>
        <div className="mt-10 text-muted-foreground">Đang tải...</div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return (
      <section id="nha-tai-tro" className="container min-h-screen flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl text-start w-full text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
          Nhà tài trợ chính
        </h2>
        <p className="text-gray-600 text-start w-full mt-4 text-base sm:text-lg">
          Chân thành cảm ơn các đơn vị đã đồng hành cùng Trường Đại học Luật TP.HCM trong hành trình 50 năm truyền
          thống, 30 năm phát triển.
        </p>
      </section>
    );
  }

  const autoplayPlugin = Autoplay({ delay: 3000, stopOnInteraction: false });

  return (
    <section id="nha-tai-tro" className="container min-h-screen flex flex-col justify-center items-center py-20">
      <h2 className="font-bold text-2xl text-start w-full text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Nhà tài trợ chính
      </h2>
      <p className="text-gray-600 text-start w-full mt-4 text-base sm:text-lg">
        Chân thành cảm ơn các đơn vị đã đồng hành cùng Trường Đại học Luật TP.HCM trong hành trình 50 năm truyền thống,
        30 năm phát triển.
      </p>

      <div className="w-full mt-10">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin]}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {sponsorPages.map((page, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {page.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Page Indicators - Only show if more than 6 sponsors */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  current === index ? "bg-ulaw-blue w-8" : "bg-gray-300"
                }`}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
