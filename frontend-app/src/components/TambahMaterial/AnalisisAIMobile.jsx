import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Check, RotateCcw, ArrowRight, Zap, 
    Leaf, MapPin, AlertCircle, ShieldCheck
} from 'lucide-react';

export default function AnalisisAIMobile({ imagePayload, onBack, onNext }) {
    const [progress, setProgress] = useState(0);
    const [scanPosition, setScanPosition] = useState(0);
    const [scanDirection, setScanDirection] = useState('down');

    // Animasi Progress & Scanner (Simulasi ~2.4 detik)
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        const scanInterval = setInterval(() => {
            setScanPosition((prev) => {
                if (scanDirection === 'down') {
                    if (prev >= 90) setScanDirection('up');
                    return prev + 2;
                } else {
                    if (prev <= 10) setScanDirection('down');
                    return prev - 2;
                }
            });
        }, 30);

        return () => {
            clearInterval(progressInterval);
            clearInterval(scanInterval);
        };
    }, [scanDirection]);

    const isComplete = progress === 100;

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans pb-32">
            
            {/* Top Bar & Mini Progress */}
            <div className="bg-white sticky top-0 z-30 px-4 pt-6 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-bold">Kembali</span>
                    </button>
                </div>
                
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">Analisis Material Ai</h1>
                    <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#FFCC00] h-1.5 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Stepper Horizontal */}
            <div className="px-4 py-4">
                <div className="flex items-center gap-2 bg-white rounded-full py-1.5 px-1.5 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar">
                    <div className="flex shrink-0 items-center gap-1.5 text-gray-400 px-3 py-1.5">
                        <Check className="w-3 h-3" />
                        <span className="text-[10px] font-bold">01 Foto</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 bg-[#FFCC00] px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                        <span className="text-[10px] font-black text-gray-900">02 Analisis</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-gray-400 px-3 py-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-bold">03 Konfirm</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-gray-400 px-3 py-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-bold">04 Kirim</span>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-4">
                
                {/* Visual AI Frame */}
                <div>
                    <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                        <img 
                            src={imagePayload?.url || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600"} 
                            alt="Proses Analisis" 
                            className={`w-full h-full object-cover transition-all duration-700 ${isComplete ? 'scale-100 opacity-100' : 'scale-105 opacity-90'}`}
                        />

                        {/* Scanner Line */}
                        {!isComplete && (
                            <div 
                                className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent to-[#FFCC00]/50 border-b-[3px] border-[#FFCC00] z-10 pointer-events-none"
                                style={{ top: `${scanPosition}%`, transition: 'top 0.1s linear' }}
                            ></div>
                        )}

                        {/* Frame Corners (Yellow) */}
                        <div className="absolute top-3 left-3 w-6 h-6 border-t-[3px] border-l-[3px] border-[#FFCC00] rounded-tl-lg pointer-events-none"></div>
                        <div className="absolute top-3 right-3 w-6 h-6 border-t-[3px] border-r-[3px] border-[#FFCC00] rounded-tr-lg pointer-events-none"></div>
                        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-[3px] border-l-[3px] border-[#FFCC00] rounded-bl-lg pointer-events-none"></div>
                        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-[3px] border-r-[3px] border-[#FFCC00] rounded-br-lg pointer-events-none"></div>

                        {/* Overlay Tags Progressive */}
                        <div className={`absolute top-5 left-5 transition-opacity duration-500 ${progress > 25 ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-white/95 backdrop-blur text-gray-900 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Check className="w-3 h-3 text-emerald-600" /> Semen PCC Portland
                            </div>
                        </div>

                        <div className={`absolute top-5 right-5 transition-opacity duration-500 ${progress > 50 ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-white/95 backdrop-blur text-gray-900 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Check className="w-3 h-3 text-emerald-600" /> Utuh 96%
                            </div>
                        </div>

                        <div className={`absolute bottom-5 left-5 transition-opacity duration-500 ${progress > 75 ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-[#FFCC00]/95 backdrop-blur text-gray-900 text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-yellow-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-900"></span> ~160 kg (4 Sak)
                            </div>
                        </div>

                        <div className={`absolute bottom-5 right-5 transition-opacity duration-500 ${isComplete ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-emerald-100/95 backdrop-blur text-emerald-800 text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-emerald-300">
                                <Zap className="w-3 h-3 text-emerald-600" /> Prioritas Tinggi
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 px-1">
                        <p className="text-[8px] font-bold text-gray-500 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#FFCC00]" /> CV v3.4-ID • Kalibrasi Sak 40kg
                        </p>
                        <span className="bg-gray-100 text-gray-600 text-[8px] font-bold px-2 py-0.5 rounded border border-gray-200">
                            SNI 7064 Terverifikasi
                        </span>
                    </div>
                </div>

                {/* Checklist Pemeriksaan Material */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-black text-gray-900">Pemeriksaan Material</h3>
                        <span className={`text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${isComplete ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                            {!isComplete && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
                            {isComplete ? 'Selesai' : 'Aktif'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            {progress > 25 ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check className="w-3 h-3"/></div>
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0"></div>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className={`text-[11px] font-black ${progress > 25 ? 'text-gray-900' : 'text-gray-400'}`}>Mengenali Jenis Material</h4>
                                    {progress > 25 && <span className="text-[8px] text-emerald-600 font-bold">Selesai</span>}
                                </div>
                                <p className={`text-[9px] ${progress > 25 ? 'text-gray-500' : 'text-gray-400'}`}>Semen PCC (Portland Composite) teridentifikasi jelas dari kemasan sak.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {progress > 50 ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check className="w-3 h-3"/></div>
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0"></div>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className={`text-[11px] font-black ${progress > 50 ? 'text-gray-900' : 'text-gray-400'}`}>Memeriksa Kondisi Fisik</h4>
                                    {progress > 50 && <span className="text-[8px] text-emerald-600 font-bold">Kering</span>}
                                </div>
                                <p className={`text-[9px] ${progress > 50 ? 'text-gray-500' : 'text-gray-400'}`}>Kemasan utuh di atas palet kayu, tidak ada indikasi kelembapan berlebih atau pembatuan.</p>
                            </div>
                        </div>

                        <div className={`flex gap-3 p-2 -mx-2 rounded-xl transition-colors ${progress > 75 && !isComplete ? 'bg-[#FFFAEB]' : ''}`}>
                            {isComplete ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check className="w-3 h-3"/></div>
                            ) : progress > 75 ? (
                                <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0"><RotateCcw className="w-3 h-3 animate-spin"/></div>
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0"></div>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className={`text-[11px] font-black ${progress > 75 ? 'text-gray-900' : 'text-gray-400'}`}>Kalkulasi Volume & Bobot</h4>
                                    {progress > 75 && !isComplete && <span className="bg-[#FFCC00] text-gray-900 text-[8px] font-black px-1.5 py-0.5 rounded">Sedang Dihitung</span>}
                                </div>
                                <p className={`text-[9px] ${progress > 75 ? 'text-gray-600' : 'text-gray-400'}`}>Memindai 4 lapisan sak terstruktur: perkiraan bobot total 160 kg.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {isComplete ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check className="w-3 h-3"/></div>
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0"><div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div></div>
                            )}
                            <div>
                                <h4 className={`text-[11px] font-black mb-0.5 ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>Pencocokan Fasum Terdekat</h4>
                                <p className={`text-[9px] ${isComplete ? 'text-gray-500' : 'text-gray-400'}`}>{isComplete ? 'Menghubungkan estimasi ke 2 titik renovasi sosial sekitar Candisari.' : 'Menunggu hasil kalkulasi volume.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ringkasan Deteksi (Hanya tampil penuh saat progress tinggi) */}
                <div className={`bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 transition-all duration-500 ${progress > 90 ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Ringkasan Deteksi</span>
                        <span className="text-[9px] font-bold text-yellow-600">Akurasi Visual: 98.2%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[9px] text-gray-500 mb-0.5">Kategori Utama</p>
                            <p className="text-[12px] font-black text-gray-900">Semen & Perekat</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[9px] text-gray-500 mb-0.5">Estimasi Muatan</p>
                            <p className="text-[12px] font-black text-gray-900">~160 Kg (4 Sak)</p>
                        </div>
                    </div>

                    <div className="bg-[#F0FDF4] rounded-xl p-3 flex gap-3 items-center mb-4">
                        <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="text-[9px] font-black text-emerald-800">Dampak Lingkungan Potensial</h4>
                            <p className="text-[9px] text-emerald-700 leading-tight mt-0.5">Menghemat est. <strong className="text-emerald-900">-0.35 ton CO₂e</strong> dari produksi semen pabrik baru.</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-bold text-gray-500 mb-2">Rekomendasi Penyaluran Cepat:</p>
                        <div className="space-y-1.5">
                            <div className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-center border border-gray-100">
                                <span className="text-[9px] font-semibold text-gray-700 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-yellow-600"/> Perbaikan Jalan Gang RT 03 Candisari</span>
                                <span className="text-[9px] text-gray-500">1.2 km</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-center border border-gray-100">
                                <span className="text-[9px] font-semibold text-gray-700 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-yellow-600"/> Renovasi Wudhu Musala Al-Ikhlas</span>
                                <span className="text-[9px] text-gray-500">2.4 km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catatan Transparansi */}
                <div className="px-1">
                    <div className="flex gap-2.5">
                        <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-gray-500 leading-relaxed">
                            <strong className="text-gray-800">Catatan Transparansi:</strong> Hasil analisis merupakan estimasi visual awal berbasis AI, bukan uji laboratorium beton. Kamu tetap memegang kendali penuh untuk menyunting bobot dan kondisi fisik di tahap konfirmasi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar (Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white pt-3 pb-6 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40 flex gap-3">
                <button 
                    onClick={onBack}
                    className="flex shrink-0 items-center justify-center gap-1.5 bg-gray-100 text-gray-800 text-[11px] font-bold px-5 py-3.5 rounded-full active:scale-95 transition-transform"
                >
                    <RotateCcw className="w-3.5 h-3.5" /> Ulang
                </button>
                <button 
                    onClick={() => onNext({ category: 'Semen & Perekat', weight: 160 })}
                    disabled={!isComplete}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-full text-[11px] font-black py-3.5 transition-all ${
                        isComplete 
                        ? 'bg-[#FFCC00] text-gray-900 active:scale-95 shadow-sm' 
                        : 'bg-gray-100 text-gray-400 opacity-80'
                    }`}
                >
                    Lanjut ke Konfirmasi <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}