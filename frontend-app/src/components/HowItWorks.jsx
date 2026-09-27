import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, BrainCircuit, Truck, Recycle } from 'lucide-react';
import appImage from '../assets/img/app.png';

const STEPS = [
    {
        id: '01',
        title: 'Foto & Upload Material',
        description: 'Ambil foto sisa material di lokasi proyek Anda. Masukkan sedikit deskripsi mengenai jumlah dan kondisinya.',
        icon: <Camera className="w-5 h-5" />,
    },
    {
        id: '02',
        title: 'Analisis AI Instan',
        description: 'Sistem cerdas Sisain akan menganalisis foto untuk mendeteksi jenis material dan memperkirakan nilainya.',
        icon: <BrainCircuit className="w-5 h-5" />,
    },
    {
        id: '03',
        title: 'Matching & Penjemputan',
        description: 'Aplikasi otomatis menghubungkan Anda dengan pengepul terdekat yang akan menjemput material tersebut.',
        icon: <Truck className="w-5 h-5" />,
    },
    {
        id: '04',
        title: 'Proyek Sosial & Reward',
        description: 'Limbah dimanfaatkan kembali. Anda mendapatkan insentif finansial dan laporan dampak lingkungan.',
        icon: <Recycle className="w-5 h-5" />,
    },
];

const animations = {
    container: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } },
    },
    fadeUp: {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    },
    float: {
        animate: {
            y: [0, -15, 0],
            transition: { duration: 4, ease: 'easeInOut', repeat: Infinity },
        },
    },
};

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 overflow-hidden bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-gray-900 mb-6">
                        Biarkan sisa proyek Anda <br />
                        <span className="text-yellow-500">bekerja untuk Anda</span>
                    </h2>

                    <p className="max-w-xl text-lg font-medium leading-relaxed text-gray-500">
                        Pengalaman manajemen limbah konstruksi kami menggabungkan kemudahan teknologi AI dengan jaringan daur ulang yang andal. Hanya butuh 4 langkah.
                    </p>
                </div>

                <motion.div
                    className="relative grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-8"
                    variants={animations.container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <div className="order-2 flex flex-col gap-12 lg:order-1 lg:gap-24">
                        <StepItem step={STEPS[0]} />
                        <StepItem step={STEPS[2]} />
                    </div>

                    <motion.div
                        className="relative order-1 flex items-center justify-center lg:order-2"
                        variants={animations.fadeUp}
                    >
                        <div className="absolute w-64 h-64 bg-yellow-400/20 blur-[90px] rounded-full md:w-80 md:h-80" />

                        <motion.div
                            className="relative z-10 flex items-center justify-center"
                            variants={animations.float}
                            animate="animate"
                        >
                            <img
                                src={appImage}
                                alt="Sisain App Process"
                                width="560"
                                height="700"
                                loading="eager"
                                decoding="async"
                                draggable="false"
                                className="block w-auto h-auto max-w-[260px] md:max-w-sm rounded-[2.5rem] border-4 border-white object-contain shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>

                    <div className="order-3 flex flex-col gap-12 pt-0 lg:gap-24 lg:pt-16">
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
        <motion.div variants={animations.fadeUp} className="relative group">
            <div className="flex flex-col mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-black tracking-widest text-yellow-500">STEP {step.id}</span>
                    <span className="flex items-center justify-center w-7 h-7 text-yellow-600 bg-yellow-50 rounded-lg">{step.icon}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-yellow-600">
                    {step.title}
                </h3>
            </div>

            <p className="text-sm md:text-base font-medium leading-relaxed text-gray-500 mb-6">
                {step.description}
            </p>

            <button
                type="button"
                aria-label={`Lihat detail ${step.title}`}
                className="flex items-center justify-center w-10 h-10 text-white bg-yellow-500 rounded-xl shadow-md shadow-yellow-500/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-yellow-600 group-hover:shadow-lg"
            >
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </button>
        </motion.div>
    );
}