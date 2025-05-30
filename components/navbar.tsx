"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/committees", label: "Committees" },
  { href: "/team", label: "Secretariat" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (    
    <nav className="fixed top-0 w-full bg-white backdrop-blur-xl z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-2">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex justify-center items-center gap-2 text-decoration-none">
            <Image className="mt-0"
              src="/images/AMUN25_Navbar.png"
              alt="MUN Logo"
              width={190}
              height={190}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-m font-medium text-gray-800 hover:text-[#00B7FF] transition-colors duration-300
                    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.75 after:w-0 after:bg-[#00B7FF] after:transition-all after:duration-300
                    hover:after:w-full
                    ${isActive ? 'text-[#00B7FF] after:w-full' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/signup" className="flex items-center text-decoration-none">
              <button className="bg-[#00B7FF] cursor-pointer text-white rounded-lg px-4 py-1 -mt-1 transform transition-all duration-300 ease-out hover:bg-[#0077FF] hover:scale-102 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#00B7FF] focus:ring-opacity-50 active:scale-95">
                Register
              </button>
            </Link>
          </div>          
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#009EDB] focus:outline-none focus:ring-2 focus:ring-[#009EDB] rounded-lg p-2"
              aria-label="Toggle menu"
            >
              {/* Hamburger Icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div 
              className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >              
              {links.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transform transition-all duration-200 ${isActive ? 'text-[#009EDB] bg-blue-100' : 'text-gray-600 hover:text-[#009EDB] hover:bg-blue-50'}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
