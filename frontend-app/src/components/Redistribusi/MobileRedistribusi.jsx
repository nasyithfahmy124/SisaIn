import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Plus, ShieldCheck, Building2, Coins, 
    ArrowRight, MapPin, CheckCircle2, Box, Loader2
} from 'lucide-react';
import { aiRedistribusiApi } from '../../api/aiRedistribusiApi';

export default function RedistribusiMobile() {
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            setIsLoading(true);
            try {
                const data = await aiRedistribusiApi.getMyMaterials();
                setMaterials(data || []);
            } catch (err) {
                console.error("Gagal memuat material:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    const projects = [
        {
            id: 1,
            title: "Perbaikan Jalan Gang RT 03/RW 05",
            location: "Candisari, Semarang",
            desc: "Kebutuhan Semen & Pasir",
            progress: 78,
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400"
        }
    ];

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-28 font-sans">
            
            <div className="px-4 pt-4">
                <div className="bg-[#FFCC00] rounded-[32px] p-6 relative overflow-hidden shadow-sm">
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
                            <Link to="/maps" className="bg-white text-gray-900 text-xs font-bold py-3 px-5 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-sm">
                                Peta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

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

            <div className="mt-8">
                <div className="px-4 flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-gray-900">Material Saya</h2>
                        <span className="bg-yellow-100 text-yellow-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                            {materials.length} Unit
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="mx-4 bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                        <span className="text-xs font-bold text-gray-500">Memuat material...</span>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="mx-4 bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-2">Belum ada material.</p>
                        <Link to="/redistribusi/material/new" className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700">
                            <Plus className="w-3.5 h-3.5" /> Tambah Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar">
                        {materials.map((mat) => (
                            <div key={mat.id} className="min-w-[240px] w-[240px] snap-start bg-white rounded-3xl p-3 shadow-sm border border-gray-100">
                                <div className="relative h-28 rounded-2xl overflow-hidden mb-3 bg-gray-100">
                                    <img src={mat.image || "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=300"} alt={mat.nama_material} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-gray-900 text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> {mat.tersedia ? 'Tersedia' : 'Disalurkan'}
                                    </div>
                                </div>
                                <h3 className="text-[13px] font-black text-gray-900 mb-0.5 truncate">{mat.nama_material}</h3>
                                <p className="text-[10px] text-gray-500 mb-4 truncate">{mat.bobot ? `${mat.bobot} Kg` : mat.kategori}</p>
                                
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-[9px] font-bold text-gray-600 truncate">{mat.alamat || 'Semarang'}</span>
                                    <span className="text-[9px] font-black text-gray-900">{mat.tersedia ? 'Aktif' : 'Selesai'}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${mat.tersedia ? 'bg-[#FFCC00]' : 'bg-emerald-600'}`} style={{ width: mat.tersedia ? '50%' : '100%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="px-4 mt-4">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-base font-black text-gray-900">Proyek Sedang Dibantu</h2>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full">1 Aktif</span>
                </div>

                <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative h-44">
                        <img src={projects[0].image} alt="Proyek" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
                        
                        <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                            URGENT FASUM
                        </div>
                        
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="text-base font-black leading-tight mb-1">{projects[0].title}</h3>
                            <p className="text-[10px] font-medium opacity-90 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {projects[0].location}
                            </p>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between text-[10px] font-bold mb-2">
                            <span className="text-gray-600">Kebutuhan Semen & Pasir</span>
                            <span className="text-emerald-600">{projects[0].progress}% Terpenuhi</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${projects[0].progress}%` }}></div>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Box className="w-4 h-4 text-yellow-700" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-semibold mb-0.5">Status Redistribusi</p>
                                    <p className="text-[11px] font-black text-gray-900">Terhubung ke Fasum Warga</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                </div>
            </div>

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