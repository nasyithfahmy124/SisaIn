import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Plus, Activity, ShieldCheck, Building2, Coins, 
    ArrowRight, MapPin, CheckCircle2, Box, ArrowUpRight
} from 'lucide-react';
import { redistribusiData } from '../../data/redistribusiData';

export default function RedistribusiMobile() {
    const { impact, materials, projects } = redistribusiData;

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-28 font-sans">
            
            {/* HERO SECTION */}
            <div className="px-4 pt-4">
                <div className="bg-[#FFCC00] rounded-[32px] p-6 relative overflow-hidden shadow-sm">
                    {/* Background Element (Optional Pattern) */}
                    <div className="absolute -right-6 -top-6 w-32 h-32 border-[20px] border-yellow-400/30 rounded-full"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 mb-4 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span className="text-[9px] font-bold text-gray-800 tracking-wide">Sirkulasi Material Surplus</span>
                        </div>
                        
                        <h1 className="text-[22px] font-black text-gray-900 leading-tight mb-3">
                            Material sisa proyekmu bisa berguna kembali.
                        </h1>
                        <p className="text-[11px] font-medium text-gray-800/80 leading-relaxed mb-6 max-w-[90%]">
                            Sisain menganalisis surplus konstruksi dan menghubungkannya langsung ke kebutuhan fasum warga sekitar.
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <Link to="/redistribusi/material/new" className="flex-1 bg-gray-900 text-white text-xs font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md">
                                <Plus className="w-4 h-4 text-yellow-400" /> Tambah Material
                            </Link>
                            <button className="bg-white text-gray-900 text-xs font-bold py-3 px-5 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-sm">
                                Aktivitas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS PILLS */}
            <div className="px-4 mt-4 flex gap-2 overflow-x-auto hide-scrollbar">
                <div className="flex-1 min-w-[100px] bg-white rounded-2xl py-3 px-2 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-black text-gray-900 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 185 <span className="text-[10px] text-gray-500">Kg</span>
                    </h4>
                    <p className="text-[9px] font-bold text-gray-500 mt-0.5">Material Bebas</p>
                </div>
                <div className="flex-1 min-w-[100px] bg-white rounded-2xl py-3 px-2 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-black text-gray-900 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-yellow-600" /> 3
                    </h4>
                    <p className="text-[9px] font-bold text-gray-500 mt-0.5">Proyek Fasum</p>
                </div>
                <div className="flex-1 min-w-[100px] bg-white rounded-2xl py-3 px-2 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-black text-gray-900 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-yellow-600" /> 320
                    </h4>
                    <p className="text-[9px] font-bold text-gray-500 mt-0.5">Koin Sisain</p>
                </div>
            </div>

            {/* MATERIAL SAYA (HORIZONTAL SCROLL) */}
            <div className="mt-8">
                <div className="px-4 flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-gray-900">Material Saya</h2>
                        <span className="bg-yellow-100 text-yellow-800 text-[9px] font-black px-2 py-0.5 rounded-full">3 Unit</span>
                    </div>
                    <Link to="/redistribusi/material" className="text-[11px] font-bold text-gray-600 flex items-center gap-0.5 hover:text-gray-900">
                        Lihat Semua <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar">
                    {/* Item 1 */}
                    <div className="min-w-[240px] w-[240px] snap-start bg-white rounded-3xl p-3 shadow-sm border border-gray-100">
                        <div className="relative h-28 rounded-2xl overflow-hidden mb-3">
                            <img src="/src/assets/img/semen-placeholder.jpg" alt="Semen" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-gray-900 text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Tercocokkan
                            </div>
                        </div>
                        <h3 className="text-[13px] font-black text-gray-900 mb-0.5 truncate">Semen Portland PCC</h3>
                        <p className="text-[10px] text-gray-500 mb-4 truncate">4 Sak (160 Kg)</p>
                        
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] font-bold text-gray-600 truncate">Musala Al-Ikhlas</span>
                            <span className="text-[9px] font-black text-gray-900">80%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-[#FFCC00] h-1.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="min-w-[240px] w-[240px] snap-start bg-white rounded-3xl p-3 shadow-sm border border-gray-100">
                        <div className="relative h-28 rounded-2xl overflow-hidden mb-3">
                            <img src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=300" alt="Kayu" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-gray-900 text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <Box className="w-3 h-3 text-emerald-600" /> Dijemput
                            </div>
                        </div>
                        <h3 className="text-[13px] font-black text-gray-900 mb-0.5 truncate">Kayu Kaso Bekas</h3>
                        <p className="text-[10px] text-gray-500 mb-4 truncate">12 Btg (3.8m)</p>
                        
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] font-bold text-gray-600 truncate">Panitia Pos RW 02</span>
                            <span className="text-[9px] font-black text-gray-900">100%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROYEK SEDANG DIBANTU */}
            <div className="px-4 mt-4">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-base font-black text-gray-900">Proyek Sedang Dibantu</h2>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full">1 Aktif</span>
                </div>

                <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Image */}
                    <div className="relative h-44">
                        <img src={projects[0]?.image || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400"} alt="Proyek" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
                        
                        <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 border border-white rounded-full bg-transparent flex items-center justify-center">!</span> URGENT FASUM
                        </div>
                        
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="text-base font-black leading-tight mb-1">{projects[0]?.title || "Perbaikan Jalan Gang RT 03/RW 05"}</h3>
                            <p className="text-[10px] font-medium opacity-90 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Candisari, Semarang • 0.7 km dari lokasimu
                            </p>
                        </div>
                    </div>

                    {/* Progress Info */}
                    <div className="p-4">
                        <div className="flex justify-between text-[10px] font-bold mb-2">
                            <span className="text-gray-600">Kebutuhan Semen & Pasir</span>
                            <span className="text-emerald-600">78% Terpenuhi</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Box className="w-4 h-4 text-yellow-700" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-semibold mb-0.5">Kontribusi Material Anda</p>
                                    <p className="text-[11px] font-black text-gray-900">4 Sak Semen Portland</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>

                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95">
                            Pantau Progress Lapangan <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM CTA */}
            <div className="px-4 mt-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FFCC00]/20 rounded-full flex items-center justify-center shrink-0">
                            <Box className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-gray-900 mb-0.5">Ada sisa renovasi di rumah?</h4>
                            <p className="text-[9px] text-gray-500 font-medium">Foto & kirim ke fasum terdekat.</p>
                        </div>
                    </div>
                    <Link to="/redistribusi/material/new" className="bg-[#FFCC00] text-gray-900 text-[11px] font-bold px-4 py-2.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Tambah
                    </Link>
                </div>
            </div>

        </div>
    );
}