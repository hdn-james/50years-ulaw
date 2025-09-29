import { ShimmeringText } from '../ui/shimmering-text';

export const Memories = () => {
  return (
    <section className="container min-h-[50dvh] py-10">
      <ShimmeringText
        text="Ký ức hành trình 50 năm"
        className="font-bold text-2xl leading-normal tracking-wide sm:text-4xl lg:text-5xl"
        color="var(--color-sky-800)"
        shimmerColor="var(--color-sky-100)"
        duration={3}
        repeatDelay={1.5}
      />
    </section>
  );
};
