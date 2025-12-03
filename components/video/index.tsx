'use client';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export const Video = () => {
  return (
    <section id="phim-tai-lieu" className="container">
      <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Phim tư liệu
      </h2>

      <LiteYouTubeEmbed
        id="oLJEwypl6_s"
        wrapperClass="mt-10 rounded-2xl w-full max-w-6xl mx-auto aspect-video bg-no-repeat bg-center bg-cover shadow-2xl cursor-pointer"
        iframeClass="size-full aspect-video rounded-2xl mt-0 inline-block"
        title="Phim tư liệu"
        playlist={false}
        poster="hqdefault"
        cookie={false}
        webp
        adNetwork={false}
      />
    </section>
  );
};
