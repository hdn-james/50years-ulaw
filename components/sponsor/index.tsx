import Image from "next/image";

const SponsorCard = ({ logo }: { logo: string }) => {
  return (
    <div className="rounded-2xl shadow-2xl border-t-8 border-ulaw-blue bg-white p-10 group cursor-pointer">
      <Image
        src={logo}
        alt="Sponsor Logo"
        width={200}
        height={100}
        className="object-contain w-full md:w-3/4 m-auto h-auto transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
};

export const Sponsors = () => {
  return (
    <section id="nha-tai-tro" className="container h-screen flex flex-col justify-center items-center">
      <h2 className="font-bold text-2xl text-start w-full text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
        Nhà tài trợ chính
      </h2>
      <p className="text-gray-600 text-start w-full mt-4 text-base sm:text-lg">
        Chân thành cảm ơn các đơn vị đã đồng hành cùng Trường Đại học Luật TP.HCM trong hành trình 50 năm truyền thống,
        30 năm phát triển.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10">
        <SponsorCard logo="/logo.webp" />
        <SponsorCard logo="/logo.webp" />
        <SponsorCard logo="/logo.webp" />
        <SponsorCard logo="/logo.webp" />
        <SponsorCard logo="/logo.webp" />
        <SponsorCard logo="/logo.webp" />
      </div>
    </section>
  );
};
