import React from 'react';
import { motion } from 'framer-motion';
import { ScanSearch, MapPinned, Trophy } from 'lucide-react';

const PILLARS = [
    {
        id: "ai-valuasi",
        tagline: "SMART SCAN",
        title: "AI Valuasi Instan",
        description: "Deteksi jenis dan estimasi nilai material proyek dalam hitungan detik.",
        icon: ScanSearch,
        theme: {
            wrapper: "bg-yellow-100/80 hover:bg-yellow-100",
            textMain: "text-gray-900",
            textSub: "text-gray-600",
            tag: "text-yellow-600",
            iconColor: "text-yellow-500",
            iconBg: "bg-yellow-200/50"
        }
    },
    {
        id: "peta-realtime",
        tagline: "LIVE TRACKING",
        title: "Peta Real-Time",
        description: "Lacak pengepul atau proyek terdekat yang sedang butuh material.",
        icon: MapPinned,
        theme: {
            wrapper: "bg-gray-50 hover:bg-gray-100 border border-gray-100",
            textMain: "text-gray-900",
            textSub: "text-gray-500",
            tag: "text-gray-400",
            iconColor: "text-gray-400",
            iconBg: "bg-white"
        }
    },
    {
        id: "reward-tier",
        tagline: "GAMIFIED IMPACT",
        title: "Reward Tier",
        description: "Kumpulkan poin & raih status dari tiap ton limbah yang diselamatkan.",
        icon: Trophy,
        theme: {
            wrapper: "bg-gray-900 hover:bg-gray-800",
            textMain: "text-white",
            textSub: "text-gray-400",
            tag: "text-yellow-500",
            iconColor: "text-yellow-400",
            iconBg: "bg-gray-800"
        }
    }
];

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

export default function ValuePillars() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-16 md:max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Bangun lebih baik <br />
                        <span className="text-yellow-500">dengan Sisain</span>
                    </h2>
                </div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {PILLARS.map((pillar) => (
                        <PillarCard key={pillar.id} pillar={pillar} />
                    ))}
                </motion.div>

            </div>
        </section>
    );
}

function PillarCard({ pillar }) {
    const Icon = pillar.icon;
    const { theme } = pillar;

    return (
        <motion.div 
            variants={cardVariant}
            className={`group relative flex flex-col justify-between h-[320px] p-8 rounded-[2rem] transition-colors duration-500 overflow-hidden cursor-pointer ${theme.wrapper}`}
        >
            <div className="flex justify-between items-start w-full relative z-10">
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${theme.tag}`}>
                    {pillar.tagline}
                </span>

                <div className="relative">
                    <div className="absolute inset-0 bg-black/10 blur-xl rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transform transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-12 ${theme.iconBg}`}>
                        <Icon className={`w-8 h-8 ${theme.iconColor}`} strokeWidth={1.5} />
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-auto pt-10">
                <h3 className={`text-2xl font-bold mb-3 ${theme.textMain}`}>
                    {pillar.title}
                </h3>
                <p className={`text-sm leading-relaxed font-medium max-w-[90%] ${theme.textSub}`}>
                    {pillar.description}
                </p>
            </div>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none"></div>
        </motion.div>
    );
}