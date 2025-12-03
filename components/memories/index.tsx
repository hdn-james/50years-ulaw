'use client';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export const Memories = () => {
  return (
    <section id="ky-uc-hanh-trinh-50-nam" className="container py-10">
      <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Ký ức hành trình 50 năm
      </h2>

      <LiteYouTubeEmbed
        wrapperClass="mt-10 rounded-2xl w-full mx-auto max-w-6xl aspect-video bg-no-repeat bg-center bg-cover"
        iframeClass="size-full aspect-video rounded-2xl mt-0 inline-block"
        id="sVCD4rMdk94"
        title="YKý ức hành trình 50 năm"
        playlist={false}
        poster="hqdefault"
        cookie={false}
        webp
        adNetwork={false}
      />
    </section>
  );
};
