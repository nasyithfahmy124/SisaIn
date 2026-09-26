import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            
            <div className="block md:hidden">
                <MobileNavbar />
            </div>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}