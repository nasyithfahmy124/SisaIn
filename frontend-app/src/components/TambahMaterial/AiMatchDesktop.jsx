import React, { useState, useMemo } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
    ArrowLeft, MapPin, Map as MapIcon, List, 
    Zap, CheckCircle2, AlertTriangle, ShieldCheck, 
    ArrowRight, Eye, Info, Clock, Check
} from 'lucide-react';

// Fungsi helper untuk menggambar radius lingkaran (tanpa library tambahan)
const createGeoJSONCircle = (center, radiusInKm, points = 64) => {
    const coords = { latitude: center[1], longitude: center[0] };
    const km = radiusInKm;
    const ret = [];
    const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]); // Tutup polygon

    return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [ret] }
    };
};

export default function AiMatchDesktop({ finalData, onBack }) {
    const [radius, setRadius] = useState(5);
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

    // Koordinat Material (Pusat) - Candisari, Semarang
    const centerLngLat = [110.422, -7.025]; 

    // Data GeoJSON untuk lingkaran radius
    const radiusGeoJSON = useMemo(() => createGeoJSONCircle(centerLngLat, radius), [radius]);

    return (
        <div className="min-h-screen bg-[#FCF9F8] font-sans pb-20">
            
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-40">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold">Kembali ke Pilih Tujuan</span>
                </button>
                <div className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" /> ID : RTC - 2026 - 699X
                </div>
            </div>

            <div className="max-w-[1350px] mx-auto px-6 mt-6">
                
                {/* Header Filter & Info Bar */}
                <div className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 relative">
                            <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e" alt="Material" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-[#FFCC00] text-gray-900 text-[9px] font-black px-2 py-0.5 rounded-sm">Terkurasi AI</span>
                                <h3 className="text-sm font-black text-gray-900">Semen Portland PCC</h3>
                            </div>
                            <p className="text-[10px] font-medium text-gray-500">±160kg (4 Sak) • Grade A • Candisari, Semarang</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Radius:</span>
                            <div className="flex gap-1.5 bg-gray-50 p-1 rounded-full border border-gray-200">
                                {[1, 3, 5, 10].map(r => (
                                    <button 
                                        key={r}
                                        onClick={() => setRadius(r)}
                                        className={`text-[10px] font-black px-3 py-1 rounded-full transition-colors ${radius === r ? 'bg-[#FFCC00] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {r}km
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-[1px] h-8 bg-gray-200"></div>

                        <div className="flex gap-2">
                            <button className="bg-white text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5 shadow-sm">
                                <MapIcon className="w-3.5 h-3.5" /> Map View
                            </button>
                            <button className="bg-gray-50 text-gray-500 hover:text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-md border border-transparent hover:border-gray-200 flex items-center gap-1.5 transition-colors">
                                <List className="w-3.5 h-3.5" /> List View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* KOLOM KIRI: MAP VIEW (Col 7) */}
                    <div className="lg:col-span-7 h-[800px] flex flex-col gap-4">
                        <div className="flex-1 bg-gray-100 rounded-[24px] overflow-hidden shadow-sm border border-gray-200 relative">
                            
                            <Map
                                initialViewState={{ longitude: 110.422, latitude: -7.025, zoom: 13.5 }}
                                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                style={{ width: '100%', height: '100%' }}
                            >
                                {/* Layer Radius Lingkaran */}
                                <Source id="radius-source" type="geojson" data={radiusGeoJSON}>
                                    <Layer 
                                        id="radius-fill" 
                                        type="fill" 
                                        paint={{ 'fill-color': '#FFCC00', 'fill-opacity': 0.05 }} 
                                    />
                                    <Layer 
                                        id="radius-line" 
                                        type="line" 
                                        paint={{ 'line-color': '#FFCC00', 'line-width': 1.5, 'line-dasharray': [4, 4] }} 
                                    />
                                </Source>

                                {/* Pusat: Material Anda */}
                                <Marker longitude={110.422} latitude={-7.025} anchor="bottom">
                                    <div className="bg-gray-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap transform -translate-y-2 border border-gray-700">
                                        <span className="w-2 h-2 bg-[#FFCC00] rounded-full"></span> Material Anda (Jl. Pandanaran 42)
                                    </div>
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-900 mx-auto transform -translate-y-2"></div>
                                </Marker>

                                {/* Marker 1: Rekomendasi Utama (Kuning) */}
                                <Marker longitude={110.427} latitude={-7.021} anchor="bottom">
                                    <div className="bg-[#FFCC00] text-gray-900 text-[9px] px-3 py-1.5 rounded-xl shadow-lg border border-yellow-400 flex flex-col items-center whitespace-nowrap transform -translate-y-2 relative z-10">
                                        <span className="font-black flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> 98% COCOK - 0.7 km</span>
                                        <span className="font-medium">Perbaikan Jalan RT 03 (120 kg)</span>
                                    </div>
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#FFCC00] mx-auto transform -translate-y-2"></div>
                                </Marker>

                                {/* Marker 2: Hijau 89% */}
                                <Marker longitude={110.413} latitude={-7.018} anchor="bottom">
                                    <div className="bg-white text-gray-800 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-gray-200 whitespace-nowrap transform -translate-y-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 89% Match <span className="text-gray-400 font-medium">- 1.4 km</span>
                                    </div>
                                </Marker>

                                {/* Marker 3: Hijau 76% */}
                                <Marker longitude={110.432} latitude={-7.035} anchor="bottom">
                                    <div className="bg-white text-gray-800 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-gray-200 whitespace-nowrap transform -translate-y-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 76% Match <span className="text-gray-400 font-medium">- 2.1 km</span>
                                    </div>
                                </Marker>
                            </Map>

                            {/* Overlays on Map */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                <MapPin className="w-3 h-3 text-emerald-600" /> Semarang Selatan & Barat
                            </div>

                            <div className="absolute top-4 right-4 flex bg-white/90 backdrop-blur rounded-full p-1 shadow-sm border border-gray-100">
                                <button className="bg-gray-900 text-white text-[9px] font-black px-3 py-1 rounded-full">Logistik</button>
                                <button className="text-gray-600 text-[9px] font-bold px-3 py-1 rounded-full hover:bg-gray-100">Topografi</button>
                            </div>

                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl p-3 flex items-center gap-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-700"><span className="w-2 h-2 bg-gray-900 rounded-full"></span> Material Anda</div>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-700"><span className="w-2 h-2 bg-[#FFCC00] rounded-full"></span> Rekomendasi Utama</div>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-700"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Fasum Siap Terima</div>
                            </div>
                        </div>

                        {/* Bottom Summary Bar */}
                        <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm border border-gray-100">
                            <p className="text-[10px] font-medium text-gray-600 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-yellow-600" /> Menghubungkan 3 titik kebutuhan riil dengan rute pick-up armada terpendek.
                            </p>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-md border border-emerald-100">Hemat 6.2 kg CO₂e</span>
                        </div>
                    </div>

                    {/* KOLOM KANAN: LIST MATCHES (Col 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-5 h-[800px] overflow-y-auto hide-scrollbar pr-2 pb-10">
                        
                        {/* List Header */}
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-yellow-700 uppercase tracking-widest">
                                    <Zap className="w-3.5 h-3.5" /> Algoritma Distribusi Presisi
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded border border-gray-200">Tersinkron AI</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Material yang cocok ditemukan</h2>
                            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                                Terdapat 3 proyek publik & fasum aktif yang membutuhkan semen Anda dalam radius {radius} km saat ini.
                            </p>
                        </div>

                        {/* Card 1: Rekomendasi Utama */}
                        <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(255,204,0,0.1)] border-2 border-[#FFCC00]">
                            <div className="flex gap-2 mb-4">
                                <span className="bg-[#FFCC00] text-gray-900 text-[8px] font-black px-2 py-1 rounded flex items-center gap-1"><Zap className="w-3 h-3"/> Rekomendasi Utama</span>
                                <span className="bg-red-50 text-red-600 text-[8px] font-bold px-2 py-1 rounded border border-red-100">Urgensi Fasum</span>
                                <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> RW 03 Forum Warga</span>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">Perbaikan Jalan Gang RT 03</h3>
                                    <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 text-red-500" /> 0.7 km dari lokasi Anda <span className="text-gray-300">•</span> Butuh: 120 kg Semen (3 Sak)
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-[#FFCC00] rounded-full flex flex-col items-center justify-center shrink-0 shadow-sm">
                                    <span className="text-sm font-black leading-none">98%</span>
                                    <span className="text-[6px] font-black tracking-wider mt-0.5">COCOK</span>
                                </div>
                            </div>

                            <div className="relative w-full h-32 rounded-xl overflow-hidden mb-5">
                                <img src="https://images.unsplash.com/photo-1541888081682-1981a8b1d9db?auto=format&fit=crop&q=80&w=800" alt="Proyek" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                    <p className="text-white text-[9px] font-medium flex items-center gap-1.5"><Clock className="w-3 h-3"/> Dokumentasi survei lapangan oleh tim relawan lokal (Budi W., 14:20 WIB)</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mb-2.5">Analisis Keselarasan AI:</p>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Material sesuai (PCC Grade A)</div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Jumlah cukup (120/160 kg)</div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Radius dekat (&lt; 1 km)</div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Tim serah terima siap</div>
                                </div>
                            </div>

                            <div className="bg-[#F0FDF4] border border-emerald-100 rounded-lg p-3 flex gap-2 mb-5">
                                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                                <p className="text-[9px] text-emerald-800 leading-relaxed"><strong className="font-black">Dampak Nyata:</strong> Menutup jalan amblas 45 meter sehingga lansia dan 42 warga bebas dari genangan saat hujan tiba.</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => onNext({ id: 1, title: 'Perbaikan Jalan RT 03' })} className="flex-[2] bg-[#FFCC00] hover:bg-yellow-400 text-gray-900 text-xs font-black py-3.5 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm">
                                    Pilih Kebutuhan Ini <ArrowRight className="w-4 h-4" />
                                </button>
                                <button className="flex-[1] bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold py-3.5 rounded-full flex items-center justify-center gap-1.5 transition-colors">
                                    <Eye className="w-3.5 h-3.5" /> Detail
                                </button>
                            </div>
                        </div>

                        {/* Card 2: 89% */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-2">
                                    <span className="bg-gray-100 text-gray-600 text-[8px] font-bold px-2 py-1 rounded">Fasilitas Ibadah</span>
                                    <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> DKM Terverifikasi</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-gray-900 leading-none">89%</span>
                                    <p className="text-[6px] font-black tracking-wider text-gray-400">COCOK</p>
                                </div>
                            </div>

                            <h3 className="text-base font-black text-gray-900 leading-tight mb-1">Renovasi Tempat Wudhu Musala Al-Ikhlas</h3>
                            <p className="text-[10px] font-medium text-gray-500 mb-4">
                                <span className="font-bold text-gray-700">1.4 km</span> <span className="text-gray-300 mx-1">•</span> Butuh: 160 kg (4 Sak penuh)
                            </p>

                            <div className="flex gap-4 mb-5">
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700"><Check className="w-3 h-3"/> Material pas (100%)</div>
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700"><Check className="w-3 h-3"/> Radius aman</div>
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700"><Check className="w-3 h-3"/> Siap jemput armada</div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-[9px] text-gray-500 font-medium">Penyaluran langsung dalam 24 jam</span>
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold px-5 py-2 rounded-full transition-colors">Pilih Proyek Ini</button>
                            </div>
                        </div>

                        {/* Card 3: 76% */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-2">
                                    <span className="bg-gray-100 text-gray-600 text-[8px] font-bold px-2 py-1 rounded">Keamanan Lingkungan</span>
                                    <span className="text-gray-500 text-[8px] font-medium py-1">RW 08 Terverifikasi</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-gray-900 leading-none">76%</span>
                                    <p className="text-[6px] font-black tracking-wider text-gray-400">COCOK</p>
                                </div>
                            </div>

                            <h3 className="text-base font-black text-gray-900 leading-tight mb-1">Pembuatan Saluran Air Pos Ronda RT 08</h3>
                            <p className="text-[10px] font-medium text-gray-500 mb-4">
                                <span className="font-bold text-gray-700">2.1 km</span> <span className="text-gray-300 mx-1">•</span> Butuh: 80 kg (2 Sak)
                            </p>

                            <div className="flex gap-4 mb-5">
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700"><Check className="w-3 h-3"/> Material cocok</div>
                                <div className="flex items-center gap-1 text-[9px] font-medium text-gray-500"><AlertTriangle className="w-3 h-3 text-yellow-500"/> Sisa 80 kg dialihkan ke Bank Material Sisain</div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-[9px] text-gray-500 font-medium">Penjadwalan diminta penjaga</span>
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold px-5 py-2 rounded-full transition-colors">Pilih Proyek Ini</button>
                            </div>
                        </div>

                        <button className="w-full bg-[#FCF9F8] border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors mt-2">
                            <MapPin className="w-3.5 h-3.5" /> Cari Kebutuhan Lain di Luar Radius {radius} km
                        </button>

                        <div className="bg-[#F9F8F6] rounded-xl p-4 flex gap-3 items-start mt-2">
                            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-gray-500 leading-relaxed">
                                Pilihan ini menghubungkan material dengan kebutuhan proyek sosial yang telah disurvei. Jadwal penjemputan gratis oleh armada Sisain dikonfirmasi otomatis di langkah selanjutnya.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}