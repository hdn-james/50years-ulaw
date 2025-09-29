import { ShimmeringText } from '../ui/shimmering-text';

export const Activities = () => {
  return (
    <section className="container min-h-[50dvh] py-10">
      <ShimmeringText
        text="Chuỗi hoạt động kỷ niệm 50 năm truyền thống"
        className="font-bold text-2xl leading-normal tracking-wide sm:text-4xl lg:text-5xl"
        color="var(--color-sky-800)"
        shimmerColor="var(--color-sky-100)"
        duration={3}
        repeatDelay={1.5}
      />
    </section>
  );
};
