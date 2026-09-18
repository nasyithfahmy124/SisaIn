import React from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Play,
    ScanLine,
    HardHat,
    CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease,
        },
    },
};

export default function HeroDesktop() {
    return (
        <div className="hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 py-16">
                <div className="flex items-center gap-12">

                    <HeroContent />

                    <HeroVisual />

                </div>
            </div>
        </div>
    );
}

function HeroContent() {
    return (
        <motion.div
            className="w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1
                variants={itemVariants}
                className="max-w-xl text-6xl font-extrabold leading-[1.05] tracking-tight text-gray-950"
            >
                Ubah Limbah Proyek Menjadi{" "}
                <span className="text-yellow-500">
                    Nilai Tambah.
                </span>
            </motion.h1>

            <motion.p
                variants={itemVariants}
                className="mt-7 max-w-xl text-lg leading-8 text-gray-500"
            >
                Jangan buang sisa material bangunan Anda. Cukup
                foto tumpukan limbah seperti keramik, kayu, dan bata.
                AI kami akan mendeteksi jenisnya dan menghubungkan
                Anda dengan mereka yang membutuhkan di sekitar Anda.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="mt-8 flex items-center gap-5"
            >
                <Link
                    to="/redistribusi"
                    className="group inline-flex items-center gap-3 rounded-full bg-yellow-500 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-yellow-500/20 transition hover:-translate-y-0.5 hover:bg-yellow-600"
                >
                    Mulai Sekarang
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                    href="#how-it-works"
                    className="group inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-yellow-600"
                >
                    Lihat cara kerja
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mt-12 border-t border-gray-100 pt-8"
            >
                <p className="mb-5 text-sm font-medium text-gray-400">
                    Mendukung ekosistem sirkular
                </p>

                <div className="flex items-center gap-7 text-xl font-bold text-gray-500">
                    <span className="flex items-center gap-2">
                        <HardHat className="h-5 w-5" />
                        EcoBuild
                    </span>

                    <span>RecycleIndo</span>
                    <span>MaterialHub</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

function HeroVisual() {
    return (
        <motion.div
            className="relative w-1/2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease }}
        >
            <div className="grid grid-cols-2 gap-4">

                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-yellow-500 p-6 text-white shadow-xl">
                    <div className="relative z-10">
                        <div className="mb-5 flex -space-x-2">
                            <img
                                className="h-10 w-10 rounded-full border-2 border-yellow-500 object-cover"
                                src="https://images.unsplash.com/photo-1504307651254-35680f356fce?auto=format&fit=crop&w=100&q=80"
                                alt="Kontraktor"
                            />

                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-500 bg-white text-xs font-bold text-yellow-500">
                                +
                            </div>
                        </div>

                        <h2 className="text-4xl font-extrabold">
                            45 Ton+
                        </h2>

                        <p className="mt-1 max-w-[180px] text-sm leading-tight">
                            Material proyek terselamatkan bulan ini
                        </p>
                    </div>

                    <HardHat className="absolute -bottom-5 -right-5 h-32 w-32 opacity-20" />
                </div>

                <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
                        alt="Material konstruksi"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-5">
                        <span className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                            <ScanLine className="h-4 w-4" />
                            Analisis Material
                        </span>
                    </div>
                </div>

                <div className="col-span-2 h-56 overflow-hidden rounded-[2rem] shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
                        alt="Proyek bangunan"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            <div className="absolute -right-5 top-[10%] z-20 flex items-center gap-3 rounded-2xl bg-gray-900 p-3 pr-5 text-white shadow-xl">
                <div className="rounded-xl bg-green-500/20 p-2">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">
                        Hasil AI SISAIN
                    </p>

                    <p className="text-sm font-bold">
                        Terdeteksi: 150 Bata Utuh
                    </p>
                </div>
            </div>

            <button className="absolute left-1/2 top-[45%] z-30 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-white shadow-2xl">
                <Play className="ml-1 h-8 w-8 fill-white" />
            </button>
        </motion.div>
    );
}