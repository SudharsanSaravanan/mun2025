"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tilt } from "react-tilt";
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
    name: "United Nations Security Council (UNSC)",
    description: "Step into the shoes of global leaders within the esteemed UN Security Council. Representing diverse member states, you will navigate the complex landscape of international security through collaborative diplomacy, crafting resolutions that illuminate the path towards diplomatic solutions and safeguarding global peace.",
    logo: "/images/un_logo.png",
    members: [
      { name: "Chairperson", image: "/images/watermelon_head.jpg" },
      { name: "Vice Chair", image: "/images/watermelon_head.jpg" },
      { name: "Director", image: "/images/watermelon_head.jpg" }
    ]
  },
  {
    id: 2,
    name: "United Nations Conference on Trade and Development (UNCTAD)",
    description: "Join us in unraveling the complexities of international trade, investment, and sustainable development at the United Nations Conference on Trade and Development. Engage in formal discussions surrounding globalization, negotiate trade agreements, and co-create innovative solutions to foster a more equitable and prosperous future for all nations, particularly those in the developing world.",
    logo: "/images/un_logo.png",
    members: [
      { name: "Chairperson", image: "/images/watermelon_head.jpg" },
      { name: "Vice Chair", image: "/images/watermelon_head.jpg" },
      { name: "Director", image: "/images/watermelon_head.jpg" }
    ],
  },
  {
    id: 3,
    name: "United Nations High Commissioner for Refugees (UNHCR)",
    description: "Advocate for the rights and well-being of displaced persons worldwide as a delegate within the United Nations High Commissioner for Refugees. Delve into the complexities of refugee crises and asylum policies, striving to uphold principles of compassion, protection, and solidarity while working towards durable solutions that restore hope and dignity to those forced to flee their homes.",
    logo: "/images/un_logo.png",
    members: [
      { name: "Speaker", image: "/images/watermelon_head.jpg" },
      { name: "Deputy Speaker", image: "/images/watermelon_head.jpg" },
      { name: "Secretary", image: "/images/watermelon_head.jpg" }
    ]
  },
  {
    id: 4,
    name: "All India Political Parties Meet (AIPPM)",
    description: "Join us at the All India Political Parties Meet, where the diverse voices of India's political landscape converge to address pressing national and global challenges. Engage in spirited debates, negotiate alliances, and craft policy positions that reflect the interests and aspirations of your constituency, driving progress and prosperity for all citizens.",
    logo: "/images/un_logo.png",
    members: [
      { name: "Director-General", image: "/images/watermelon_head.jpg" },
      { name: "Assistant Director", image: "/images/watermelon_head.jpg" },
      { name: "Technical Officer", image: "/images/watermelon_head.jpg" }
    ]
  },
  {
    id: 5,
    name: "Historic Crisis Committee",
    description: "Step back in time and immerse yourself in the intricate web of historical events and geopolitical tensions as a member of the Historic Crisis Committee. From pivotal moments in world history to fictionalized scenarios inspired by real-world dynamics, your decisions will shape the course of history and leave an indelible mark on the world stage.",
    logo: "/images/un_logo.png",
    members: [
      { name: "Executive Director", image: "/images/watermelon_head.jpg" },
      { name: "Deputy Director", image: "/images/watermelon_head.jpg" },
      { name: "Programme Officer", image: "/images/watermelon_head.jpg" }
    ]
  },
  {
    id: 6,
    name: "International Press",
    description: "As members of the International Press, you hold the power to shape narratives and uncover the depths of global events. From capturing pivotal moments to delving into diplomatic discourse, your role is to foster transparency and amplify the voices of those shaping our shared future on the international stage.",
    logo: "/images/un_logo.png",
    members: [
      { name: "President", image: "/images/watermelon_head.jpg" },
      { name: "Vice President", image: "/images/watermelon_head.jpg" },
      { name: "Registrar", image: "/images/watermelon_head.jpg" }
    ]
  }
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

  const handleRegister = (committeeId: number) => console.log(`Registering for committee ${committeeId}`);
  const handleCountryMatrix = (committeeId: number) => console.log(`Opening country matrix for committee ${committeeId}`);

  const scrollToEnd = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <br />
      <main className="container mx-auto py-12 px-4 sm:px-6 relative top-9">
        <div className="text-center mb-12  ">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Committees</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of committees and find the perfect fit for your MUN experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {committees.map((committee) => (
            <Tilt key={committee.id} options={defaultTiltOptions}>
              <div
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer h-full transition-shadow duration-300 hover:shadow-lg border border-sky-100 flex flex-col"
                onClick={() => openModal(committee)}
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
                <div className="p-6 flex-grow bg-white border-t border-sky-100 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">{committee.name}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3">{committee.description}</p>
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
                    className="text-sky-800 text-2xl font-bold hover:text-sky-600"
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
                    <button
                      onClick={() => handleRegister(selectedCommittee.id)}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg w-full sm:w-auto"
                    >
                      Register Now
                    </button>
                    <button
                      onClick={() => handleCountryMatrix(selectedCommittee.id)}
                      className="bg-white hover:bg-gray-100 text-sky-700 border border-sky-300 font-medium py-2 px-6 rounded-lg w-full sm:w-auto"
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
      <br/>
      <br />
      <br />
    </div>
  );
}