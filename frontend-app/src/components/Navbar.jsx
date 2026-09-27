import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bell, ChevronDown, Home, LogOut, Map, Plus, Recycle, Settings, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
    { name: 'Beranda', path: '/beranda', icon: Home },
    { name: 'Redistribusi', path: '/redistribusi', icon: Recycle },
    { name: 'Maps', path: '/maps', icon: Map }
];

export default function Navbar() {
    const location = useLocation();
    const profileRef = useRef(null);
    const { user, logout, isLoading } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const isAuthenticated = Boolean(user?.isAuthenticated);
    const userName = user?.username || 'Pengguna';
    const userPhoto = user?.image || null;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsProfileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = event => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
    };

    return (
        <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'border-gray-100 bg-white/95 shadow-sm backdrop-blur-xl' : 'border-gray-100 bg-white'}`}>
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-[68px] items-center">
                    <Link to="/beranda" className="flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.02]">
                        <img src="/src/assets/img/logo1.png" alt="SISAIN" className="h-auto w-[92px] object-contain sm:w-[104px]" />
                    </Link>

                    <div className="ml-7 flex items-center rounded-full bg-[#f5f5f2] p-1">
                        {navLinks.map(({ name, path }) => {
                            const isActive = location.pathname === path;

                            return (
                                <Link key={name} to={path} className={`relative rounded-full px-4 py-2 text-[12px] font-semibold transition-colors duration-200 ${isActive ? 'text-[#6d5b00]' : 'text-gray-500 hover:text-gray-900'}`}>
                                    {isActive && <motion.span layoutId="navbar-active" transition={{ type: 'spring', stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-full bg-[#FFCC00]" />}
                                    <span className="relative z-10">{name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        {(isLoading || isAuthenticated) && (
                            <>
                                <Link to="/redistribusi/material/new" className="flex h-9 items-center gap-1.5 rounded-full bg-[#FFCC00] px-4 text-[11px] font-bold text-gray-950 shadow-sm transition hover:bg-[#F4C800]">
                                    <Plus size={14} strokeWidth={2.5} />
                                    Tambah Material
                                </Link>

                                <button type="button" aria-label="Notifikasi" className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
                                    <Bell size={17} strokeWidth={1.8} />
                                </button>

                                {isLoading ? (
                                    <div className="h-9 w-[110px] animate-pulse rounded-full bg-gray-100" />
                                ) : (
                                    <div ref={profileRef} className="relative">
                                        <button type="button" onClick={() => setIsProfileOpen(value => !value)} className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition ${isProfileOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                                            <div className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#716018] ring-2 ring-white">
                                                {userPhoto ? <img src={userPhoto} alt={userName} className="h-full w-full object-cover" /> : <User size={15} className="text-white" />}
                                                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-[1.5px] border-white bg-emerald-500" />
                                            </div>

                                            <div className="max-w-[110px] text-left leading-none">
                                                <p className="truncate text-[11px] font-bold text-gray-900">{userName}</p>
                                                <p className="mt-1 text-[8px] font-medium text-emerald-600">Online</p>
                                            </div>

                                            <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} className="absolute right-0 top-[calc(100%+10px)] w-56 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,.12)]">
                                                    <div className="mb-1 rounded-xl bg-gray-50 px-3 py-2.5">
                                                        <p className="truncate text-[11px] font-bold text-gray-900">{userName}</p>
                                                        <p className="mt-1 truncate text-[9px] text-gray-400">{user?.email}</p>
                                                    </div>

                                                    <Link to="/profil" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-950">
                                                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100"><User size={15} /></span>
                                                        Profil
                                                    </Link>

                                                    <Link to="/pengaturan" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-950">
                                                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100"><Settings size={15} /></span>
                                                        Pengaturan
                                                    </Link>

                                                    <div className="my-1 border-t border-gray-100" />

                                                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50">
                                                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50"><LogOut size={15} /></span>
                                                        Keluar
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </>
                        )}

                        {!isLoading && !isAuthenticated && (
                            <Link to="/login" className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-[11px] font-bold text-gray-800 shadow-sm transition hover:border-[#FFCC00] hover:bg-[#FFFDF5]">
                                Guest Start
                                <ArrowRight size={13} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}