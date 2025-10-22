"use client";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export const Video = () => {
  return (
    <section id="phim-tai-lieu" className="container">
      <h2 className="font-bold text-2xl text-sky-800 leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Phim tư liệu
      </h2>
      <div className="items-center-safe justify-center-safe flex">
        <div className="mt-10 w-[560px]">
          <LiteYouTubeEmbed
            id="oLJEwypl6_s"
            title="YouTube video player"
            playlist={false}
            poster="hqdefault"
            cookie={false}
            webp
            adNetwork={false}
          />
        </div>
      </div>
    </section>
  );
};
