import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/constants';

export const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-950 to-teal-900">
      <div className="items-center-safe justify-center-safe container flex h-26 gap-6 text-[#F8F5F0]">
        <Image
          src="/logo.png"
          alt="Logo"
          width={39.5 * 2}
          height={64 * 2}
          className="ml-4 h-12 w-auto"
        />
        {routes.map((route) => (
          <Link
            key={route.href}
            className="text-center font-semibold uppercase hover:text-[#E6BE8A]"
            href={route.href}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
