import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kỷ niệm 50 năm ULAW (1976–2026) – Trường Đại học Luật TP.HCM",
  description:
    "Chuỗi chương trình kỷ niệm 50 năm truyền thống và 30 năm ngày mang tên Trường Đại học Luật Thành phố Hồ Chí Minh, vừa nhìn lại chặng đường lịch sử đầy tự hào vừa định hướng cho một tương lai phát triển rực rỡ và bền vững.",
  keywords: [
    "ULAW",
    "Trường Đại học Luật TP.HCM",
    "50 năm",
    "kỷ niệm",
    "truyền thống",
    "giáo dục",
    "pháp luật",
    "Ho Chi Minh City University of Law",
    "sự kiện",
    "lịch sử",
    "phát triển bền vững",
  ],
  openGraph: {
    title: "Kỷ niệm 50 năm ULAW (1976–2026) – Trường Đại học Luật TP.HCM",
    description:
      "Chuỗi chương trình kỷ niệm 50 năm truyền thống và 30 năm ngày mang tên Trường Đại học Luật Thành phố Hồ Chí Minh, vừa nhìn lại chặng đường lịch sử đầy tự hào vừa định hướng cho một tương lai phát triển rực rỡ và bền vững.",
    url: "https://50-nam-ulaw.huynhdainhan.work",
    siteName: "ULAW 50 Years",
    images: [
      {
        url: "https://50-nam-ulaw.huynhdainhan.work/og-image.png",
        width: 1200,
        height: 630,
        alt: "Logo Kỷ niệm 50 năm ULAW – Trường Đại học Luật TP.HCM",
      },
      {
        url: "https://50-nam-ulaw.huynhdainhan.work/og-image-square.png",
        width: 800,
        height: 800,
        alt: "Logo Kỷ niệm 50 năm ULAW – Trường Đại học Luật TP.HCM (Square)",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kỷ niệm 50 năm ULAW (1976–2026) – Trường Đại học Luật TP.HCM",
    description:
      "Chuỗi chương trình kỷ niệm 50 năm truyền thống và 30 năm ngày mang tên Trường Đại học Luật Thành phố Hồ Chí Minh, vừa nhìn lại chặng đường lịch sử đầy tự hào vừa định hướng cho một tương lai phát triển rực rỡ và bền vững.",
    images: [
      "https://50-nam-ulaw.huynhdainhan.work/og-image.png",
      "https://50-nam-ulaw.huynhdainhan.work/og-image-square.png",
    ],
    creator: "@ulawhcmc",
    site: "@ulawhcmc",
  },
  alternates: {
    canonical: "https://50-nam-ulaw.huynhdainhan.work",
  },
  themeColor: "#009688",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={cn(roboto.className, "text-base antialiased")}>
        <main>{children}</main>
      </body>
    </html>
  );
}
