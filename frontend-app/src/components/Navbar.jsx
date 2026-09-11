import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek untuk mendeteksi scroll dan mengubah gaya navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/beranda' },
    { name: 'Upload', path: '/upload' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'Impact', path: '/impact' },
    { name: 'Statistics', path: '/statistics' },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-md border-b border-gray-100 py-0' 
          : 'bg-white/50 backdrop-blur-md border-b border-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* KIRI: Logo dengan efek hover membesar sedikit */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link to="/beranda" className="flex items-center transition-transform duration-300 hover:scale-105">
                <img src="/src/assets/img/logo1.png" alt="SISAIN" className="w-32 h-auto object-contain" />
            </Link>
          </div>

          {/* TENGAH: Menu Navigasi Desktop dengan Magic Indicator */}
          <div className="hidden md:flex flex-1 justify-center space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                    isActive ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  
                  {/* Animasi Sliding Pill / Underline dari Framer Motion */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute inset-0 bg-yellow-50 border-b-2 border-yellow-500 rounded-md z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* KANAN: Tombol Get Started (Glow effect on hover) */}
          <div className="hidden md:flex items-center">
            <Link 
              to="/login"
              className="relative group overflow-hidden bg-yellow-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Get Started</span>
              {/* Efek kilauan cahaya saat hover */}
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0"></div>
            </Link>
          </div>

          {/* Tombol Hamburger Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg p-2 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE dengan AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl absolute w-full overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? 'bg-yellow-50 text-yellow-600 shadow-sm border border-yellow-100' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 pb-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center w-full bg-yellow-500 text-white px-4 py-3 rounded-xl text-base font-semibold shadow-lg shadow-yellow-500/30 hover:bg-yellow-600 active:scale-95 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}