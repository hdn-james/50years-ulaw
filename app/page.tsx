"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, ComponentType } from "react";
import { Banner } from "@/components/banner";
import { Header } from "@/components/header";
import { SplashScreen } from "@/components/splash-screen";
import { GradientBackground } from "@/components/ui/gradient-background";
import { cn } from "@/lib/utils";

const Activities = dynamic(() => import("@/components/activities").then((mod) => mod.Activities));
const HighlightImages = dynamic(() => import("@/components/highlight-images").then((mod) => mod.HighlightImages));
const History = dynamic(() => import("@/components/history").then((mod) => mod.History));
const Impression = dynamic(() => import("@/components/impression").then((mod) => mod.Impression));
const Memories = dynamic(() => import("@/components/memories").then((mod) => mod.Memories));
const Message50Years = dynamic(() => import("@/components/messages-50years").then((mod) => mod.Message50Years));
const Testimonials = dynamic(() => import("@/components/testimonial").then((mod) => mod.Testimonials));
const Timeline = dynamic(() => import("@/components/timeline").then((mod) => mod.Timeline));
const Video = dynamic(() => import("@/components/video").then((mod) => mod.Video));
const Sponsor = dynamic(() => import("@/components/sponsor").then((mod) => mod.Sponsors));
const FromThePress = dynamic(() => import("@/components/from-the-press").then((mod) => mod.FromThePress));
const News = dynamic(() => import("@/components/news").then((mod) => mod.News), { ssr: false });

// Map section IDs to their components
const SECTION_COMPONENTS: Record<string, ComponentType> = {
  message50years: Message50Years,
  impression: Impression,
  history: History,
  timeline: Timeline,
  video: Video,
  highlightImages: HighlightImages,
  activities: Activities,
  fromThePress: FromThePress,
  news: News,
  memories: Memories,
  testimonials: Testimonials,
  sponsor: Sponsor,
};

// Default section order (fallback if API fails)
const DEFAULT_SECTION_ORDER = [
  "message50years",
  "impression",
  "history",
  "timeline",
  "video",
  "highlightImages",
  "activities",
  "fromThePress",
  "news",
  "memories",
  "testimonials",
  "sponsor",
];

interface SectionOrderData {
  sectionId: string;
  name: string;
  order: number;
}

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_SECTION_ORDER);

  useEffect(() => {
    const fetchSectionOrder = async () => {
      try {
        const response = await fetch("/api/sections");
        if (response.ok) {
          const data: SectionOrderData[] = await response.json();
          // Sort by order and extract sectionIds
          const orderedIds = data.sort((a, b) => a.order - b.order).map((section) => section.sectionId);
          if (orderedIds.length > 0) {
            setSectionOrder(orderedIds);
          }
        }
      } catch (error) {
        console.error("Failed to fetch section order:", error);
        // Keep default order on error
      }
    };

    fetchSectionOrder();
  }, []);

  // Memoize the rendered sections to avoid unnecessary re-renders
  const renderedSections = useMemo(() => {
    return sectionOrder.map((sectionId) => {
      const Component = SECTION_COMPONENTS[sectionId];
      if (!Component) return null;
      return <Component key={sectionId} />;
    });
  }, [sectionOrder]);

  return (
    <>
      <SplashScreen onComplete={() => setShowContent(true)} />
      <div
        className={cn("transition-opacity duration-500", showContent ? "opacity-100" : "opacity-0 pointer-events-none")}
      >
        <GradientBackground
          className="relative w-screen from-sky-600 via-sky-50 to-sky-400"
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
          safariBackground="bg-sky-100"
        >
          <Header />
          <Banner />
          {renderedSections}
        </GradientBackground>
      </div>
    </>
  );
}
