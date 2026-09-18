import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Recycle, // Ikon untuk Redistribusi
  Map,     // Ikon untuk Maps
  ArrowUpRight,
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

// Diperbarui: Hanya 3 menu utama
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
  scrolled: 'bg-white/90 backdrop-blur-xl shadow-md border-b border-gray-100',
  normal: 'bg-white/60 backdrop-blur-md border-b border-transparent',
};

const mobileMenuClass = {
  wrapper: 'absolute top-full left-3 right-3 mt-2 md:hidden',
  card: 'overflow-hidden rounded-2xl bg-white/95 backdrop-blur-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]',
  link: 'group relative flex items-center gap-3 px-3 py-3 mb-1 rounded-xl transition-all duration-200',
  icon: 'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
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
          <div className={`flex items-center justify-between h-16 md:h-20 ${isScrolled ? 'py-1' : 'py-2'}`}>

            {/* Logo */}
            <Link to="/beranda" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img src="/src/assets/img/logo1.png" alt="SISAIN" className="w-28 sm:w-32 md:w-32 h-auto object-contain" />
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex flex-1 justify-center gap-2">
              {navLinks.map(({ name, path }) => {
                const isActive = location.pathname === path;

                return (
                  <Link
                    key={name}
                    to={path}
                    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                      isActive ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">{name}</span>

                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-indicator"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="absolute inset-0 z-0 rounded-md border-b-2 border-yellow-500 bg-yellow-50"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* KONDISI DESKTOP: Gabung vs Profil/Keluar */}
            {user?.isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profil" className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 transition-colors rounded-full" title="Profil">
                  <User className="w-5 h-5" />
                </Link>
                <Link to="/pengaturan" className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 transition-colors rounded-full" title="Pengaturan">
                  <Settings className="w-5 h-5" />
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 ml-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
                >
                  Keluar
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Gabung
                <ArrowUpRight className="w-4 h-4" />
              </Link>
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
            <motion.div variants={menuVariants} initial="hidden" animate="visible" exit="exit" className={mobileMenuClass.wrapper}>
              <div className={mobileMenuClass.card}>

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
                          className={`${mobileMenuClass.link} ${
                            isActive ? 'bg-yellow-50 text-yellow-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {isActive && <motion.span layoutId="mobile-active-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-yellow-500" />}

                          <div className={`${mobileMenuClass.icon} ${
                            isActive
                              ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-yellow-50 group-hover:text-yellow-600'
                          }`}>
                            <Icon className="w-[18px] h-[18px]" />
                          </div>

                          <div className="flex-1">
                            <span className="block text-sm font-semibold">{name}</span>
                            <span className={`text-[11px] ${isActive ? 'text-yellow-600/70' : 'text-gray-400'}`}>{desc}</span>
                          </div>

                          <ArrowUpRight className={`w-4 h-4 transition-all ${
                            isActive ? 'text-yellow-500' : 'text-gray-300 group-hover:text-gray-500'
                          }`} />
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
                        <Link to="/profil" className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 px-4 py-3 rounded-xl text-sm font-semibold transition-colors">
                          <User className="w-[18px] h-[18px]" />
                          Profil
                        </Link>
                        <Link to="/pengaturan" className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 px-4 py-3 rounded-xl text-sm font-semibold transition-colors">
                          <Settings className="w-[18px] h-[18px]" />
                          Setelan
                        </Link>
                      </div>
                      <button 
                        onClick={() => { logout(); setIsOpen(false); }} 
                        className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors mt-1"
                      >
                        <LogOut className="w-[18px] h-[18px]" />
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-white px-4 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-yellow-500/25 transition-all duration-200"
                    >
                      Gabung
                      <ArrowUpRight className="w-4 h-4" />
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