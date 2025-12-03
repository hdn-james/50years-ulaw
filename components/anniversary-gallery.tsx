import { motion } from 'framer-motion';
import { useState } from 'react';

const images = [
  { src: '/binh-trieu-old.webp', caption: 'Lễ khai giảng năm 1980' },
  { src: '/sinh-vien-tot-nghiep.webp', caption: 'Lễ tốt nghiệp 1995' },
  { src: '/q4-old.webp', caption: 'Kỷ niệm 30 năm thành lập' },
  { src: '/long-phuoc.webp', caption: 'Sinh viên xuất sắc 2005' },
  { src: '/binh-trieu-new.webp', caption: 'Hoạt động thiện nguyện' },
  { src: '/q4-new.webp', caption: 'Lễ kỷ niệm 50 năm' },
];

export default function AnniversaryGallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="space-y-24">
      {/* Concept 1: Journey Through Time (Masonry Grid) */}
      <section className="container mx-auto py-16">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">50 Năm Một Hành Trình</h2>
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl">
              <img
                src={img.src}
                alt={img.caption}
                className="w-full object-cover rounded-2xl hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concept 2: Moments of Celebration (Grid + Lightbox) */}
      <section className="container mx-auto py-16 bg-gray-50 rounded-2xl">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Khoảnh Khắc Kỷ Niệm</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl cursor-pointer group"
              onClick={() => setLightbox(img.src)}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {lightbox && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox} alt="Lightbox" className="max-h-[80vh] rounded-lg shadow-2xl border border-white/20" />
          </div>
        )}
      </section>

      {/* Concept 3: Memories Carousel (Hero Slider) */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
        <h2 className="text-4xl font-bold text-center mb-10 text-white relative z-10">Dấu Ấn Một Thời</h2>
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [0, `-${100 * images.length}%`] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {images.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-full relative">
                <img src={img.src} alt={img.caption} className="w-full h-[60vh] object-cover opacity-80" />
                <div className="absolute bottom-10 left-10 bg-black/60 px-4 py-2 rounded-lg">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
