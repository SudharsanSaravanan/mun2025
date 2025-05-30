"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"
import Link from "next/link";

const images = [
  "/images/temp-image-1.JPG",
  "/images/temp-image-2.JPG",
  "/images/temp-image-3.JPG"
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [timeLeft, setTimeLeft] = useState<null | {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>(null);

  useEffect(() => {
    const getTimeRemaining = () => {
      const targetDate = new Date("2025-08-01T09:00:00");
      const now = new Date();
      const total = Math.max(targetDate.getTime() - now.getTime(), 0);

      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      return { days, hours, minutes, seconds };
    };

    const update = () => {
      setTimeLeft(getTimeRemaining());
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) {
    return <div className="text-center p-10">Loading...</div>;
  }

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="pt-16">
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[#202020]">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={images[currentImageIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-0 w-full h-full"
              >                
                <Image
                  src={images[currentImageIndex]}
                  alt="Background"
                  layout="fill"
                  objectFit="cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/65" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="container max-w-7xl px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-12 relative z-10"
          >              
            <div className="space-y-4">                
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-none">
                  <span className="text-white">AMRITA</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B7FF] via-[#33C7FF] to-[#00B7FF]">
                    MUN 2025
                  </span>
                </h1>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg md:text-xl font-semibold tracking-wider text-white/90">
                  AUGUST 1-3, 2025
                </h2>

                <p className="text-base md:text-md font-medium text-[#00B7FF] max-w-2xl mx-auto tracking-wider">
                  WHERE DIPLOMACY MEETS PROGRESS
                </p>
              </div>
            </div>  

            <div className="backdrop-blur-md bg-gradient-to-b from-black/40 to-black/60 rounded-lg px-4 py-3 inline-block mx-auto border border-white/10 shadow-xl shadow-black/50">
              <div className="flex gap-x-8 text-base font-medium text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00B7FF]/10 to-transparent blur-lg"></div>
                    <div className="relative">
                      <p className="text-2xl sm:text-3xl font-bold text-white leading-none mb-1">
                        {String(days).padStart(2, "0")}
                      </p>
                      <p className="text-[10px] font-semibold tracking-wider text-[#00B7FF] leading-none">DAYS</p>
                    </div>
                </div>        

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00B7FF]/10 to-transparent blur-lg"></div>
                  <div className="relative">
                    <p className="text-2xl sm:text-3xl font-bold text-white leading-none mb-1">
                      {String(hours).padStart(2, "0")}
                    </p>
                    <p className="text-[10px] font-semibold tracking-wider text-[#00B7FF] leading-none">HOURS</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00B7FF]/10 to-transparent blur-lg"></div>
                  <div className="relative">
                    <p className="text-2xl sm:text-3xl font-bold text-white leading-none mb-1">
                      {String(minutes).padStart(2, "0")}
                    </p>
                    <p className="text-[10px] font-semibold tracking-wider text-[#00B7FF] leading-none">MINUTES</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00B7FF]/10 to-transparent blur-lg"></div>
                  <div className="relative">
                    <p className="text-2xl sm:text-3xl font-bold text-white leading-none mb-1">
                      {String(seconds).padStart(2, "0")}
                    </p>
                    <p className="text-[10px] font-semibold tracking-wider text-[#00B7FF] leading-none">SECONDS</p>
                  </div>
                </div>              
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link href="/signup">
                <button className="mt-2 px-6 py-2 bg-[#00B7FF] cursor-pointer text-white text-lg font-medium rounded-lg transform transition-all duration-300 ease-out hover:bg-[#0077FF] hover:scale-102 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#00B7FF] focus:ring-opacity-50 active:scale-95">
                  Register Now
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
              Welcome to Amrita MUN'25
            </h2>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 max-w-4xl mx-auto">
              Dear Delegates,
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Welcome to Amrita-MUN&apos;25 — the premier Model United Nations conference of Amrita Vishwa Vidyapeetham, 
              Coimbatore Campus, where diplomacy, dialogue, and determination converge. From August 1st to 3rd, 2025, 
              join us on a journey that transcends borders and builds bridges of understanding. At Amrita-MUN, you won&apos;t just represent a nation—you&apos;ll step into the shoes of global leaders, 
              tackle real-world crises, and shape meaningful resolutions. Whether you&apos;re a seasoned MUNer or embarking on 
              your first committee, this conference is your stage to speak, lead, and inspire.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              With stimulating agendas, dynamic committees, and a platform that celebrates diverse voices, Amrita-MUN is 
              more than a simulation—it&apos;s an experience that transforms thinkers into changemakers. We can&apos;t wait to welcome you to the conference.
            </p>
            <p className="text-lg font-extrabold text-gray-600 max-w-4xl mx-auto">
              The world is waiting. Let&apos;s build it together—one step at a time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
