"use client";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

const images = [
  { src: "/gallery/IMG_0588.JPG", alt: "Photo 1" },
  { src: "/gallery/IMG_1475.JPG", alt: "Photo 2" },
  { src: "/gallery/IMG_2435.JPG", alt: "Photo 3" },
  { src: "/gallery/IMG-20240722-WA0311.jpg", alt: "Photo 4" },
  { src: "/gallery/IMG_1370.JPG", alt: "Photo 5" },
  { src: "/gallery/IMG_0456.JPG", alt: "Photo 6" },
  { src: "/gallery/IMG_1518.JPG", alt: "Photo 7" },
  { src: "/gallery/IMG_2444.JPG", alt: "Photo 8" },
  { src: "/gallery/IMG_0434.JPG", alt: "Photo 9" },
  { src: "/gallery/IMG_1262.JPG", alt: "Photo 10" },
  { src: "/gallery/IMG_1288.JPG", alt: "Photo 11" },
  { src: "/gallery/IMG-20240722-WA0344.jpg", alt: "Photo 12" },
  { src: "/gallery/IMG_0404.JPG", alt: "Photo 13" },
  { src: "/gallery/IMG_1440.JPG", alt: "Photo 14" },
  { src: "/gallery/IMG_2492.JPG", alt: "Photo 15" },
  { src: "/gallery/IMG_1395.JPG", alt: "Photo 16" },
  { src: "/gallery/IMG-20240722-WA0278.jpg", alt: "Photo 17" },
  { src: "/gallery/IMG_1972.JPG", alt: "Photo 18" },
  { src: "/gallery/IMG-20240722-WA0249.jpg", alt: "Photo 19" },
  { src: "/gallery/SK_20240721_184842_lmc_8.4.jpg", alt: "Photo 20" },
  { src: "/gallery/IMG_1406.JPG", alt: "Photo 21" },
  { src: "/gallery/IMG_0399.JPG", alt: "Photo 22" },
  { src: "/gallery/20240721_071002592_iOS.jpg", alt: "Photo 23" },
  { src: "/gallery/IMG_2140.JPG", alt: "Photo 24" },
  { src: "/gallery/IMG_0600.JPG", alt: "Photo 25" },
  { src: "/gallery/IMG-20240722-WA0302.jpg", alt: "Photo 26" },
  { src: "/gallery/IMG_1424.JPG", alt: "Photo 27" },
  { src: "/gallery/IMG_1606.JPG", alt: "Photo 28" },
  { src: "/gallery/IMG_0419.JPG", alt: "Photo 29" },
  { src: "/gallery/IMG_0440.JPG", alt: "Photo 30" },
  { src: "/gallery/IMG_1963.JPG", alt: "Photo 31" },
  { src: "/gallery/20240719150033_IMG_6555.jpg", alt: "Photo 32" },
  { src: "/gallery/SK_20240719_091223_lmc_8.4.jpg", alt: "Photo 33" },
  { src: "/gallery/20240721_070525968_iOS.jpg", alt: "Photo 34" },
  { src: "/gallery/IMG_0507.JPG", alt: "Photo 35" },
  { src: "/gallery/DSC02617.jpg", alt: "Photo 36" },
  { src: "/gallery/5.JPG", alt: "Photo 37" },
  { src: "/gallery/IMG20240720120544.jpg", alt: "Photo 38" },
  { src: "/gallery/IMG-20240719-WA0004.jpg", alt: "Photo 39" },
  { src: "/gallery/IMG_0373.JPG", alt: "Photo 40" },
  { src: "/gallery/20240719_033313620_iOS.jpg", alt: "Photo 41" },
  { src: "/gallery/19.JPG", alt: "Photo 42" },
  { src: "/gallery/IMG_2140.JPG", alt: "Photo 43" },
  { src: "/gallery/IMG_2476.JPG", alt: "Photo 44" },
  { src: "/gallery/SK_20240720_114704_lmc_8.4.jpg", alt: "Photo 45" },
  { src: "/gallery/IMG-20240722-WA0261.jpg", alt: "Photo 46" },
  { src: "/gallery/20240719_070123958_iOS.jpg", alt: "Photo 47" },
  { src: "/gallery/20240719120055_IMG_6026.jpg", alt: "Photo 48" },
];

export default function GalleryPage() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white">
       <Navbar /> {/* ✅ Add this line */}
      <div className="py-10 px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Gallery of Glory</h1>
          <p className="text-xl text-gray-600">
            The Pinnacle of Diplomacy: A Look Back at Amrita-MUN&apos;24 Highlights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {images.map((img, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden flex justify-center items-center">
              <img
                src={img.src}
                alt={img.alt}
                className="max-w-full h-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
