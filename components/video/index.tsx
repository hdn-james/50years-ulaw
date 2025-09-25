import { ShimmeringText } from "../ui/shimmering-text";

export const Video = () => {
  return (
    <section className="container">
      <ShimmeringText
        text="Phim tư liệu"
        className="font-bold text-2xl sm:text-4xl lg:text-5xl leading-normal tracking-wide"
        color="var(--color-sky-800)"
        shimmerColor="var(--color-sky-100)"
        duration={3}
        repeatDelay={1.5}
      />

      <div className="flex items-center-safe justify-center-safe">
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
