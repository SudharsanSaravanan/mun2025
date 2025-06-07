"use client";

import Link from "next/link";
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface DashboardNavbarProps {
  onLogout: () => void;
}

export function DashboardNavbar({ onLogout }: DashboardNavbarProps) {
  return (    
    <nav className="fixed top-0 w-full bg-white backdrop-blur-xl z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-2">
        <div className="flex items-center justify-between h-20">
          <Link href="/dashboard" className="flex justify-center items-center gap-2 text-decoration-none">
            <Image className="mt-0"
              src="/images/AMUN25_Navbar.png"
              alt="MUN Logo"
              width={190}
              height={190}
              priority
            />
          </Link>

          <div className="flex items-center">
            <Button 
              onClick={onLogout} 
              variant="outline"
              className="bg-white text-md cursor-pointer text-white bg-[#00B7FF] transition-all duration-300 ease-out hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#00B7FF] focus:ring-opacity-50 active:scale-95"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
