import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ScanLine, HardHat, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    const ease = [0.22, 1, 0.36, 1];

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.9, x: 20 },
        visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="relative bg-white pt-12 pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

                    <motion.div
                        className="w-full lg:w-1/2 flex flex-col justify-center"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-6"
                        >
                            Ubah Limbah Proyek Menjadi <span className="text-yellow-500">Nilai Tambah.</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed"
                        >
                            Jangan buang sisa material bangunan Anda. Cukup foto tumpukan limbah (keramik, kayu, bata), AI kami akan mendeteksi jenisnya dan menghubungkan Anda dengan mereka yang membutuhkan di sekitar Anda..
                        </motion.p>

                        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-5">
                            <a href="#mulai" className="group inline-flex items-center gap-3 rounded-full bg-[#D4A017] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#D4A017]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#bd8f0e]">
                                Mulai Sekarang
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </a>

                            <a href="#how-it-works" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1D4D3A]">
                                Lihat cara kerja
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-8 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-400 mb-4">Mendukung ekosistem sirkular</p>
                            <div className="flex items-center gap-6 opacity-60 grayscale">
                                <div className="font-bold text-xl flex items-center gap-1"><HardHat className="w-5 h-5" /> EcoBuild</div>
                                <div className="font-bold text-xl flex items-center gap-1">RecycleIndo</div>
                                <div className="font-bold text-xl flex items-center gap-1">MaterialHub</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div className="w-full lg:w-1/2 relative" variants={containerVariants} initial="hidden" animate="visible" >
                        <div className="grid grid-cols-2 gap-4 relative">

                            <motion.div variants={imageVariants} className="bg-yellow-500 rounded-[2rem] p-6 text-white flex flex-col justify-between aspect-square shadow-xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex -space-x-2 mb-4">
                                        <img className="w-10 h-10 rounded-full border-2 border-yellow-500 object-cover" src="https://images.unsplash.com/photo-1504307651254-35680f356fce?auto=format&fit=crop&w=100&q=80" alt="Kontraktor 1" />
                                        <img className="w-10 h-10 rounded-full border-2 border-yellow-500 object-cover" src="https://images.unsplash.com/photo-1541888081622-ec986b208920?auto=format&fit=crop&w=100&q=80" alt="Kontraktor 2" />
                                        <div className="w-10 h-10 rounded-full border-2 border-yellow-500 bg-white text-yellow-500 flex items-center justify-center text-xs font-bold">+</div>
                                    </div>
                                    <h3 className="text-4xl font-extrabold mb-1">45 Ton+</h3>
                                    <p className="text-yellow-50 text-sm font-medium leading-tight">Material proyek terselamatkan bulan ini</p>
                                </div>
                                <HardHat className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-20 transform group-hover:scale-110 transition-transform duration-500" />
                            </motion.div>
                            <motion.div variants={imageVariants} className="rounded-[2rem] overflow-hidden aspect-square shadow-lg relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
                                    alt="Material Konstruksi"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5">
                                        <ScanLine className="w-3.5 h-3.5" /> Analisis Material...
                                    </span>
                                </div>
                            </motion.div>
                            <motion.div variants={imageVariants} className="col-span-2 rounded-[2rem] overflow-hidden h-48 sm:h-56 shadow-lg relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
                                    alt="Proyek Bangunan"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, type: 'spring' }} className="absolute top-[10%] -right-4 md:-right-8 bg-gray-900 text-white p-3 pr-5 rounded-2xl shadow-xl flex items-center gap-3 z-20">
                                <div className="bg-green-500/20 p-2 rounded-xl">
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Hasil AI Sisain</p>
                                    <p className="text-sm font-bold">Terdeteksi: 150 Bata Utuh</p>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, type: 'spring' }} className="absolute top-[45%] -left-6 md:-left-10 bg-white border border-gray-100 p-3 pr-5 rounded-2xl shadow-xl flex items-center gap-3 z-20">
                                <div className="bg-yellow-100 p-2 rounded-xl">
                                    <ArrowRight className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Match Speed</p>
                                    <p className="text-sm font-bold text-gray-900">Pengepul Ditemukan!</p>
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.1 }} className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-900 rounded-full text-white flex items-center justify-center shadow-2xl cursor-pointer z-30 border-4 border-white">
                                <Play className="w-8 h-8 fill-white ml-1" />
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}