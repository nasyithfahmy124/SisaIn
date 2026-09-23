import React, { useState, useEffect } from 'react';
import { 
    Check, Cpu, Leaf, MapPin, AlertCircle, ArrowLeft, 
    ArrowRight, ShieldCheck, Wrench, Plus, Minus, 
    ChevronDown, RefreshCcw, Box, CheckCircle2, Lock, Lightbulb
} from 'lucide-react';

export default function KonfirmasiDesktop({ imagePayload, aiData, onBack, onNext }) {
    // State Formulir (Diisi default dari AI)
    const [formData, setFormData] = useState({
        jenis: aiData?.category || 'Semen Portland Composite (PCC)',
        jumlah: aiData?.quantity || 4,
        satuan: 'Sak standar (40 kg/sak)',
        kondisi: aiData?.condition || 'Grade A',
        lokasi: aiData?.location || 'Jl. Pandanaran No. 42, Candisari, Semarang',
        catatan: ''
    });

    const handleReset = () => {
        setFormData({
            jenis: aiData?.category || 'Semen Portland Composite (PCC)',
            jumlah: aiData?.quantity || 4,
            satuan: 'Sak standar (40 kg/sak)',
            kondisi: aiData?.condition || 'Grade A',
            lokasi: aiData?.location || 'Jl. Pandanaran No. 42, Candisari, Semarang',
            catatan: ''
        });
    };

    const handleQuantityChange = (delta) => {
        setFormData(prev => ({
            ...prev,
            jumlah: Math.max(1, prev.jumlah + delta)
        }));
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans pb-20">
            {/* Header & Stepper */}
            <div className="pt-8 pb-8 border-b border-gray-100 bg-white">
                <div className="max-w-[1300px] mx-auto px-6">
                    <p className="text-[11px] font-bold text-gray-500 mb-6">
                        Beranda &gt; Tambah Material &gt; Analisis AI &gt; <span className="text-gray-900">Konfirmasi</span>
                    </p>
                    
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full border border-gray-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5" /></span>
                            <span className="text-[11px] font-bold">Foto Material</span>
                        </div>
                        <div className="w-6 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full border border-gray-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5" /></span>
                            <span className="text-[11px] font-bold">Analisis AI</span>
                        </div>
                        <div className="w-6 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 bg-[#FFCC00] px-5 py-2 rounded-full shadow-sm">
                            <span className="text-[10px] font-black text-gray-900">03</span>
                            <span className="text-[11px] font-bold text-gray-900">Konfirmasi</span>
                        </div>
                        <div className="w-6 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-[10px] font-black">04</span>
                            <span className="text-[11px] font-bold">Distribusi</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1300px] mx-auto px-6 mt-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-[#FFCC00]/20 text-yellow-800 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase mb-3">
                            <ShieldCheck className="w-3.5 h-3.5" /> Tahap 03 • Verifikasi Human-In-The-Loop
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Konfirmasi Material</h1>
                        <p className="text-sm font-medium text-gray-600">Tinjau dan sesuaikan data hasil deteksi AI. Pastikan spesifikasi akurat sebelum dialokasikan ke jalur distribusi sirkular.</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Status: Potensi Daur Ulang 100%
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* KOLOM KIRI (Rangkuman AI) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center"><Cpu className="w-5 h-5 text-yellow-700" /></div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900">Rangkuman AI Sisain</h3>
                                        <p className="text-[10px] text-gray-500 font-medium">Computer Vision v2.4</p>
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Akurasi Deteksi: 96%</span>
                            </div>

                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 mb-6">
                                <img src={imagePayload?.url || "https://images.unsplash.com/photo-1503387762-592deb58ef4e"} alt="Material" className="w-full h-full object-cover opacity-90" />
                                <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full"></span> Terdeteksi Otomatis
                                </div>
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-gray-900 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <Box className="w-3 h-3 text-gray-500" /> Palet Kayu Teridentifikasi
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Hasil Pindai Visual AI</span>
                                <span className="bg-[#FFCC00] text-gray-900 text-[9px] font-black px-2 py-0.5 rounded">Estimasi AI</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <Box className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                    <div className="w-full flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] text-gray-500 mb-0.5">Material Terdeteksi</p>
                                            <h4 className="text-sm font-black text-gray-900">Semen Portland Composite (PCC 40kg)</h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600">98% cocok</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Cpu className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                    <div className="w-full flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] text-gray-500 mb-0.5">Estimasi Kuantitas</p>
                                            <h4 className="text-sm font-black text-gray-900">± 4 sak <span className="text-[10px] font-medium text-gray-500">(@ 40 kg / ± 160 kg)</span></h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600">Pola terhitung</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 mb-0.5">Estimasi Kondisi</p>
                                        <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">Grade A • Kering & Utuh <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></h4>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Bungkus kedap tanpa gumpalan, terbungkus plastik wrapping</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 mb-0.5">Rekomendasi Penggunaan</p>
                                        <h4 className="text-xs font-black text-gray-900">Plesteran, rabat jalan, fasum lingkungan & paving warga</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-[#FFFAEB] border border-yellow-200 rounded-xl p-4 flex gap-4 items-center">
                                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[8px] font-black text-yellow-800 uppercase tracking-widest mb-0.5">Potensi Reduksi Emisi</p>
                                    <h4 className="text-lg font-black text-emerald-800">~0.35 ton CO₂e</h4>
                                    <p className="text-[10px] text-emerald-700 font-medium">terselamatkan dari penumpukan TPA</p>
                                </div>
                                <span className="bg-white text-emerald-700 text-[9px] font-bold px-2 py-1 rounded-md border border-emerald-100 shadow-sm shrink-0">Sirkular 100%</span>
                            </div>

                            <div className="mt-5 flex gap-2 text-gray-500">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed">Semua nilai di sebelah kanan telah diisi otomatis berdasarkan pembacaan AI di atas. Silakan koreksi bila ada perbedaan spesifikasi atau kondisi nyata di lapangan.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-200 flex gap-4 items-center">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-gray-900 mb-0.5">Standar Material Sisain Nusantara</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed">Material terkonfirmasi akan otomatis diteruskan kepada inisiatif tukang lokal dan renovasi fasilitas umum binaan.</p>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN (Form Konfirmasi) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                            
                            {/* Badges & Reset */}
                            <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100">
                                <div className="flex gap-2">
                                    <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"><Wrench className="w-3 h-3"/> Data yang kamu konfirmasi</span>
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"><RefreshCcw className="w-3 h-3"/> Tersinkron AI</span>
                                </div>
                                <button onClick={handleReset} className="text-[11px] font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1.5 transition-colors">
                                    <RotateCcw className="w-3.5 h-3.5" /> Reset ke Hasil AI
                                </button>
                            </div>

                            {/* Form Input: Jenis */}
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-[11px] font-black text-gray-900">Jenis Material <span className="text-red-500">*</span></label>
                                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3"/> AI Suggestion: Semen PCC</span>
                                </div>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.jenis}
                                        onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                                    />
                                    <Wrench className="w-4 h-4 text-gray-400 absolute right-4 top-4" />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] font-bold text-gray-500 mr-1 mt-1">Opsi Cepat:</span>
                                    {['Semen Portland Type 1', 'Semen Putih', 'Mortar Instan'].map(opt => (
                                        <button key={opt} onClick={() => setFormData({...formData, jenis: opt})} className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-md transition-colors">{opt}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Input: Jumlah & Satuan */}
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-[11px] font-black text-gray-900">Jumlah & Satuan Volume <span className="text-red-500">*</span></label>
                                    <span className="text-[9px] font-bold text-gray-500">Nilai dari AI: ± 4 sak</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden w-1/3">
                                        <button onClick={() => handleQuantityChange(-1)} className="px-4 py-3.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"><Minus className="w-4 h-4" /></button>
                                        <input type="text" readOnly value={formData.jumlah} className="w-full bg-transparent text-center font-black text-base text-gray-900 focus:outline-none" />
                                        <button onClick={() => handleQuantityChange(1)} className="px-4 py-3.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <div className="relative w-2/3">
                                        <select 
                                            value={formData.satuan}
                                            onChange={(e) => setFormData({...formData, satuan: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                                        >
                                            <option>Sak standar (40 kg/sak)</option>
                                            <option>Sak besar (50 kg/sak)</option>
                                            <option>Kg (Curah)</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-4 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-3 px-1">
                                    <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1.5"><Box className="w-3.5 h-3.5 text-emerald-600"/> Estimasi Total Bobot: <span className="text-gray-900">{(formData.jumlah * 40)} kg</span></span>
                                    <span className="text-[10px] font-bold text-emerald-600">Truk engkel / pikap kecil cukup</span>
                                </div>
                            </div>

                            {/* Form Input: Kondisi Fisik */}
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-3">
                                    <label className="text-[11px] font-black text-gray-900">Kondisi Fisik Material <span className="text-red-500">*</span></label>
                                    <span className="bg-gray-100 text-gray-600 text-[9px] font-black px-2 py-0.5 rounded">Grade A Terdeteksi</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div 
                                        onClick={() => setFormData({...formData, kondisi: 'Grade A'})}
                                        className={`cursor-pointer rounded-xl p-4 border transition-all ${formData.kondisi === 'Grade A' ? 'bg-[#FFFAEB] border-[#FFCC00] shadow-sm' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <h4 className="text-[11px] font-black text-gray-900 mb-1 flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${formData.kondisi === 'Grade A' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span> Kering & Utuh
                                        </h4>
                                        <p className="text-[9px] text-gray-500 leading-relaxed mb-3">Disimpan di atas palet kayu, terbungkus rapat tanpa kontak air/tanah.</p>
                                        {formData.kondisi === 'Grade A' && <span className="text-[9px] font-bold text-emerald-600">Paling direkomendasikan</span>}
                                    </div>

                                    <div 
                                        onClick={() => setFormData({...formData, kondisi: 'Grade B'})}
                                        className={`cursor-pointer rounded-xl p-4 border transition-all ${formData.kondisi === 'Grade B' ? 'bg-[#FFFAEB] border-[#FFCC00] shadow-sm' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <h4 className="text-[11px] font-black text-gray-900 mb-1 flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${formData.kondisi === 'Grade B' ? 'bg-yellow-500' : 'bg-gray-300'}`}></span> Sisa Terbuka
                                        </h4>
                                        <p className="text-[9px] text-gray-500 leading-relaxed mb-3">Sebagian sak terbuka namun tidak basah, isi masih berbutir halus.</p>
                                        {formData.kondisi === 'Grade B' && <span className="text-[9px] font-bold text-yellow-600">Prioritas adukan cepat</span>}
                                    </div>

                                    <div 
                                        onClick={() => setFormData({...formData, kondisi: 'Grade C'})}
                                        className={`cursor-pointer rounded-xl p-4 border transition-all ${formData.kondisi === 'Grade C' ? 'bg-[#FFFAEB] border-[#FFCC00] shadow-sm' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <h4 className="text-[11px] font-black text-gray-900 mb-1 flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${formData.kondisi === 'Grade C' ? 'bg-red-500' : 'bg-gray-300'}`}></span> Perlu Sortir
                                        </h4>
                                        <p className="text-[9px] text-gray-500 leading-relaxed mb-3">Ada sedikit gumpalan kering, perlu diayak ulang sebelum dipakai.</p>
                                        {formData.kondisi === 'Grade C' && <span className="text-[9px] font-bold text-red-500">Fasum jalan/urukan</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Form Input: Lokasi */}
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-[11px] font-black text-gray-900">Lokasi Penjemputan / Titik Material <span className="text-red-500">*</span></label>
                                    <button className="text-[10px] font-bold text-yellow-700 flex items-center gap-1 hover:underline"><MapPin className="w-3 h-3"/> Gunakan GPS Proyek</button>
                                </div>
                                <div className="relative flex items-center">
                                    <MapPin className="w-4 h-4 text-gray-400 absolute left-4" />
                                    <input 
                                        type="text" 
                                        value={formData.lokasi}
                                        onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-24 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                                    />
                                    <button className="absolute right-2 bg-white border border-gray-200 shadow-sm text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-50">
                                        <MapPin className="w-3 h-3" /> Pilih di Peta
                                    </button>
                                </div>
                                <p className="text-[9px] text-gray-500 mt-2 px-1">Radius distribusi pengiriman komunitas akan dihitung secara presisi dari titik koordinat ini.</p>
                            </div>

                            {/* Form Input: Catatan */}
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-[11px] font-black text-gray-900">Catatan Akses Pengambilan & Penanganan</label>
                                    <span className="text-[9px] text-gray-400 font-bold">Opsional tapi disarankan</span>
                                </div>
                                <textarea 
                                    rows="3"
                                    placeholder="Contoh: Sisa renovasi ruko 2 lantai, disimpan di area beratap kering, palet kayu siap dipindahkan..."
                                    value={formData.catatan}
                                    onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none placeholder:font-medium placeholder:text-gray-400"
                                ></textarea>
                            </div>

                            {/* Verified Badge */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-emerald-600"/></div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-gray-900">Diverifikasi oleh Budi Santoso</h4>
                                        <p className="text-[9px] text-gray-500">Terdaftar sebagai Kontraktor Mandiri • 14 batch sukses tersalurkan</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">ID Batch: <span className="text-yellow-700">SN-2026-899</span></span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-4">
                                <button 
                                    onClick={onBack}
                                    className="flex-1 bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold py-4 rounded-full flex items-center justify-center gap-2 border border-gray-200 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Periksa Kembali
                                </button>
                                <button 
                                    onClick={() => onNext(formData)}
                                    className="flex-[1.5] bg-[#FFCC00] hover:bg-yellow-400 text-gray-900 text-sm font-black py-4 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                                >
                                    Gunakan Data Ini <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1.5"><Lock className="w-3 h-3 text-emerald-600"/> Data material diverifikasi aman & hanya dibagikan ke fasilitas umum serta penerima resmi bersertifikat Sisain Nusantara.</p>
                        </div>

                        {/* Bottom Info Card */}
                        <div className="bg-gray-50 rounded-[24px] p-6 border border-gray-200 flex gap-4">
                            <div className="w-10 h-10 bg-[#FFCC00]/20 rounded-full flex items-center justify-center shrink-0">
                                <Lightbulb className="w-5 h-5 text-yellow-700" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-gray-900 mb-1">Apa langkah selanjutnya setelah konfirmasi?</h4>
                                <p className="text-[10px] text-gray-600 leading-relaxed">Di Tahap 04 Distribusi, sistem akan memilih alokasi tercepat: pickup mandiri oleh warga, klaim bank material terdekat, atau kurir relawan Sisain.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}