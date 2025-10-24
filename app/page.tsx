"use client";

import { useState } from "react";
import { Banner } from "@/components/banner";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Header } from "@/components/header";
import { SplashScreen } from "@/components/splash-screen";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Activities = dynamic(() => import("@/components/activities").then((mod) => mod.Activities));
const HighlightImages = dynamic(() => import("@/components/highlight-images").then((mod) => mod.HighlightImages));
const History = dynamic(() => import("@/components/history").then((mod) => mod.History));
const Impression = dynamic(() => import("@/components/impression").then((mod) => mod.Impression));
const Memories = dynamic(() => import("@/components/memories").then((mod) => mod.Memories));
const Message50Years = dynamic(() => import("@/components/messages-50years").then((mod) => mod.Message50Years));
const Testimonials = dynamic(() => import("@/components/testimonial").then((mod) => mod.Testimonials));
const Timeline = dynamic(() => import("@/components/timeline").then((mod) => mod.Timeline));
const Video = dynamic(() => import("@/components/video").then((mod) => mod.Video));

export default function Home() {
  const [showContent, setShowContent] = useState(false);

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
          <Message50Years />
          <Impression />
          <History />
          <Timeline />
          <Video />
          <HighlightImages />
          <Activities />
          <Memories />
          <Testimonials />
        </GradientBackground>
      </div>
    </>
  );
}
