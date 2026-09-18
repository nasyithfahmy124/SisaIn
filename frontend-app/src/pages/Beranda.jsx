import React from 'react';
import { motion } from 'framer-motion';
import { Camera, BrainCircuit, Truck, HeartHandshake } from 'lucide-react';
import HeroSection from '../components/Hero/HeroSection';
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
            <ValuePillars />
            <TrustedPartners />
            <HowItWorks />

            {/* 3. SECTION CALL TO ACTION Bawah */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Siap untuk membuat dampak nyata hari ini?
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Bergabunglah dengan ribuan donatur lainnya. Sisa makanan Anda adalah berkah bagi mereka yang lapar.
                    </p>
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl">
                        Daftar Sebagai Donatur
                    </button>
                </div>
            </section>

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