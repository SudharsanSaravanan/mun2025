import { FaGlobe, FaLinkedin, FaInstagram } from "react-icons/fa";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 font-inter">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="lg:col-span-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Image
                src="/images/AMRITA_MUN25.png"
                alt="Amrita MUN Logo"
                width={48}
                height={48}
                className="rounded-lg shadow-sm hidden md:block"
              />
              <h3 className="text-lg font-bold text-white leading-tight">
                Amrita Model United Nations Society
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Empowering future diplomats through Model United Nations conferences and debates.
            </p>
          </div>

          <div className="space-y-4 hidden md:block pl-18">
            <h4 className="text-lg font-semibold text-white text-center lg:text-left">Quick Links</h4>
            <div className="flex justify-center lg:justify-start">
              <ul className="space-y-3 text-left">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out hover:translate-x-1 inline-block text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out hover:translate-x-1 inline-block text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out hover:translate-x-1 inline-block text-sm">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out hover:translate-x-1 inline-block text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-3">
              <a 
                href="mailto:mun@cb.amrita.edu" 
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm block"
              >
                mun@cb.amrita.edu
              </a>
              <address className="text-gray-300 text-sm not-italic leading-relaxed">
                Amrita Model United Nations Society,<br />
                Amrita Vishwa Vidyapeetham,<br />
                Amritanagar, Coimbatore - 641 112<br />
                Tamil Nadu, India
              </address>
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Follow Us</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a 
                href="https://www.mun.cb.amrita.edu" 
                aria-label="Website" 
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-110 transform"
              >
                <FaGlobe size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/company/a-munso" 
                aria-label="LinkedIn" 
                className="text-gray-300 hover:text-blue-600 transition-all duration-300 hover:scale-110 transform"
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="https://www.instagram.com/amunso.amrita/" 
                aria-label="Instagram" 
                className="text-gray-300 hover:text-pink-500 transition-all duration-300 hover:scale-110 transform"
              >
                <FaInstagram size={24} />
              </a>
            </div>
            <p className="text-gray-400 text-xs mt-4 hidden md:block">
              Stay updated with our latest events and announcements
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-12 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Amrita Model United Nations Society.<br className="md:hidden" />
              <span className="md:ml-1">All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
