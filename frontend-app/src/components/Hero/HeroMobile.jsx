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

export default function HeroMobile() {
    return (
        <div className="block lg:hidden">
            <div className="px-5 pb-14 pt-8">

                <HeroMobileContent />

                <HeroMobileVisual />

            </div>
        </div>
    );
}

function HeroMobileContent() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
        >
            <motion.h1
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                className="text-[2.65rem] font-extrabold leading-[1.04] tracking-tight text-gray-950"
            >
                Ubah Limbah Proyek Menjadi{" "}
                <span className="text-yellow-500">
                    Nilai Tambah.
                </span>
            </motion.h1>

            <motion.p
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                className="mt-6 text-[1.05rem] leading-7 text-gray-500"
            >
                Jangan buang sisa material bangunan Anda. Cukup
                foto tumpukan limbah seperti keramik, kayu, dan bata.
                AI kami akan mendeteksi jenisnya dan menghubungkan
                Anda dengan mereka yang membutuhkan di sekitar Anda.
            </motion.p>

            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                className="mt-8 flex items-center gap-3"
            >
                <Link
                    to="/redistribusi"
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-yellow-500/20"
                >
                    Mulai Sekarang
                    <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-gray-600"
                >
                    Lihat cara kerja
                    <ArrowRight className="h-4 w-4" />
                </a>
            </motion.div>

            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                className="mt-8 border-t border-gray-100 pt-7"
            >
                <p className="mb-4 text-sm text-gray-400">
                    Mendukung ekosistem sirkular
                </p>

                <div className="flex gap-7 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <span className="flex shrink-0 items-center gap-1.5 text-lg font-bold text-gray-500">
                        <HardHat className="h-5 w-5" />
                        EcoBuild
                    </span>

                    <span className="shrink-0 text-lg font-bold text-gray-500">
                        RecycleIndo
                    </span>

                    <span className="shrink-0 text-lg font-bold text-gray-500">
                        MaterialHub
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}

function HeroMobileVisual() {
    return (
        <div className="relative mt-8">

            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none">

                <div className="relative h-[220px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[1.7rem] bg-yellow-500 p-5 text-white shadow-lg">
                    <p className="text-xs font-semibold uppercase tracking-wider text-yellow-100">
                        Material terselamatkan
                    </p>

                    <h2 className="mt-2 text-4xl font-extrabold">
                        45 Ton+
                    </h2>

                    <p className="mt-1 max-w-[190px] text-sm leading-5">
                        Material proyek terselamatkan bulan ini
                    </p>

                    <HardHat className="absolute -bottom-5 -right-5 h-28 w-28 opacity-20" />
                </div>

                <div className="relative h-[220px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[1.7rem] shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
                        alt="Material konstruksi"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-2 text-[11px] font-semibold text-white backdrop-blur-md">
                            <ScanLine className="h-3.5 w-3.5" />
                            Analisis Material
                        </span>

                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900">
                            <Play className="h-4 w-4 fill-current" />
                        </button>
                    </div>
                </div>

                <div className="relative h-[220px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[1.7rem] shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
                        alt="Proyek bangunan"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-5 left-5">
                        <p className="text-xs uppercase tracking-wider text-white/70">
                            SISAIN
                        </p>

                        <p className="mt-1 text-lg font-bold text-white">
                            Limbah jadi nilai.
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute right-2 top-[165px] z-20 flex max-w-[230px] items-center gap-2 rounded-xl bg-gray-900 p-2.5 text-white shadow-xl">
                <div className="rounded-lg bg-green-500/20 p-1.5">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>

                <div className="min-w-0">
                    <p className="text-[8px] font-bold uppercase text-gray-400">
                        Hasil AI SISAIN
                    </p>

                    <p className="truncate text-[11px] font-bold">
                        Terdeteksi: 150 Bata Utuh
                    </p>
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-1.5">
                <span className="h-1.5 w-5 rounded-full bg-yellow-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            </div>
        </div>
    );
}