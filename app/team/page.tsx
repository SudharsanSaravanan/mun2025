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
        image: "Secretriat/rM.webp",
      },
      {
        name: "Dr. Ramaguru Radhakrishnan",
        role: "Assistant Professor (Senior Grade), TIFAC-CORE in Cyber Security",
        image: "Secretriat/RAM.webp",
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
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">{title}</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex-grow basis-[250px] max-w-[500px]"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage
                    src={member.image}
                    alt={member.name}
                    className="rounded-full object-cover w-full h-full"
                  />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-un-blue mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ⬇️ Main Page Component
export default function Team() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white">
      <Navbar /> {/* ✅ Add this line */}
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600">Meet the passionate individuals behind our MUN club</p>
        </motion.div>

        {sections.map((section, idx) => (
          <TeamSection key={idx} title={section.title} members={section.members} />
        ))}
      </div>
    </div>
  );
}
