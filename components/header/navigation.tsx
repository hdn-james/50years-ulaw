"use client";

import { motion, stagger } from "framer-motion";
import { useEffect, useState } from "react";
import { MenuItem } from "./menu";

interface SectionData {
  sectionId: string;
  name: string;
  order: number;
  href: string;
}

// Default routes as fallback
const DEFAULT_ROUTES = [
  { name: "Thông điệp 50 năm", href: "#le-ky-niem-50-nam" },
  { name: "Ấn tượng", href: "#an-tuong" },
  { name: "Lịch sử phát triển", href: "#lich-su-phat-trien" },
  { name: "Tổng quan sự kiện", href: "#tong-quan-su-kien" },
  { name: "Phim tài liệu", href: "#phim-tai-lieu" },
  { name: "Thư viện ảnh", href: "#thu-vien-anh" },
  { name: "Chuỗi hoạt động kỷ niệm", href: "#chuoi-hoat-dong-ky-niem" },
  { name: "Báo chí thông tin về sự kiện", href: "#bao-chi-thong-tin-ve-su-kien" },
  { name: "Tin tức", href: "#tin-tuc" },
  { name: "Ký ức hành trình 50 năm", href: "#ky-uc-hanh-trinh-50-nam" },
  { name: "Lời chúc", href: "#loi-chuc" },
  { name: "Nhà tài trợ", href: "#nha-tai-tro" },
];

const navVariants = {
  open: {
    transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) },
  },
  closed: {
    transition: { delayChildren: stagger(0.05, { from: "last" }) },
  },
};

export const Navigation = ({ isOpen, toggleOpen }: { isOpen: boolean; toggleOpen: () => void }) => {
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("/api/sections");
        if (response.ok) {
          const data: SectionData[] = await response.json();
          // Filter sections with href and map to route format
          const orderedRoutes = data
            .filter((section) => section.href)
            .sort((a, b) => a.order - b.order)
            .map((section) => ({
              name: section.name,
              href: section.href,
            }));

          if (orderedRoutes.length > 0) {
            setRoutes(orderedRoutes);
          }
        }
      } catch (error) {
        console.error("Failed to fetch section order:", error);
        // Keep default routes on error
      }
    };

    fetchSections();
  }, []);

  return (
    <motion.ul
      className="absolute top-20 left-6 z-[9999] m-0 list-none p-6"
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      variants={navVariants}
    >
      {routes.map((route) => (
        <MenuItem key={route.href} content={route.name} href={route.href} onClick={toggleOpen} />
      ))}
    </motion.ul>
  );
};
