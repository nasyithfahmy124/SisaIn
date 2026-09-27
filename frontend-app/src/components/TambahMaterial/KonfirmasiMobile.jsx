import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Sparkles, CheckCircle2, MapPin, 
    Plus, Minus, Edit2, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function KonfirmasiMobile() {
    const navigate = useNavigate();

    const [namaMaterial, setNamaMaterial] = useState('Semen Portland (PCC 40kg)');
    const [jumlah, setJumlah] = useState(4);
    const [kondisi, setKondisi] = useState('kering');
    const [alamat, setAlamat] = useState('Jl. Pandanaran No. 42, Semarang Tengah');
    const [catatan, setCatatan] = useState('Sisa renovasi ruko 2 lantai, pallet utuh disimpan di area kering beratap, aman dari kelembapan.');

    const handleIncrement = () => setJumlah(prev => prev + 1);
    const handleDecrement = () => setJumlah(prev => (prev > 1 ? prev - 1 : 1));

    const handleOpenGoogleMaps = () => {
        const encodedAddress = encodeURIComponent(alamat + ' Semarang');
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    const handleKonfirmasi = () => {
        alert('Material berhasil dikonfirmasi dan dilanjutkan ke proses akhir!');
        navigate('/redistribusi');
    };

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-28 font-sans text-gray-900">
            
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-1 text-sm font-bold text-gray-800 hover:text-gray-900"
                >
                    <ChevronLeft className="w-5 h-5" /> Kembali
                </button>
                <div className="w-16 h-1.5 bg-yellow-400 rounded-full"></div>
            </div>

            <div className="px-4 pt-4">
                <h1 className="text-xl font-black text-gray-900 mb-1">Konfirmasi Hasil Analisis</h1>
                
                <div className="flex items-center justify-between my-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 px-2">01 Foto</span>
                    <span className="text-[10px] font-bold text-gray-400 px-2">02 Analisis</span>
                    <span className="bg-[#FFCC00] text-gray-950 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">03 Konfirm</span>
                    <span className="text-[10px] font-bold text-gray-400 px-2">04 Kirim</span>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <h3 className="text-xs font-black text-gray-900">Ringkasan Estimasi AI</h3>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Akurasi 96%
                        </span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2.5 border border-gray-100 mb-3">
                        <img 
                            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=200" 
                            alt="Material" 
                            className="w-12 h-12 rounded-xl object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-yellow-100 text-yellow-800 text-[9px] font-black px-2 py-0.5 rounded">Semen PCC</span>
                                <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Grade A</span>
                            </div>
                            <p className="text-[10px] font-semibold text-gray-600 truncate">Terdeteksi: ± 4 Sak (160 kg utuh)</p>
                        </div>
                    </div>

                    <p className="text-[10px] font-medium text-gray-500 bg-[#FFF9E5] border border-yellow-200/60 p-2.5 rounded-xl leading-relaxed">
                        Data di bawah terisi otomatis oleh AI. Silakan sunting jika terdapat perbedaan kondisi fisik material.
                    </p>
                </div>

                <div className="space-y-5">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-900">Jenis Material *</label>
                            <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-0.5 rounded">Estimasi AI: Semen PCC</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={namaMaterial} 
                                onChange={(e) => setNamaMaterial(e.target.value)}
                                className="w-full bg-white rounded-2xl border border-gray-200 px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 shadow-sm"
                            />
                            <Edit2 className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Jumlah Tersedia *</label>
                        <div className="bg-white rounded-2xl border border-gray-200 p-3 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center font-black text-yellow-800 text-xs">📦</div>
                                <span className="text-sm font-black text-gray-900">{jumlah} Sak</span>
                                <span className="text-[10px] text-gray-400 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">± {jumlah * 40} kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleDecrement}
                                    className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-700 transition-colors active:scale-95"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleIncrement}
                                    className="w-9 h-9 bg-[#FFCC00] hover:bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-gray-900 transition-colors active:scale-95 shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-900">Kondisi Material *</label>
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Siap Pakai
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => setKondisi('kering')}
                                className={`p-3 rounded-2xl border text-left transition-all ${
                                    kondisi === 'kering' 
                                    ? 'bg-[#FFCC00] border-yellow-400 shadow-sm font-black text-gray-950' 
                                    : 'bg-white border-gray-200 text-gray-600 font-bold'
                                }`}
                            >
                                <p className="text-[11px] mb-0.5">✓ Kering</p>
                                <span className="text-[9px] opacity-80">& Utuh</span>
                            </button>
                            <button 
                                onClick={() => setKondisi('sisa')}
                                className={`p-3 rounded-2xl border text-left transition-all ${
                                    kondisi === 'sisa' 
                                    ? 'bg-[#FFCC00] border-yellow-400 shadow-sm font-black text-gray-950' 
                                    : 'bg-white border-gray-200 text-gray-600 font-bold'
                                }`}
                            >
                                <p className="text-[11px] mb-0.5">📦 Sisa</p>
                                <span className="text-[9px] opacity-80">Terbuka</span>
                            </button>
                            <button 
                                onClick={() => setKondisi('lainnya')}
                                className={`p-3 rounded-2xl border text-left transition-all ${
                                    kondisi === 'lainnya' 
                                    ? 'bg-[#FFCC00] border-yellow-400 shadow-sm font-black text-gray-950' 
                                    : 'bg-white border-gray-200 text-gray-600 font-bold'
                                }`}
                            >
                                <p className="text-[11px] mb-0.5">⚙ Lainnya</p>
                                <span className="text-[9px] opacity-80">Perlu sortir</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2">Lokasi Penjemputan *</label>
                        <div className="bg-white rounded-2xl border border-gray-200 p-3.5 flex items-center justify-between shadow-sm">
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-black text-gray-900 truncate">Proyek Renovasi Pandanaran</h4>
                                    <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">{alamat}</p>
                                    <p className="text-[9px] font-semibold text-emerald-600 mt-1">🚚 Dapat diakses pickup / truk engkel</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleOpenGoogleMaps}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold px-3 py-2 rounded-xl transition-colors shrink-0 ml-2"
                            >
                                Ubah Titik
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-900">Catatan Penanganan (Opsional)</label>
                            <span className="text-[9px] text-gray-400 font-semibold">Maks. 120 kata</span>
                        </div>
                        <textarea 
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            rows="3"
                            className="w-full bg-white rounded-2xl border border-gray-200 p-3.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none shadow-sm"
                        ></textarea>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={handleKonfirmasi}
                        className="w-full bg-[#FFCC00] hover:bg-yellow-400 text-gray-950 font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform mb-2"
                    >
                        <span>Konfirmasi Material</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full text-center text-[10px] font-bold text-gray-500 hover:text-gray-800 py-1"
                    >
                        Periksa Kembali & Ambil Ulang Foto
                    </button>
                </div>

            </div>
        </div>
    );
}