import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/constants';

export const Header = () => {
  return (
    <div className="bg-gradient-to-b from-teal-900 to-sky-950">
      <div className="items-center-safe justify-center-safe container flex h-26 gap-6 text-[#F8F5F0]">
        <Link href="" className="min-w-fit">
          <Image
            src="/logo.png"
            alt="Logo"
            width={39.5 * 1.5}
            height={64 * 1.5}
            className="ml-4 size-auto"
          />
        </Link>
        {routes.map((route) => (
          <Link
            key={route.href}
            className="text-center font-semibold uppercase transition-colors duration-300 hover:text-[#E6BE8A]"
            href={route.href}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
