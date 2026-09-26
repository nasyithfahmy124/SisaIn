import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Map, Recycle, User, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const mobileNavLinks = [
    { name: 'Beranda', path: '/beranda', icon: Home },
    { name: 'Redistribusi', path: '/redistribusi', icon: Recycle },
    { name: 'Maps', path: '/maps', icon: Map },
    { name: 'Profil', path: '/profil', icon: User }
];

export default function MobileNavbar() {
    const location = useLocation();
    const { user, isLoading } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    const isAuthenticated = Boolean(user?.isAuthenticated);
    const userPhoto = user?.image || null;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`sticky top-0 z-50 border-b bg-white transition-all duration-300 md:hidden ${isScrolled ? 'shadow-sm' : ''}`}>
                <div className="mx-auto flex h-[58px] items-center justify-between px-4">
                    <Link to="/beranda" className="flex shrink-0 items-center">
                        <img src="/src/assets/img/logo1.png" alt="SISAIN" className="h-auto w-[82px] object-contain" />
                    </Link>

                    <div className="flex items-center gap-2">
                        {(isLoading || isAuthenticated) && (
                            <button type="button" aria-label="Notifikasi" className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
                                <Bell size={17} strokeWidth={1.8} />
                            </button>
                        )}

                        <Link to="/profil" className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#716018] ring-2 ring-gray-100">
                            {userPhoto ? <img src={userPhoto} alt="Profil" className="h-full w-full object-cover" /> : <User size={15} className="text-white" />}
                        </Link>
                    </div>
                </div>
            </header>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 px-4 py-2 backdrop-blur-xl md:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-around relative">
                    {mobileNavLinks.map(({ name, path, icon: Icon }) => {
                        const isActive = location.pathname === path;

                        return (
                            <Link key={name} to={path} className="relative flex flex-col items-center gap-1 py-1.5 px-3 group">
                                {isActive && (
                                    <motion.div
                                        layoutId="waveIndicator"
                                        className="absolute -top-2 w-10 h-1 bg-[#FFCC00] rounded-full shadow-[0_4px_12px_rgba(255,204,0,0.5)]"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <div className={`relative grid h-9 w-9 place-items-center rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#FFCC00] text-gray-950 shadow-md -translate-y-1' : 'text-gray-400 hover:text-gray-700'}`}>
                                    <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                                </div>
                                <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-gray-950' : 'text-gray-400'}`}>{name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}