import React from 'react';
import { motion } from 'framer-motion';
import { Camera, BrainCircuit, Truck, HeartHandshake } from 'lucide-react';
import HeroSection from '../components/Hero/HeroSection';
import StudiKasus from '../components/StudiKasus';
import ValuePillars from '../components/ValuePillars/ValuePillars';
import TrustedPartners from '../components/TrustedPartners';
import HowItWorks from '../components/HowItWorks';

export default function Beranda() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col w-full"
        >
            <HeroSection />
            <StudiKasus />
            <ValuePillars />
            <TrustedPartners />
            <HowItWorks />

        </motion.div>
    );
}

// Komponen kecil untuk Kartu Langkah (StepCard) agar kode lebih rapi
function StepCard({ number, icon, title, desc }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-yellow-100 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute -top-4 -right-2 text-8xl font-black text-gray-50 opacity-50 group-hover:text-yellow-50 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                {number}
            </div>

            {/* Konten */}
            <div className="relative z-10">
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    );
}