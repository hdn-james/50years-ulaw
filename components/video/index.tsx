import { ShimmeringText } from "../ui/shimmering-text";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export const Video = () => {
  return (
    <section id="phim-tai-lieu" className="container">
      <h2 className="font-bold text-2xl text-sky-800 leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Phim tư liệu
      </h2>
      <div className="items-center-safe justify-center-safe flex">
        <div className="mt-10">
          <LiteYouTubeEmbed
            id="oLJEwypl6_s"
            title="YouTube video player"
            params="autoplay=1"
            poster="hqdefault"
            webp={true}
          />
        </div>
      </div>
    </section>
  );
};
