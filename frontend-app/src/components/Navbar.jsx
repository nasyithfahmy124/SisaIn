import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Recycle,
  Map,
  ArrowRight, // Mengganti LogOut dengan ArrowRight sesuai desain baru
  User, 
  Settings 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { name: 'Beranda', path: '/beranda', icon: Home, desc: 'Ringkasan aktivitas' },
  { name: 'Redistribusi', path: '/redistribusi', icon: Recycle, desc: 'Upload dan kelola material' },
  { name: 'Maps', path: '/maps', icon: Map, desc: 'Peta sebaran material terdekat' },
];

const menuVariants = {
  hidden: { opacity: 0, y: -15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: 'easeOut', staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

const navbarClass = {
  base: 'sticky top-0 z-50 transition-all duration-300',
  scrolled: 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100',
  normal: 'bg-white/60 backdrop-blur-md border-b border-transparent',
};

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Overlay Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>

      <nav className={`${navbarClass.base} ${isScrolled ? navbarClass.scrolled : navbarClass.normal}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Kiri: Logo */}
            <Link to="/beranda" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img src="/src/assets/img/logo1.png" alt="SISAIN" className="w-28 sm:w-32 md:w-36 h-auto object-contain" />
            </Link>

            {/* Tengah: Menu Desktop (Desain Kapsul) */}
            <div className="hidden md:flex items-center bg-gray-100/80 rounded-full p-1.5 shadow-inner">
              {navLinks.map(({ name, path }) => {
                const isActive = location.pathname === path;

                return (
                  <Link
                    key={name}
                    to={path}
                    className={`relative px-6 py-2 text-sm font-bold transition-colors duration-300 rounded-full z-10 ${
                      isActive ? 'text-yellow-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">{name}</span>

                    {/* Animasi Pill Bergerak */}
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-pill"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="absolute inset-0 z-0 rounded-full bg-[#FDE047] shadow-sm"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Kanan: KONDISI DESKTOP (Profil & Keluar) */}
            {user?.isAuthenticated ? (
              <div className="hidden md:flex items-center gap-5">
                {/* Ikon Profil Bulat Gelap */}
                <Link 
                  to="/profil" 
                  className="w-10 h-10 rounded-full bg-[#716018] flex items-center justify-center text-white hover:bg-[#5a4c13] transition-colors shadow-md" 
                  title="Profil"
                >
                  <User className="w-5 h-5" />
                </Link>
                
                {/* Ikon Pengaturan */}
                <Link 
                  to="/pengaturan" 
                  className="text-gray-600 hover:text-yellow-600 transition-colors" 
                  title="Pengaturan"
                >
                  <Settings className="w-6 h-6" />
                </Link>
                
                {/* Tombol Keluar Merah Muda */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#9F1239] px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300"
                >
                  Keluar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-[#FDE047] hover:bg-[#FACC15] text-yellow-900 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Gabung
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Tombol Menu Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              className={`md:hidden flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300 ${
                isOpen
                  ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                  : 'bg-white/80 border-gray-200 text-gray-700 hover:border-yellow-300 hover:text-yellow-600'
              }`}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-3 right-3 mt-2 md:hidden z-50">
              <div className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]">

                <div className="px-5 pt-5 pb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Navigation</p>
                  <p className="mt-1 text-sm text-gray-500">Jelajahi platform SISAIN</p>
                </div>

                <div className="px-3 pb-3">
                  {navLinks.map(({ name, path, icon: Icon, desc }) => {
                    const isActive = location.pathname === path;

                    return (
                      <motion.div key={name} variants={itemVariants}>
                        <Link
                          to={path}
                          className={`group relative flex items-center gap-3 px-3 py-3 mb-1 rounded-xl transition-all duration-200 ${
                            isActive ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {isActive && <motion.span layoutId="mobile-active-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-yellow-400" />}

                          <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-[#FDE047] text-yellow-900 shadow-sm'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-yellow-50 group-hover:text-yellow-600'
                          }`}>
                            <Icon className="w-[18px] h-[18px]" />
                          </div>

                          <div className="flex-1">
                            <span className="block text-sm font-bold">{name}</span>
                            <span className={`text-[11px] ${isActive ? 'text-yellow-700/70' : 'text-gray-400'}`}>{desc}</span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mx-4 border-t border-gray-100" />

                {/* KONDISI MOBILE: Gabung vs Profil/Keluar */}
                <div className="p-4">
                  {user?.isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link to="/profil" className="flex-1 flex items-center justify-center gap-2 bg-[#716018] text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors">
                          <User className="w-[18px] h-[18px]" />
                          Profil
                        </Link>
                        <Link to="/pengaturan" className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded-xl text-sm font-bold transition-colors">
                          <Settings className="w-[18px] h-[18px]" />
                          Setelan
                        </Link>
                      </div>
                      <button 
                        onClick={() => { logout(); setIsOpen(false); }} 
                        className="flex items-center justify-center gap-2 w-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#9F1239] px-4 py-3.5 rounded-xl text-sm font-bold transition-colors mt-1"
                      >
                        Keluar
                        <ArrowRight className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 w-full bg-[#FDE047] hover:bg-[#FACC15] text-yellow-900 px-4 py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200"
                    >
                      Gabung
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}