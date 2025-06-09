"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"

const images = [
  
  "/bg/Image21.jpg",
  "/bg/Image26.jpg",
  "/bg/Image6.jpg",
  "/bg/Image11.jpg",
  "/bg/Image2.jpg",
  "/bg/Image14.jpg",
  "/bg/Image7.jpg",
  "/bg/Image22.jpg",
  "/bg/Image23.jpg",
  "/bg/Image24.jpg",
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
          <AnimatePresence mode="wait">
            <motion.div
              key={images[currentImageIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
            >
              <Image
                src={images[currentImageIndex]}
                alt="Background"
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-black opacity-60" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container max-w-7xl px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8 relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-grey-900 leading-tight">
              AMRITA -{" "}
              <span className="bg-[#00B7FF] bg-clip-text text-transparent">
                MUN 2025
              </span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-black text-[#00B7FF]">
              AUGUST 1-3, 2025
            </h2>

            <p className="text-2xl md:text-2xl font-extrabold text-grey-800 max-w-3xl mx-auto">
              WHERE DIPLOMACY MEETS PROGRESS
            </p>
            <br />
            <div className="text-white px-6 sm:px-10 py-10 max-w-4xl mx-auto">
              <div className="grid grid-cols-4 sm:grid-cols-4 text-lg sm:text-xl font-medium text-center">
                <div>
                  <p className="text-5xl font-bold">{String(days).padStart(2, "0")}</p>
                  <p className="mt-2">Days</p>
                </div>
                <div>
                  <p className="text-5xl font-bold">{String(hours).padStart(2, "0")}</p>
                  <p className="mt-2">Hours</p>
                </div>
                <div>
                  <p className="text-5xl font-bold">{String(minutes).padStart(2, "0")}</p>
                  <p className="mt-2">Minutes</p>
                </div>
                <div>
                  <p className="text-5xl font-bold">{String(seconds).padStart(2, "0")}</p>
                  <p className="mt-2">Seconds</p>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Decorative Background Element */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute inset-0 -z-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src="images/AMRITA_MUN25.png"
              alt="Background"
              className="w-[38%] h-[78%] opacity-30 -mt-8"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-25 bg-white">
        <div className=" px-4 border-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900">
              Letter from the Secretary-General
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto font-serif">
              Warm greetings,<br/><br/>
              It is with great pride and anticipation that I welcome you to Amrita MUN 2025 — a conference built on vision, driven by purpose, and alive with possibility.<br/><br/>
              What began as a bold new chapter last year has now grown into a conference we&apos;re proud to call one of the most potent, well-curated MUNs in the region. This year, we return with four powerful committees and the International Press Corps, a brilliant team, and a renewed commitment to create a platform where diplomacy meets progress and global conversations begin with you.<br/><br/>
              As delegates, you are not just participants — you are changemakers. Over these three days, you will explore urgent international issues, negotiate across cultures and ideologies, and shape resolutions that reflect both intellect and empathy. You will challenge yourself, grow as leaders, and walk away with more than just awards — you&apos;ll carry forward a mindset of global citizenship.<br/><br/>
              The Secretariat has worked tirelessly to craft a meaningful, immersive experience, and we are so excited to welcome you to our Ettimadai campus — nestled between hills, ideas, and hope.<br/><br/>
              So come prepared. Come curious. And come ready to lead.<br/><br/>
              On behalf of the entire team, I look forward to meeting you in person — and making Amrita MUN 2025 truly unforgettable.
            </p>
            <div className="flex justify-center mt-4">
              <div className="flex flex-row items-start gap-8 max-w-4xl w-full">
                <div className="flex flex-col justify-start ml-100 w-[70%] text-right">
                  <p className="text-lg text-gray-700 font-serif">
                    With pride and pleasure,<br/><br/>
                  </p>
                  <img 
                    src="images/Signature.JPG"
                    alt="Signature"
                    className="w-[300px] h-auto mb-4 self-end"
                  />
                  <p className="text-lg text-gray-700 font-serif">
                    Shruti Sivakumar<br/>
                    Secretary General<br/>
                    Amrita MUN 2025<br/>
                    Amrita Vishwa Vidyapeetham, Coimbatore
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-25 bg-white">
        <div className="container max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
              Welcome to Amrita-MUN'25
            </h2>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 max-w-4xl mx-auto">
              Dear Delegates,
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Welcome to Amrita-MUN&apos;25 — the premier Model United Nations conference of Amrita Vishwa Vidyapeetham, 
              Coimbatore Campus, where diplomacy, dialogue, and determination converge. From August 1st to 3rd, 2025, 
              join us on a journey that transcends borders and builds bridges of understanding. At Amrita-MUN, you won&apos;t just represent a nation—you&apos;ll step into the shoes of global leaders, 
              tackle real-world crises, and shape meaningful resolutions. Whether you&apos;re a seasoned MUNer or embarking on 
              your first committee, this conference is your stage to speak, lead, and inspire.
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              With stimulating agendas, dynamic committees, and a platform that celebrates diverse voices, Amrita-MUN is 
              more than a simulation—it&apos;s an experience that transforms thinkers into changemakers. We can&apos;t wait to welcome you to the conference.
            </p>
            <p className="text-lg font-extrabold text-gray-700 max-w-4xl mx-auto">
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
