import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, ShieldCheck, Building2, Users, 
    ArrowRight, MapPin, CheckCircle2, Navigation 
} from 'lucide-react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function DistribusiMobile() {
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState('proyek');
    const [showMapModal, setShowMapModal] = useState(false);
    const [viewState, setViewState] = useState({
        latitude: -6.9758,
        longitude: 110.3951,
        zoom: 13
    });

    const handleLanjutkan = () => {
        alert(`Berhasil memilih opsi: ${selectedOption === 'proyek' ? 'Donasi Proyek Fasum' : 'Klaim P2P Lokal'}`);
        navigate('/redistribusi');
    };

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-32 font-sans text-gray-900 relative">
            
            {/* Header */}
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
                <h1 className="text-xl font-black text-gray-900 mb-1">Distribusi</h1>
                
                {/* Stepper Indikator */}
                <div className="flex items-center justify-between my-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 px-2">01 Foto</span>
                    <span className="text-[10px] font-bold text-gray-400 px-2">02 Analisis</span>
                    <span className="text-[10px] font-bold text-gray-400 px-2">03 Konfirm</span>
                    <span className="bg-[#FFCC00] text-gray-950 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">04 Kirim</span>
                </div>

                {/* Ringkasan Material Terkonfirmasi */}
                <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <img 
                            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=200" 
                            alt="Material" 
                            className="w-12 h-12 rounded-xl object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <ShieldCheck className="w-3 h-3" /> Terkonfirmasi
                                </span>
                            </div>
                            <h3 className="text-xs font-black text-gray-900 truncate">Semen PCC 40kg</h3>
                            <p className="text-[10px] text-gray-500 truncate">4 Sak • Total Berat 160 kg</p>
                        </div>
                    </div>
                </div>

                {/* Pertanyaan Utama */}
                <div className="mb-5">
                    <h2 className="text-xl font-black text-gray-900 leading-tight mb-1.5">
                        Material ini ingin disalurkan ke mana?
                    </h2>
                    <p className="text-xs font-medium text-gray-500 leading-relaxed">
                        Pilih tujuan agar SISAIN dapat mencari kebutuhan yang paling sesuai.
                    </p>
                </div>

                {/* Opsi 1: Donasi Proyek */}
                <div 
                    onClick={() => setSelectedOption('proyek')}
                    className={`rounded-3xl p-5 border-2 transition-all cursor-pointer mb-4 relative ${
                        selectedOption === 'proyek' 
                        ? 'bg-white border-[#FFCC00] shadow-md ring-4 ring-yellow-400/10' 
                        : 'bg-white border-gray-200/80 shadow-sm'
                    }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-800 font-black">
                                <Building2 className="w-5 h-5 text-yellow-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900">Donasi Proyek</h3>
                                <p className="text-[10px] font-bold text-gray-400">Infrastruktur & Sosial</p>
                            </div>
                        </div>
                        <span className="bg-yellow-100 text-yellow-900 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                            Rekomendasi Fasum ✓
                        </span>
                    </div>

                    <p className="text-[11px] font-medium text-gray-600 leading-relaxed mb-4">
                        Salurkan material ke proyek sosial, fasilitas publik, atau kebutuhan infrastruktur yang telah diverifikasi.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-gray-100 text-[10px] font-bold text-gray-700">
                        <p className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fasum warga terverifikasi (jalan, musala, pos kamling)
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-600">
                            <Navigation className="w-3.5 h-3.5 text-yellow-600" /> Armada kurir gratis disediakan oleh mitra logistik
                        </p>
                    </div>

                    {/* Tombol Lihat Peta Interaktif */}
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowMapModal(true); }}
                        className="mt-4 w-full bg-gray-50 hover:bg-gray-100 text-gray-800 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-gray-200"
                    >
                        <MapPin className="w-3.5 h-3.5 text-red-500" /> Lihat Lokasi Proyek di Peta
                    </button>
                </div>

                {/* Opsi 2: Klaim P2P Lokal */}
                <div 
                    onClick={() => setSelectedOption('p2p')}
                    className={`rounded-3xl p-5 border-2 transition-all cursor-pointer mb-6 relative ${
                        selectedOption === 'p2p' 
                        ? 'bg-white border-[#FFCC00] shadow-md ring-4 ring-yellow-400/10' 
                        : 'bg-white border-gray-200/80 shadow-sm'
                    }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-700">
                                <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900">Klaim P2P Lokal</h3>
                                <p className="text-[10px] font-bold text-gray-400">Komunitas Terdekat</p>
                            </div>
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2.5 py-1 rounded-full">
                            Penyaluran Kilat
                        </span>
                    </div>

                    <p className="text-[11px] font-medium text-gray-600 leading-relaxed mb-4">
                        Bagikan material kepada warga atau renovator individu di sekitar lokasi yang membutuhkan cepat.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-gray-100 text-[10px] font-bold text-gray-700">
                        <p className="flex items-center gap-1.5 text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-yellow-600" /> Radius 1 - 3 km sekitar lokasimu saat ini
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-600">
                            📦 Pengambilan mandiri (Self-pickup oleh warga penerima)
                        </p>
                    </div>
                </div>

                {/* Info Catatan */}
                <div className="bg-[#FFF9E5] border border-yellow-200 rounded-2xl p-3.5 mb-2">
                    <p className="text-[10px] font-medium text-yellow-900 leading-relaxed">
                        🌱 Kedua opsi menjamin material semen tidak berakhir di TPA dan terdokumentasi dalam jejak karbon sirkular.
                    </p>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
                <p className="text-[9px] font-bold text-center text-gray-400 mb-2">
                    Pilihan dapat disesuaikan sebelum armada dijadwalkan
                </p>
                <button 
                    onClick={handleLanjutkan}
                    className="w-full bg-[#FFCC00] hover:bg-yellow-400 text-gray-950 font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
                >
                    <span>Lanjutkan</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Modal Peta Interaktif (MapLibre) */}
            {showMapModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[450px]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xs font-black text-gray-900">Peta Sebaran Proyek Fasum</h3>
                            <button 
                                onClick={() => setShowMapModal(false)}
                                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-xs flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 relative">
                            <Map
                                {...viewState}
                                onMove={evt => setViewState(evt.viewState)}
                                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                style={{ width: '100%', height: '100%' }}
                            >
                                <Marker latitude={-6.9758} longitude={110.3951} anchor="bottom">
                                    <div className="bg-red-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                                        <Building2 size={16} />
                                    </div>
                                </Marker>
                            </Map>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100 text-center">
                            <p className="text-[10px] font-bold text-gray-600 mb-2">Lokasi: Perbaikan Jalan Gang Pleburan (0.7 km)</p>
                            <button 
                                onClick={() => setShowMapModal(false)}
                                className="w-full bg-gray-900 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm"
                            >
                                Tutup Peta
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}