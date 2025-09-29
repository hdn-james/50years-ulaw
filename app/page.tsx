import { Activities } from "@/components/activities";
import { Banner } from "@/components/banner";
import { Header } from "@/components/header";
import { HighlightImages } from "@/components/highlight-images";
import { History } from "@/components/history";
import { Impression } from "@/components/impression";
import { Memories } from "@/components/memories";
import { Message50Years } from "@/components/messages-50years";
import { Testimonials } from "@/components/testimonial";
import { Timeline } from "@/components/timeline";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Video } from "@/components/video";

export default function Home() {
  return (
    <GradientBackground
      className="relative w-screen from-sky-600 via-sky-50 to-sky-400"
      transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
      safariBackground="bg-sky-200"
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
  );
}
