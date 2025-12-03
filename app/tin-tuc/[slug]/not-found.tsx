import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Header } from "@/components/header";
import { GradientBackground } from "@/components/ui/gradient-background";

export default function NotFound() {
  return (
    <GradientBackground
      className="relative min-h-screen w-screen from-sky-600 via-sky-50 to-sky-400"
      transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
      safariBackground="bg-sky-100"
    >
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/#tin-tuc"
            className="inline-flex items-center gap-2 rounded-lg bg-ulaw-blue px-6 py-3 font-medium text-white transition-all hover:bg-ulaw-blue/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </GradientBackground>
  );
}
