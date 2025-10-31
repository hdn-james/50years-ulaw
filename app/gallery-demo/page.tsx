"use client";

import AnniversaryGallery from "@/components/anniversary-gallery";

export default function GalleryDemoPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Gallery Demo
          </h1>
          <p className="text-lg text-gray-600">
            Anniversary Gallery Component Showcase
          </p>
        </div>

        <AnniversaryGallery />
      </div>
    </main>
  );
}
