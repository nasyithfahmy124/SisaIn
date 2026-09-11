import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, BrainCircuit, Truck, Recycle } from 'lucide-react';

const STEPS = [
    {
        id: "01",
        title: "Foto & Upload Material",
        description: "Ambil foto sisa material di lokasi proyek Anda. Masukkan sedikit deskripsi mengenai jumlah dan kondisinya.",
        icon: <Camera className="w-5 h-5" />
    },
    {
        id: "02",
        title: "Analisis AI Instan",
        description: "Sistem cerdas Sisain akan menganalisis foto untuk mendeteksi jenis material dan memperkirakan nilainya.",
        icon: <BrainCircuit className="w-5 h-5" />
    },
    {
        id: "03",
        title: "Matching & Penjemputan",
        description: "Aplikasi otomatis menghubungkan Anda dengan pengepul terdekat yang akan menjemput material tersebut.",
        icon: <Truck className="w-5 h-5" />
    },
    {
        id: "04",
        title: "Proyek Sosial & Reward",
        description: "Limbah dimanfaatkan kembali. Anda mendapatkan insentif finansial dan laporan dampak lingkungan.",
        icon: <Recycle className="w-5 h-5" />
    }
];

const animations = {
    container: {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    },
    fadeUp: {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    },
    float: {
        animate: {
            y: [0, -15, 0],
            transition: { duration: 4, ease: "easeInOut", repeat: Infinity }
        }
    }
};

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-white overflow-hidden border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="max-w-2xl mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.15] tracking-tight">
                        Biarkan sisa proyek Anda <br />
                        <span className="text-yellow-500">bekerja untuk Anda</span>
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
                        Pengalaman manajemen limbah konstruksi kami menggabungkan kemudahan teknologi AI dengan jaringan daur ulang yang andal. Hanya butuh 4 langkah.
                    </p>
                </div>

                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center relative"
                    variants={animations.container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="flex flex-col gap-12 lg:gap-24 order-2 lg:order-1">
                        <StepItem step={STEPS[0]} />
                        <StepItem step={STEPS[2]} />
                    </div>

                    <motion.div 
                        className="flex justify-center order-1 lg:order-2 relative"
                        variants={animations.fadeUp}
                    >
                        <div className="absolute inset-0 bg-yellow-400/20 blur-[100px] rounded-full"></div>
                        
                        <motion.img 
                            variants={animations.float}
                            animate="animate"
                            src="src/assets/img/app.png" 
                            alt="Sisain App Process" 
                            className="relative z-10 w-full max-w-[280px] md:max-w-sm rounded-[2.5rem] shadow-2xl border-4 border-white object-cover aspect-[4/5]"
                        />
                    </motion.div>

                    <div className="flex flex-col gap-12 lg:gap-24 order-3 lg:order-3 pt-0 lg:pt-16">
                        <StepItem step={STEPS[1]} />
                        <StepItem step={STEPS[3]} />
                    </div>

                </motion.div>

            </div>
        </section>
    );
}

function StepItem({ step }) {
    return (
        <motion.div  variants={animations.fadeUp} className="group relative">
            <div className="flex flex-col mb-3">
                <span className="text-yellow-500 font-black text-sm mb-2 tracking-widest">
                    STEP {step.id}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                    {step.title}
                </h3>
            </div>
            
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 font-medium">
                {step.description}
            </p>
            <button className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-xl shadow-md shadow-yellow-500/30 group-hover:bg-yellow-600 group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300">
                <ArrowRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </button>
        </motion.div>
    );
}