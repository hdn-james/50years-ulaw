import { ShimmeringText } from "../ui/shimmering-text";

export const Video = () => {
  return (
    <section className="container">
      <h2 className="font-bold text-2xl text-sky-800 leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Phim tư liệu"
      </h2>
      <div className="items-center-safe justify-center-safe flex">
        <iframe
          className="mt-10"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/oLJEwypl6_s?si=i1q770ofqCGhjuVI"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};
