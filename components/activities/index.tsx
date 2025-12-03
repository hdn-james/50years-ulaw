'use client';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export const Activities = () => {
  return (
    <section id="chuoi-hoat-dong-ky-niem" className="container py-10">
      <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Chuỗi hoạt động kỷ niệm 50 năm truyền thống
      </h2>

      <LiteYouTubeEmbed
        id="0rnLr2X6B4A"
        wrapperClass="mt-10 rounded-2xl w-full max-w-6xl mx-auto aspect-video bg-no-repeat bg-center bg-cover"
        iframeClass="size-full aspect-video rounded-2xl mt-0 inline-block"
        title="Chuỗi hoạt động kỷ niệm 50 năm truyền thống"
        playlist={false}
        poster="hqdefault"
        cookie={false}
        webp
        adNetwork={false}
      />
    </section>
  );
};
