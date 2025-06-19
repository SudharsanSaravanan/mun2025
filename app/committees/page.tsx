"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tilt } from "react-tilt";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";

interface CommitteeMember {
  name: string;
  image: string;
}

interface Committee {
  id: number;
  name: string;
  description: string;
  logo: string;
  members: CommitteeMember[];
}

const committees: Committee[] = [
  {
    id: 1,
    name: "International Press Coprs",
    description: "International press corps, constituting both reporters and photojournalists, covers committee proceedings, conducts interviews, writes articles, and captures MUN moments creatively.",
    logo: "/images/IPC_logo.png",
    members: [
      { name: "Chairperson", image: "/images/watermelon_head.jpg" },
      { name: "Vice Chair", image: "/images/watermelon_head.jpg" },
      { name: "Director", image: "/images/watermelon_head.jpg" }
    ]
  },
  {
    id: 2,
    name: "Constituent Assembly",
    description: "Constituent assembly is a historical Indian setup discussing the formation of the Indian constitution. Debates are based on national policy, rights, and governance.",
    logo: "/images/CA_logo.png",
    members: [
      { name: "Chairperson", image: "/images/watermelon_head.jpg" },
      { name: "Vice Chair", image: "/images/watermelon_head.jpg" },
      { name: "Director", image: "/images/watermelon_head.jpg" }
    ],
  },
  {
    id: 3,
    name: "United Nations Human Rights Council",
    description: "United Nations Human Rights Council deals with global human rights issues, violations, and promotes fundamental freedom across countries.",
    logo: "/images/UNHRC_logo.png",
    members: [
      { name: "Speaker", image: "/images/watermelon_head.jpg" },
      { name: "Deputy Speaker", image: "/images/watermelon_head.jpg" },
      { name: "Secretary", image: "/images/watermelon_head.jpg" }
    ]
  },
  {
    id: 4,
    name: "Economic And Social Council",
    description: "Economic and Social Council focuses on global economic development, sustainability, and social issues like education, health, and inequality.",
    logo: "/images/UNSC_logo.png",
    members: [
      { name: "Director-General", image: "/images/watermelon_head.jpg" },
      { name: "Assistant Director", image: "/images/watermelon_head.jpg" },
      { name: "Technical Officer", image: "/images/watermelon_head.jpg" }
    ]
  },
  {
    id: 5,
    name: "United Nations Security Council",
    description: "United Nations Security Council handles international peace and security. It discusses conflicts, sanctions, peacekeeping missions, and crisis situations.",
    logo: "/images/UNSC_logo.png",
    members: [
      { name: "Executive Director", image: "/images/watermelon_head.jpg" },
      { name: "Deputy Director", image: "/images/watermelon_head.jpg" },
      { name: "Programme Officer", image: "/images/watermelon_head.jpg" }
    ]
  },
];

const defaultTiltOptions = {
  reverse: false,
  max: 15,
  perspective: 1000,
  scale: 1,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

export default function CommitteePage() {
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openModal = (committee: Committee) => setSelectedCommittee(committee);
  const closeModal = () => setSelectedCommittee(null);

  const handleCountryMatrix = (committeeId: number) => console.log(`Opening country matrix for committee ${committeeId}`);

  const scrollToEnd = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <main className="container mx-auto py-20 px-4 sm:px-6 relative top-9">
          <div className="text-center mb-12  ">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Committees</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of committees and find the perfect fit for your MUN experience.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {committees.map((committee) => (
              <Tilt key={committee.id} options={defaultTiltOptions}>
                <div
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer h-full transition-shadow duration-300 hover:shadow-lg border border-sky-100 flex flex-col w-full max-w-[170px] sm:max-w-sm min-w-[160px] sm:min-w-[280px] flex-shrink-0"
                  //onClick={() => openModal(committee)}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={committee.logo}
                      alt={`${committee.name} logo`}
                      fill
                      className="object-cover w-full h-full"
                      style={{ borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/150?text=Logo";
                      }}
                    />
                  </div>

                  {/* Fixed card content section - consistent height and no mt-auto */}
                  <div className="p-4 sm:p-6 flex-grow bg-white border-t border-sky-100 flex flex-col">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">{committee.name}</h2>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">{committee.description}</p>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>

          <AnimatePresence>
            {selectedCommittee && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl border border-sky-200"
                >
                  <div className="flex items-center justify-between p-4 bg-sky-100 border-b border-sky-200 sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-sky-800">{selectedCommittee.name}</h2>
                    <button
                      onClick={closeModal}
                      className="text-sky-800 text-3xl font-bold hover:text-sky-600 cursor-pointer pr-2"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedCommittee.members.map((member, index) => (
                        <div key={index} className="text-center">
                          <div className="h-24 w-24 mx-auto relative rounded-full overflow-hidden border-2 border-sky-200 shadow">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "https://via.placeholder.com/150?text=Photo";
                              }}
                            />
                          </div>
                          <p className="mt-2 text-sm text-sky-700 font-medium">{member.name}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-gray-700">{selectedCommittee.description}</p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <Link href="/signup">
                        <button className="bg-sky-600 cursor-pointer text-white font-medium py-2 px-6 rounded-lg w-full sm:w-auto transform transition-all duration-300 ease-out hover:bg-[#0077FF] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#00B7FF] focus:ring-opacity-50 active:scale-99">
                          Register Now
                        </button>
                      </Link>
                      <button
                        onClick={() => handleCountryMatrix(selectedCommittee.id)}
                        className="bg-white cursor-pointer hover:bg-gray-100 text-sky-700 border border-sky-300 font-medium py-2 px-6 rounded-lg w-full sm:w-auto"
                      >
                        View Country Matrix
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          
          {/* Scroll to End Button - Fixed to top right, hidden on mobile */}
          {showScrollButton && !isMobile && (
            <motion.button
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0.9 }}
              whileHover={{ opacity: 1 }}
              onClick={scrollToEnd}
              className="fixed top-4 right-4 p-2 rounded-full bg-sky-600 text-white shadow-lg z-40 hover:bg-sky-700 transition-all duration-300 w-10 h-10 flex items-center justify-center"
              aria-label="Scroll to bottom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.button>
          )}
        </main>
      </div>
    </>
  );
}