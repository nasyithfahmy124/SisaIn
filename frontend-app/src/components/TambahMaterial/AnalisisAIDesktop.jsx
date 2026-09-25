import React, { useState, useEffect } from 'react';
import {
    Check, Cpu, Leaf, MapPin, AlertCircle, RotateCcw,
    ArrowRight, ShieldCheck, Zap
} from 'lucide-react';

export default function AnalisisAIDesktop({ imagePayload, onBack, onNext }) {
    const [progress, setProgress] = useState(0);
    const [scanPosition, setScanPosition] = useState(0);
    const [scanDirection, setScanDirection] = useState('down');

    // Animasi Progress & Scanner AI (Simulasi ~2.4 detik)
    useEffect(() => {
        // Progress bar logika
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2; // Naik 2% setiap 50ms
            });
        }, 50);

        // Scanner line logika (Naik turun)
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
    const analysisSteps = [
        {
            threshold: 25,
            title: 'Mengenali jenis material',
            description: 'Semen PCC Portland teridentifikasi secara akurat'
        },
        {
            threshold: 50,
            title: 'Memeriksa kondisi fisik',
            description: 'Kemasan kering, tidak membeku / menggumpal'
        },
        {
            threshold: 75,
            title: 'Mengestimasi jumlah & tonase',
            description: 'Menghitung 4 sak standar semen curah teratur'
        },
        {
            threshold: 100,
            title: 'Menganalisis potensi fasum terdekat',
            description: 'Menunggu kalkulasi berat final'
        }
    ];

    const isComplete = progress === 100;

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans pb-20">
            {/* Header & Stepper */}
            <div className="pt-8 pb-10">
                <div className="max-w-[1200px] mx-auto px-6">
                    <p className="text-[11px] font-bold text-gray-500 mb-6">Beranda &gt; Tambah Material &gt; <span className="text-gray-900">Analisis AI</span></p>

                    {/* Stepper Tahap 2 */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full border border-gray-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5" />
                            </span>
                            <span className="text-[11px] font-bold">Foto Material</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 bg-[#FFCC00] px-5 py-2 rounded-full shadow-sm">
                            <span className="text-[10px] font-black text-gray-900">02</span>
                            <span className="text-[11px] font-bold text-gray-900">Analisis AI</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-[10px] font-black">03</span>
                            <span className="text-[11px] font-bold">Konfirmasi</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-[10px] font-black">04</span>
                            <span className="text-[11px] font-bold">Distribusi</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Utama */}
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* KOLOM KIRI (Visual AI & Quick Facts) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Frame Foto AI */}
                    <div className="bg-white rounded-[24px] p-3 shadow-sm border border-gray-100">
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900">
                            <img
                                src={imagePayload?.url || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800"}
                                alt="Material dianalisis"
                                className={`w-full h-full object-cover transition-all duration-700 ${isComplete ? 'scale-100' : 'scale-105'}`}
                            />

                            {/* Garis Scanner AI (Hanya muncul saat loading) */}
                            {!isComplete && (
                                <div
                                    className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#FFCC00]/40 border-b-2 border-[#FFCC00] z-10 pointer-events-none"
                                    style={{ top: `${scanPosition}%`, transition: 'top 0.1s linear' }}
                                ></div>
                            )}

                            {/* Frame Corners Kuning */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#FFCC00] rounded-tl-lg pointer-events-none"></div>
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#FFCC00] rounded-tr-lg pointer-events-none"></div>
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#FFCC00] rounded-bl-lg pointer-events-none"></div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#FFCC00] rounded-br-lg pointer-events-none"></div>

                            {/* Overlay Tags (Muncul bertahap berdasarkan progress) */}
                            <div className={`absolute top-8 left-8 transition-opacity duration-500 ${progress > 25 ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="bg-white/95 backdrop-blur text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-gray-100">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Material: Semen Portland Komposit (PCC)
                                </div>
                            </div>

                            <div className={`absolute top-20 right-8 transition-opacity duration-500 ${progress > 50 ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="bg-white/95 backdrop-blur text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-gray-100">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Kondisi: Kemasan utuh & kering (95%)
                                </div>
                            </div>

                            <div className={`absolute bottom-20 left-8 transition-opacity duration-500 ${progress > 75 ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="bg-white/95 backdrop-blur text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-gray-100">
                                    <span className="w-2 h-2 rounded-full bg-[#FFCC00]"></span> Estimasi: ~160 kg (4 Sak @40kg)
                                </div>
                            </div>

                            <div className={`absolute bottom-8 right-8 transition-opacity duration-500 ${isComplete ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="bg-emerald-500/95 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-400">
                                    <Zap className="w-3.5 h-3.5 text-yellow-300" /> Potensi Redistribusi Tinggi (Fasum)
                                </div>
                            </div>
                        </div>

                        {/* Footer Image Bar */}
                        <div className="flex justify-between items-center px-2 pt-3 pb-1">
                            <p className="text-[9px] font-bold text-gray-500">
                                <span className="text-emerald-600">ON</span> VisionEngine v3.4-1D • Kamera Proyek 12MP • Terkalibrasi
                            </p>
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Skor Sirkular: 92/100
                            </span>
                        </div>
                    </div>

                    {/* Quick Facts Bottom Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Brand Terbaca</p>
                            <h4 className="text-sm font-black text-gray-900">Cemex PCC</h4>
                            <p className="text-[10px] font-medium text-emerald-600 mt-0.5">Standar SNI 15-7064</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Kemasan Fisik</p>
                            <h4 className="text-sm font-black text-gray-900">Zak Kertas Kraft</h4>
                            <p className="text-[10px] font-medium text-gray-500 mt-0.5">Palet kayu terpal</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Tingkat Kelayakan</p>
                            <h4 className="text-sm font-black text-emerald-600">Layak Pakai 100%</h4>
                            <p className="text-[10px] font-medium text-gray-500 mt-0.5">Bebas gumpalan air</p>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN (Proses & Hasil) */}
                <div className="lg:col-span-5 space-y-5">

                    {/* Status Box */}
                    <div className="rounded-[22px] border border-[#E7E3DD] bg-white p-5 shadow-[0_5px_18px_rgba(30,25,15,0.05)]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F0DF99] bg-[#FFF8D8] px-3 py-1.5 text-[8px] font-black text-[#6E5D00]">
                                <Cpu className="h-3.5 w-3.5" />
                                COMPUTER VISION AKTIF
                            </div>

                            {!isComplete && (
                                <span className="animate-pulse text-[8px] font-bold text-[#8E8980]">
                                    Estimasi ~2 Detik Lagi
                                </span>
                            )}
                        </div>

                        <div className="mb-5">
                            <h2 className="max-w-[390px] text-[22px] font-black leading-[1.12] tracking-[-0.6px] text-[#25231F]">
                                {isComplete ? 'Analisis AI Selesai!' : 'AI Sisain sedang menganalisis foto materialmu...'}
                            </h2>

                            <p className="mt-2 max-w-[430px] text-[10px] font-medium leading-[1.65] text-[#777269]">
                                Sistem computer vision kami mengidentifikasi spesifikasi sisa konstruksi untuk mencocokkannya ke proyek perbaikan fasilitas warga terdekat.
                            </p>
                        </div>

                        <div className="mb-5">
                            <div className="mb-1.5 flex items-center justify-between text-[8px] font-black">
                                <span className="text-[#7E796F]">Pemindaian visual awal</span>
                                <span className="text-[#27241F]">{progress}% Selesai</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-[#ECEAE7] p-[2px]">
                                <div
                                    className="h-full rounded-full bg-[#FFCC00] transition-[width] duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {analysisSteps.map((step, index) => {
                                const isCompleted = progress >= step.threshold;
                                const previousThreshold = analysisSteps[index - 1]?.threshold ?? 0;
                                const isActive = progress >= previousThreshold && progress < step.threshold;

                                return (
                                    <div
                                        key={step.title}
                                        className={`flex gap-2.5 rounded-[13px] border px-2.5 py-2.5 transition-all duration-500 ease-out ${isCompleted
                                                ? 'border-transparent bg-[#F3F3F1]'
                                                : isActive
                                                    ? 'border-[#FFCF27] bg-[#FFF8D8] shadow-[0_3px_10px_rgba(255,204,0,0.12)]'
                                                    : 'border-transparent bg-[#FAFAF9]'
                                            }`}
                                    >
                                        <div className="flex shrink-0 items-start pt-0.5">
                                            {isCompleted ? (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#008463] text-white transition-all duration-500">
                                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                                </div>
                                            ) : isActive ? (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFCC00] shadow-[0_0_0_4px_rgba(255,204,0,0.12)] transition-all duration-500">
                                                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#27241F]" />
                                                </div>
                                            ) : (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0EFEC] text-[8px] font-black text-[#B1ADA5]">
                                                    {index + 1}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h4 className={`text-[10px] font-black leading-tight transition-colors duration-500 ${isCompleted || isActive ? 'text-[#302E29]' : 'text-[#A8A49C]'
                                                }`}>
                                                {step.title}
                                            </h4>

                                            <p className={`mt-0.5 text-[8.5px] font-medium leading-[1.45] transition-colors duration-500 ${isCompleted
                                                    ? 'text-[#008463]'
                                                    : isActive
                                                        ? 'text-[#806F1A]'
                                                        : 'text-[#ACA79F]'
                                                }`}>
                                                {isComplete && index === 3 ? '2 fasum ditemukan dalam radius 3 km' : step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Preview Deteksi (Muncul setelah selesai/isComplete) */}
                    <div className={`bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 transition-all duration-500 ${isComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-black text-gray-900 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" /> Pratinjau Hasil Deteksi
                            </h3>
                            <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-1 rounded-md">Draf Otomatis</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-[9px] text-gray-500 mb-0.5">Kategori</p>
                                <p className="text-[11px] font-black text-gray-900">Semen & Perekat</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-[9px] text-gray-500 mb-0.5">Estimasi Bobot</p>
                                <p className="text-[11px] font-black text-gray-900">~160 Kg</p>
                            </div>
                        </div>

                        <div className="bg-[#F0FDF4] rounded-xl p-3 flex gap-3 items-center mb-4 border border-emerald-100">
                            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-800">Pencegahan Emisi Karbon</h4>
                                <p className="text-[9px] text-emerald-600/90 leading-tight mt-0.5">Redistribusi material ini menghemat est. <strong>~0.33 ton CO2e</strong> dari produksi semen baru.</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold text-gray-500 mb-2">Potensi Penerima terdekat:</p>
                            <div className="space-y-1.5">
                                <div className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 border border-gray-100">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-[10px] font-semibold text-gray-700">Perbaikan Jalan Gang RT 03 Candisari (1.2 km)</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 border border-gray-100">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-[10px] font-semibold text-gray-700">Renovasi Tempat Wudhu Musala Al-Ikhlas (2.4 km)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer & Buttons */}
                    <div className={`transition-all duration-500 delay-300 ${isComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="bg-[#FFFDF5] border border-yellow-200/60 rounded-xl p-3 flex gap-3 mb-5">
                            <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-gray-600 leading-relaxed">
                                <strong className="text-gray-900">Catatan Transparansi:</strong> Hasil analisis ini merupakan estimasi awal berbasis citra visual AI, bukan kajian teknis profesional struktural. Kamu tetap dapat mengoreksi jumlah, satuan, dan detail spesifikasi pada langkah konfirmasi berikutnya.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onBack}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors border border-gray-200"
                            >
                                <RotateCcw className="w-4 h-4" /> Unggah Foto Ulang
                            </button>
                            <button
                                onClick={() => onNext({ category: 'Semen & Perekat', weight: 160 })}
                                className="flex-[1.5] bg-[#FFCC00] hover:bg-yellow-400 text-gray-900 text-xs font-black py-3.5 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                            >
                                Lanjut ke Konfirmasi Data (Hasil Siap) <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}