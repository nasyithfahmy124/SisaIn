import React from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
    ArrowLeft, CheckCircle2, MapPin, Camera, 
    Wrench, Check, ShieldCheck, ArrowRight, 
    Leaf, Truck, Lock, Map as MapIcon, Clock, Shield
} from 'lucide-react';

export default function DetailKebutuhanDesktop({ projectData, materialData, onBack, onNext }) {
    // Dummy Data Fallback (jika data dari props belum ada)
    const project = projectData || {
        title: "Perbaikan Jalan Gang RT 03",
        location: "Kelurahan Candisari, Semarang Selatan, Kota Semarang",
        distance: "0.7 km",
        neededKg: 120,
        neededSak: 3,
        coordinates: [110.427, -7.021]
    };

    const material = materialData || {
        availableKg: 160,
        availableSak: 4,
        type: "Semen PCC",
        originCoords: [110.422, -7.025]
    };

    // GeoJSON untuk menggambar garis rute di Map
    const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: [
                material.originCoords,
                project.coordinates
            ]
        }
    };

    return (
        <div className="min-h-screen bg-[#FCF9F8] font-sans pb-24">
            
            {/* Top Navigation & Toast */}
            <div className="bg-[#FCF9F8] border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-40">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Kembali ke Matching</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 text-gray-500 text-[9px] font-black tracking-wider px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ID REFERENSI : MTC-2024-889X
                    </div>
                    <div className="bg-gray-800 text-white text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-yellow-400" /> Pilihan berhasil diperbarui
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 mt-6">
                
                {/* Status Bar */}
                <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm border border-gray-100 mb-6">
                    <p className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                        <span className="text-gray-300">⚑</span> Langkah Berikutnya: Konfirmasi Pickup / Kirim
                    </p>
                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Siap Diproses
                    </span>
                </div>

                {/* Header Title */}
                <div className="mb-8">
                    <div className="flex gap-2 mb-3">
                        <span className="bg-[#FFCC00] text-gray-900 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Konfirmasi Tujuan Penyaluran</span>
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Diverifikasi Lapangan</span>
                    </div>
                    <h1 className="text-[32px] font-black text-gray-900 mb-2 tracking-tight">Detail Kebutuhan Proyek</h1>
                    <p className="text-[12px] font-medium text-gray-500 max-w-2xl leading-relaxed">
                        Tinjau kecocokan material Anda dengan kebutuhan fasilitas umum ini sebelum menentukan metode pengiriman atau penjemputan oleh relawan terdekat.
                    </p>
                </div>

                {/* Main Grid Split (60:40) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* KOLOM KIRI (Info Proyek - Col 7) */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* Project Header Card */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                            <div className="flex gap-2 mb-4">
                                <span className="bg-[#E6F4EA] text-[#137333] text-[9px] font-bold px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Terverifikasi RW 05</span>
                                <span className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-1 rounded border border-red-100 flex items-center gap-1"><span className="text-red-500 font-black">*</span> URGENT FASUM</span>
                                <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-1 rounded border border-gray-200">Prioritas Fasilitas Publik</span>
                            </div>

                            <p className="text-[10px] font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                                <MapPin className="w-3.5 h-3.5 text-red-500" /> <strong className="text-gray-900">{project.distance}</strong> dari lokasi material
                            </p>
                            <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{project.title}</h2>
                            <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5 mb-5">
                                <MapPin className="w-3.5 h-3.5" /> {project.location}
                            </p>

                            {/* Foto Lapangan */}
                            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 border border-gray-100 shadow-sm">
                                <img src="https://images.unsplash.com/photo-1541888081682-1981a8b1d9db?auto=format&fit=crop&q=80&w=1200" alt="Kondisi Lapangan" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4">
                                    <p className="text-white text-[10px] font-medium flex items-center gap-2">
                                        <Camera className="w-4 h-4" /> Dokumentasi survei lapangan tim relawan Sisain (Kemarin, 14:20 WIB)
                                    </p>
                                    <span className="bg-white/90 backdrop-blur text-gray-900 text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                        Kondisi Lapangan Asli
                                    </span>
                                </div>
                            </div>

                            {/* Box Kegunaan */}
                            <div className="bg-[#FFFAEB] rounded-2xl p-5 border border-yellow-100/60">
                                <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Wrench className="w-3.5 h-3.5" /> Material Akan Digunakan Untuk:
                                </p>
                                <h3 className="text-[15px] font-black text-gray-900 mb-2">Perbaikan jalan lingkungan & talud akses posyandu</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed mb-4">
                                    Pengecoran dan penambalan 45 meter akses jalan lorong gang warga yang amblas akibat genangan air dan rembesan saluran air hujan. Akses ini merupakan jalur utama lansia menuju posyandu serta anak-anak sekolah dasar saat jam padat pagi hari.
                                </p>
                                <div className="bg-white rounded-lg p-2.5 flex items-start gap-2 border border-yellow-50 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <p className="text-[10px] font-bold text-gray-700">Target penyelesaian: Rampung minggu ini melalui kerja bakti swadaya warga.</p>
                                </div>
                            </div>
                        </div>

                        {/* Box Validasi Fisik */}
                        <div className="bg-[#F9FDF9] rounded-[24px] p-6 shadow-sm border border-emerald-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-200">
                                <Shield className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-sm font-black text-gray-900">Validasi Fisik Terkonfirmasi</h3>
                                    <span className="text-[9px] font-bold text-gray-400">Kemarin, 16:00 WIB</span>
                                </div>
                                <p className="text-[11px] text-gray-600 font-medium mb-3">Permintaan diverifikasi langsung oleh Mas Heru (Koordinator Lapangan Sisain Candisari).</p>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                        Survei fisik dan kelayakan kebutuhan semen telah divalidasi langsung di titik proyek gang RT 03. Pengurus RT telah menyiapkan tempat penyimpanan tertutup terpal anti-hujan.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* KOLOM KANAN (Kecocokan & Aksi - Col 5) */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* Match Analytics Card */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                                    <MapIcon className="w-4 h-4 text-yellow-600" /> Kecocokan Material
                                </h3>
                                <span className="bg-[#FFCC00] text-gray-900 text-[9px] font-black px-2.5 py-1 rounded-md">Kesesuaian Tinggi</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Material Kamu</p>
                                    <p className="text-xl font-black text-gray-900 leading-none mb-1">{material.availableKg} kg</p>
                                    <p className="text-[9px] font-medium text-gray-500">{material.type} • {material.availableSak} Sak</p>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-red-100 shadow-sm text-center">
                                    <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Kebutuhan RT 03</p>
                                    <p className="text-xl font-black text-red-600 leading-none mb-1">{project.neededKg} kg</p>
                                    <p className="text-[9px] font-medium text-gray-500">Kebutuhan • {project.neededSak} Sak</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100 mb-4">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Index Kecocokan Spasial & Mutu</p>
                                    <p className="text-[11px] font-black text-gray-900">Tipe semen & lokasi sangat optimal</p>
                                </div>
                                <div className="w-12 h-12 bg-[#FFCC00] rounded-full flex items-center justify-center border-[3px] border-gray-900 shadow-sm">
                                    <span className="text-sm font-black text-gray-900">98%</span>
                                </div>
                            </div>

                            <div className="bg-[#FFFAEB] rounded-xl p-4 border border-yellow-200/50 mb-5">
                                <h4 className="text-[11px] font-black text-yellow-900 flex items-center gap-1.5 mb-1.5">
                                    <Check className="w-4 h-4 text-yellow-600" /> Material Anda sangat pas & efisien
                                </h4>
                                <p className="text-[9px] text-gray-600 leading-relaxed">
                                    Kebutuhan 120 kg (3 sak) langsung dialokasikan untuk perbaikan cor jalan gang warga. Sisa surplus 40 kg (1 sak) otomatis dicadangkan untuk plesteran Musala Al-Ikhlas terdekat (tanpa repot, diatur langsung oleh relawan logistik Sisain).
                                </p>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <p className="text-[10px] font-medium text-gray-700"><strong className="text-gray-900">Tipe Material:</strong> Semen Portland PCC (Sangat sesuai rabat jalan beton)</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <p className="text-[10px] font-medium text-gray-700"><strong className="text-gray-900">Kondisi Mutu:</strong> Kering & utuh Grade A (Siap campur agregat langsung)</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <p className="text-[10px] font-medium text-gray-700"><strong className="text-gray-900">Volume:</strong> Mencukupi 100% volume rencana kerja bakti RT</p>
                                </div>
                            </div>
                        </div>

                        {/* Rute Spasial Map Card */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                                    <MapIcon className="w-4 h-4 text-emerald-600" /> Rute Distribusi Spasial
                                </h3>
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md">±4 Menit</span>
                            </div>

                            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 border border-gray-200 bg-gray-100">
                                <Map
                                    initialViewState={{ longitude: 110.4245, latitude: -7.023, zoom: 14.5 }}
                                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                    style={{ width: '100%', height: '100%' }}
                                    interactive={false}
                                >
                                    {/* Garis Rute */}
                                    <Source id="route" type="geojson" data={routeGeoJSON}>
                                        <Layer 
                                            id="route-line" 
                                            type="line" 
                                            paint={{ 'line-color': '#10B981', 'line-width': 4, 'line-dasharray': [2, 1] }} 
                                        />
                                    </Source>

                                    {/* Marker Titik Asal */}
                                    <Marker longitude={material.originCoords[0]} latitude={material.originCoords[1]} anchor="center">
                                        <div className="w-4 h-4 bg-[#FFCC00] rounded-full border-[3px] border-gray-900 shadow-md"></div>
                                    </Marker>

                                    {/* Marker Titik Tujuan */}
                                    <Marker longitude={project.coordinates[0]} latitude={project.coordinates[1]} anchor="center">
                                        <div className="w-4 h-4 bg-red-500 rounded-full border-[3px] border-white shadow-md"></div>
                                    </Marker>
                                </Map>

                                {/* Floating UI on Map */}
                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur p-2.5 rounded-xl shadow-md border border-gray-100 min-w-[200px]">
                                    <div className="relative pl-5">
                                        <div className="absolute left-0 top-1 w-2 h-2 bg-[#FFCC00] border-2 border-gray-900 rounded-full z-10"></div>
                                        <div className="absolute left-[3px] top-3 bottom-0 w-0.5 bg-emerald-400"></div>
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Titik Asal Sisa Proyek</p>
                                        <p className="text-[9px] font-black text-gray-900 mb-2">Jl. Pandanaran No. 42 (Gudang Anda)</p>
                                    </div>
                                    <div className="relative pl-5 my-1">
                                        <span className="bg-emerald-100 text-emerald-700 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider relative -left-1">0.7 KM Jalur Lorong Aman</span>
                                    </div>
                                    <div className="relative pl-5 mt-2">
                                        <div className="absolute left-0 top-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full shadow-sm z-10"></div>
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Tujuan Penyaluran</p>
                                        <p className="text-[9px] font-black text-gray-900">Gang RT 03 Candisari, Semarang</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <span className="bg-white/90 backdrop-blur text-emerald-700 text-[8px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm"><Leaf className="w-2.5 h-2.5"/> Hemat Emisi CO2e Logistik</span>
                                    <span className="bg-white/90 backdrop-blur text-yellow-700 text-[8px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm"><Truck className="w-2.5 h-2.5"/> Akses Tosa / Pikap RT</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-2.5 flex justify-between items-center border border-gray-100">
                                <span className="text-[10px] text-gray-600 font-medium flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400"/> Gerbang gang terbuka 24 jam untuk pengiriman</span>
                                <span className="text-[9px] font-black text-gray-900">Akses Mudah</span>
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 text-center">
                            <h3 className="text-[11px] font-black text-gray-900 mb-1 text-left">Langkah selanjutnya:</h3>
                            <p className="text-[10px] text-gray-500 leading-relaxed mb-5 text-left">
                                Tentukan jadwal kurir penjemputan gratis oleh armada Sisain atau pilih opsi antar mandiri bersama tim kontraktor Anda.
                            </p>

                            <button onClick={onNext} className="w-full bg-[#FFCC00] hover:bg-yellow-400 text-gray-900 text-xs font-black py-3.5 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm mb-3">
                                Salurkan ke Proyek Ini <ArrowRight className="w-4 h-4" />
                            </button>
                            <button onClick={onBack} className="w-full bg-[#FCF9F8] border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors mb-4">
                                <ArrowLeft className="w-4 h-4" /> Pilih Tujuan Lain di Matching
                            </button>

                            <p className="text-[9px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3" /> Konfirmasi ini mengamankan alokasi material selama 12 jam
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}