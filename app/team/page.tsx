"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"





// Define a type for a Team Member
interface TeamMember {
  name: string;
  role: string;
  image: string;
}

// Define the type for sections
interface Section {
  title: string;
  members: TeamMember[];
}

// ⬇️ Team Dat
const sections: Section[] = [
  {
    title: "Convenors",
    members: [
      {
        name: "Dr. Ritwik M.",
        role: "Assistant Professor, Dept. of Computer Science and Engineering",
        image: "",
      },
      {
        name: "Dr. Ramaguru Radhakrishnan",
        role: "Assistant Professor (Senior Grade), TIFAC-CORE in Cyber Security",
        image: "",
      },
    ],
  },
  {
    title: "Core Secretariat",
    members: [
      {
        name: "Shruti Sivakumar",
        role: "Secretary General",
        image: "Secretriat/Shruti.jpg",
      },
      {
        name: "Adithya Anish Nair",
        role: "Deputy Secretary General",
        image: "Secretriat/nair.jpg",
      },
      {
        name: "Aakash Sriram",
        role: "Director General",
        image: "Secretriat/Aakash.jpg",
      },
      {
        name: "Thilagan Iniyavan",
        role: "Charge D'Affairs",
        image: "Secretriat/thilagan.jpg",
      },
      {
        name: "Adithya Prakash Dash",
        role: "Student Advisor",
        image: "Secretriat/dash.webp",
      },
    ],
  },
  {
    title: "Admin & Sponsorship Team",
    members: [
      {
        name: "Vishal Suresh",
        role: "USG",
        image: "Secretriat/Vishal.jpg",
      },
      {
        name: "Theerth Krish",
        role: "USG",
        image: "Secretriat/Theerth.jpg",
      },
      {
        name: "R D Tharun",
        role: "Deputy USG",
        image: "Secretriat/rdt.jpg",
      },
    ],
  },
  {
    title: "Finance Team",
    members: [
      {
        name: "Madhavkrishnan Muralidharan",
        role: "USG",
        image: "Secretriat/Madhavkrishna.jpg",
      },
    ],
  },
  {
    title: "Logistics Team",
    members: [
      {
        name: "Hemadhri P C",
        role: "USG",
        image: "Secretriat/Hemadhri.jpg",
      },
      {
        name: "Roshni A",
        role: "Deputy USG",
        image: "Secretriat/Roshini.jpg",
      },
      {
        name: "Mithileshwaran",
        role: "Deputy USG",
        image: "Secretriat/Mithileshwaran.jpg",
      },
    ],
  },
  {
    title: "Public Relations and Outreach Team",
    members: [
      {
        name: "Rishi Beria",
        role: "USG",
        image: "Secretriat/Rishi.jpg",
      },
      {
        name: "Rohit Vishnu Y",
        role: "USG",
        image: "Secretriat/Rohit.jpg",
      },
      {
        name: "Kundhave S",
        role: "Deputy USG",
        image: "Secretriat/Kundhave.png",
      },
      {
        name: "Deo Vaibhav",
        role: "Deputy USG",
        image: "Secretriat/deo.jpg",
      },
    ],
  },
  {
    title: "Delegate Affairs Team",
    members: [
      {
        name: "Yashashvi Agarwal",
        role: "USG",
        image: "Secretriat/Yashasvi.jpg",
      },
      {
        name: "Ujjawal Pratap Singh",
        role: "USG",
        image: "Secretriat/ujjawal.jpg",
      },
    ],
  },
  {
    title: "Web and Tech Team",
    members: [
      {
        name: "Vasudev Kishore",
        role: "USG",
        image: "Secretriat/Vasu.jpg",
      },
      {
        name: "Aswath Siddharth",
        role: "Deputy USG",
        image: "Secretriat/Aswath.png",
      },
      {
        name: "Adithya Menon R",
        role: "Deputy USG",
        image: "Secretriat/menon.jpg",
      },
    ],
  },
];

// Define the TeamSection props type
interface TeamSectionProps {
  title: string;
  members: TeamMember[];
}

function TeamSection({ title, members }: TeamSectionProps) {
  const isConvenors = title === "Convenors";

  return (
    <div className="mb-28">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-8 lowercase first-letter:uppercase">
        {title}
      </h2>

      {isConvenors ? (
        // Convenors Section
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex flex-col items-center relative group"
        >
          <div className="relative w-[76rem] max-w-full h-auto shadow-none group">
            <img
              src="Secretriat/mun convenors.png"
              alt="Convenors"
              className="w-full h-auto object-contain"
            />
            <div className="absolute inset-0 bg-[url('/pattern.png')] bg-cover bg-center opacity-0 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay pointer-events-none" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-16 mt-8 text-center">
            <div className="max-w-xs">
              <h3 className="text-lg font-semibold text-gray-600">
                Dr. Ramaguru Radhakrishnan
              </h3>
              <p className="text-sm text-gray-600">
                Assistant Professor (Senior Grade), TIFAC-CORE in Cyber Security
              </p>
            </div>
            <div className="max-w-xs">
              <h3 className="text-lg font-semibold text-gray-600">Dr. Ritwik M.</h3>
              <p className="text-sm text-gray-600">
                Assistant Professor, Dept. of Computer Science and Engineering
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        // Non-Convenors Section
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <div className="w-[76rem] bg-gray-100/40 backdrop-blur-sm border border-gray-300 shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-wrap justify-center gap-10">
              {members.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center group"
                >
                  {/* Circular image */}
                  <div className="relative w-52 h-52 rounded-full border-[2px] border-sky-400 shadow-md overflow-hidden group">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-sky-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-center px-2">
                      <div>
                        <h3 className="text-sm font-semibold">{member.name}</h3>
                        <p className="text-xs">{member.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Name & role (initial state) */}
                  <div className="mt-3 text-center transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="text-sm font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Main Page Component
export default function Team() {
  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-white to-blue-50 flex flex-col items-center">
      <Navbar /> {/* ✅ Navigation stays at top */}
      
      <div className="container px-4 flex flex-col items-center text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600">
            Meet the passionate individuals behind our MUN club
          </p>
        </motion.div>

        {/* All sections centered */}
        <div className="w-full flex flex-col items-center">
          {sections.map((section, idx) => (
            <TeamSection key={idx} title={section.title} members={section.members} />
          ))}
        </div>
      </div>
    </div>
  );
}
