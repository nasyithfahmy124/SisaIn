import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Zap, Navigation, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DetailKebutuhanMobile() {
    const navigate = useNavigate();

    const detailData = {
        title: "Perbaikan Jalan Gang RT 03",
        location: "0.7 km • dari lokasi material • Candisari, Semarang",
        verified: "Terverifikasi RW 05",
        urgent: "URGENT FASUM",
        image: "https://images.unsplash.com/photo-1584467735811-628d014f1632?auto=format&fit=crop&q=80&w=600",
        timestamp: "Kemarin, 16:30",
        matchPercentage: "98%",
        userMaterial: "160 kg",
        userMaterialDesc: "Semen (4 Sak PCC)",
        projectNeed: "120 kg",
        projectNeedDesc: "Semen (3 Sak)",
        analysisText: "Material kamu sesuai dengan kebutuhan proyek ini. Kebutuhan 120 kg terpenuhi, sisa 40 kg dialihkan ke fasum sekitar RT 04.",
        projectName: "Perbaikan jalan lingkungan",
        projectDesc: "Pengecoran dan penambalan jalan lorong gang warga yang amblas agar bebas genangan air untuk lansia dan anak sekolah.",
        beneficiaries: "Penerima: 42 KK",
        benefitType: "Bebas Genangan",
        routeDistance: "0.7 km • 4 mnt",
        materialAddress: "Jl. Pandanaran No. 82",
        destinationAddress: "Gang RT 03 Candisari",
        validationText: "Permintaan diverifikasi oleh admin SISAIN berkoordinasi langsung dengan pengurus RT/RW setempat."
    };

    const handleSalurkan = () => {
        alert("Berhasil! Material disalurkan ke proyek ini.");
        navigate('/redistribusi');
    };

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-32 font-sans text-gray-900">
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-bold text-gray-800 hover:text-gray-900">
                    <ChevronLeft className="w-5 h-5" /> Kembali
                </button>
                <h2 className="text-xs font-black text-gray-900">Detail Kebutuhan</h2>
                <div className="w-6"></div>
            </div>

            <div className="px-4 pt-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {detailData.verified}
                    </span>
                    <span className="bg-yellow-100 text-yellow-900 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {detailData.urgent}
                    </span>
                </div>

                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-tight">{detailData.title}</h1>
                    <p className="text-[10px] font-medium text-gray-500 mt-1 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-yellow-600" /> {detailData.location}
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-2">
                        <img src={detailData.image} alt={detailData.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            Dokumentasi Survei Lapangan
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-lg">
                            {detailData.timestamp}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xs font-black text-gray-900">Kecocokan Material</h3>
                            <p className="text-[10px] text-gray-400">Analisis stok vs kebutuhan lapangan</p>
                        </div>
                        <span className="bg-[#FFCC00] text-gray-950 font-black text-xs px-3 py-1.5 rounded-full shadow-sm">
                            {detailData.matchPercentage} Cocok
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Material Kamu</p>
                            <h4 className="text-base font-black text-gray-900 mt-0.5">{detailData.userMaterial}</h4>
                            <p className="text-[10px] text-gray-600">{detailData.userMaterialDesc}</p>
                            <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-md">
                                Tersedia & Siap
                            </span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Kebutuhan Proyek</p>
                            <h4 className="text-base font-black text-gray-900 mt-0.5">{detailData.projectNeed}</h4>
                            <p className="text-[10px] text-gray-600">{detailData.projectNeedDesc}</p>
                            <span className="inline-block mt-2 bg-yellow-50 text-yellow-800 text-[9px] font-bold px-2 py-0.5 rounded-md">
                                Target Pengecoran
                            </span>
                        </div>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-[11px] font-medium text-emerald-900 leading-relaxed flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>{detailData.analysisText}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-2">
                    <p className="text-[9px] font-black text-gray-400 tracking-wider uppercase">Material Akan Digunakan Untuk</p>
                    <h3 className="text-sm font-black text-gray-900">{detailData.projectName}</h3>
                    <p className="text-[11px] font-medium text-gray-600 leading-relaxed">{detailData.projectDesc}</p>
                    <div className="flex gap-2 pt-2">
                        <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2.5 py-1 rounded-lg">👥 {detailData.beneficiaries}</span>
                        <span className="bg-red-50 text-red-700 text-[9px] font-bold px-2.5 py-1 rounded-lg">💧 {detailData.benefitType}</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-gray-900">Estimasi Rute Penyaluran</h3>
                        <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-lg">{detailData.routeDistance}</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-3 space-y-2 border border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">A</span>
                            <div>
                                <p className="text-[9px] text-gray-400 font-bold">LOKASI MATERIAL</p>
                                <p className="text-xs font-black text-gray-900">{detailData.materialAddress}</p>
                            </div>
                        </div>
                        <div className="ml-2.5 border-l-2 border-dashed border-gray-300 h-4"></div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">B</span>
                            <div>
                                <p className="text-[9px] text-gray-400 font-bold">TUJUAN PROYEK</p>
                                <p className="text-xs font-black text-gray-900">{detailData.destinationAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-gray-900">Validasi Komunitas Terverifikasi</h4>
                        <p className="text-[10px] font-medium text-gray-500 leading-relaxed">{detailData.validationText}</p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
                <p className="text-[9px] font-bold text-center text-gray-400 mb-2">
                    ✓ Tahap selanjutnya: Konfirmasi Pickup / Kirim
                </p>
                <button 
                    onClick={handleSalurkan}
                    className="w-full bg-[#FFCC00] hover:bg-yellow-400 text-gray-950 font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform mb-2"
                >
                    <span>Salurkan ke Proyek Ini</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => navigate(-1)}
                    className="w-full text-center text-[10px] font-bold text-gray-500 hover:text-gray-800 py-1"
                >
                    Kembali ke Matching
                </button>
            </div>
        </div>
    );
}