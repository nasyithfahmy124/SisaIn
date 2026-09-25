import React, { useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
    ArrowLeft, MapPin, Truck, CheckCircle2, 
    Circle, Check, Package, ShieldCheck, 
    Clock, ArrowRight
} from 'lucide-react';

// Pindahkan data statis ke luar komponen untuk mencegah re-render yang tidak perlu
const originCoords = [110.422, -7.025];
const destCoords = [110.427, -7.021];
const routeGeoJSON = {
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: [originCoords, destCoords]
    }
};

const CHECKLIST_ITEMS = [
    {
        id: 'kondisi',
        title: 'Kondisi Kering & Terlindung Cuaca',
        desc: 'Material 4 sak semen diletakkan di tempat beratap dan tidak bersentuhan langsung dengan lantai basah.'
    },
    {
        id: 'akses',
        title: 'Aksesibilitas Jalur Armada Siap',
        desc: 'Kemasan utuh tersegel dan akses gang dapat dilalui armada roda tiga / motor kargo tanpa halangan portal.'
    },
    {
        id: 'pic',
        title: 'Keberadaan PIC di Lokasi Penjemputan',
        desc: 'Budi Santoso atau perwakilan gudang berada di tempat saat jam penjemputan (14.00 - 16.00 WIB).'
    }
];

export default function KonfirmasiPengirimanDesktop({ finalData, projectData, onBack, onNext }) {
    const [metode, setMetode] = useState('dijemput');
    const [checklist, setChecklist] = useState({
        kondisi: true,
        akses: true,
        pic: true
    });

    const toggleChecklist = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isAllChecked = checklist.kondisi && checklist.akses && checklist.pic;

    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    return (
        <div className="min-h-screen bg-[#FCF9F8] font-sans pb-24">
            
            {/* Header & Back Button */}
            <div className="max-w-[1280px] mx-auto px-6 pt-8 mb-6">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    aria-label="Kembali ke halaman sebelumnya"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Kembali ke Detail Kebutuhan</span>
                </button>
                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Konfirmasi Pickup / Kirim</h1>
                <p className="text-[12px] font-medium text-gray-500 max-w-2xl leading-relaxed">
                    Tentukan metode serah-terima material surplus untuk memastikan rantai sirkulasi berjalan tepat waktu dan aman.
                </p>
            </div>

            {/* Main Grid Layout (40:60 Split) */}
            <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* KOLOM KIRI (Info Rute & Alokasi - Col 5) */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* Rute Distribusi Card */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[13px] font-black text-gray-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-600" /> Rute Distribusi Material
                            </h3>
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2.5 py-1 rounded-full">Radius Terdekat</span>
                        </div>

                        {/* Timeline Rute */}
                        <div className="relative pl-3 mb-6">
                            <div className="absolute left-[27px] top-4 bottom-8 w-[2px] bg-gray-200 border-l-2 border-dashed border-gray-300"></div>
                            
                            {/* Titik Asal */}
                            <div className="flex gap-4 mb-5 relative z-10">
                                <div className="w-8 h-8 bg-[#FFCC00] rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm mt-1">
                                    <Package className="w-3.5 h-3.5 text-gray-900" />
                                </div>
                                <div>
                                    <div className="flex gap-2 items-center mb-1">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dari (Lokasi Anda)</span>
                                        <span className="text-[8px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Titik Asal</span>
                                    </div>
                                    <h4 className="text-sm font-black text-gray-900">Gudang Candisari</h4>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Jl. Pandanaran No. 42, RT 02/RW 04, Candisari, Semarang</p>
                                </div>
                            </div>

                            {/* Info Jarak (Tengah Garis) */}
                            <div className="ml-10 mb-4 bg-gray-50 border border-gray-200 text-gray-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm relative z-10">
                                <span>0.7 km</span>
                                <span className="text-gray-300">•</span>
                                <span>Estimasi 4-6 Menit</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Lancar</span>
                            </div>

                            {/* Titik Tujuan */}
                            <div className="flex gap-4 relative z-10">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div>
                                    <div className="flex gap-2 items-center mb-1">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ke (Tujuan Alokasi)</span>
                                        <span className="text-[8px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">Fasum Prioritas</span>
                                    </div>
                                    <h4 className="text-sm font-black text-gray-900">Perbaikan Jalan Gang RT 03</h4>
                                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Kelurahan Candisari, Semarang Selatan (Patokan: Samping Pos Ronda RW 05)</p>
                                </div>
                            </div>
                        </div>

                        {/* Mini Map Route */}
                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                            <Map
                                initialViewState={{ longitude: 110.4245, latitude: -7.023, zoom: 14 }}
                                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                style={{ width: '100%', height: '100%' }}
                                interactive={false}
                            >
                                <Source id="route-mini" type="geojson" data={routeGeoJSON}>
                                    <Layer id="route-line-mini" type="line" paint={{ 'line-color': '#10B981', 'line-width': 3, 'line-dasharray': [2, 1] }} />
                                </Source>
                                <Marker longitude={originCoords[0]} latitude={originCoords[1]} anchor="center">
                                    <div className="w-3 h-3 bg-[#FFCC00] rounded-full border-2 border-gray-900"></div>
                                </Marker>
                                <Marker longitude={destCoords[0]} latitude={destCoords[1]} anchor="center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                </Marker>
                            </Map>
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-gray-800 text-[8px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm border border-gray-100">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Akses Tosa & Pikap Siaga
                            </div>
                            <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur text-white text-[8px] font-bold px-2 py-1 rounded shadow-sm border border-gray-700">
                                Jalur Gang Lebar 3.2m
                            </div>
                        </div>
                    </div>

                    {/* Material & Alokasi Card */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-[12px] font-black text-gray-900">Material & Alokasi Surplus</h3>
                            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3"/> Terverifikasi RM & Tim SISAIN
                            </span>
                        </div>

                        <div className="flex gap-4 items-center mb-6">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e" alt="Semen" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Semen & Perekat Konstruksi</p>
                                <h4 className="text-sm font-black text-gray-900 mb-0.5">Semen Portland PCC</h4>
                                <p className="text-[9px] text-gray-500 mb-2">Grade A Kering & Siap Pakai (Kemasan Tersegel)</p>
                                <span className="bg-[#FFFAEB] text-yellow-800 border border-yellow-200 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                                    <Package className="w-3 h-3"/> Total Inventaris: ±160 kg (4 Sak)
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar Alokasi */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="flex items-center gap-1.5 text-gray-700"><span className="w-2 h-2 bg-[#FFCC00] rounded-full"></span> Kebutuhan Proyek RT 03:</span>
                                <span className="text-gray-900 font-black">120 kg (3 Sak)</span>
                            </div>
                            <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100">
                                <div className="bg-[#FFCC00] h-full" style={{ width: '75%' }}></div>
                                <div className="bg-emerald-500 h-full" style={{ width: '25%' }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Cadangan Terjadwal (Fasum Terdekat):</span>
                                <span className="text-emerald-700 font-black">40 kg (1 Sak)</span>
                            </div>
                        </div>
                        
                        <p className="text-[9px] text-gray-500 leading-relaxed italic border-t border-gray-100 pt-3">
                            *Alokasi 1 sak surplus cadangan disimpan di Hub Logistik RW 05 untuk penambalan saluran air preventif.
                        </p>
                    </div>
                </div>

                {/* KOLOM KANAN (Metode Pengiriman & Form - Col 7) */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Pilih Cara Serah-Terima */}
                    <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-base font-black text-gray-900 mb-1">Pilih Cara Serah-Terima</h3>
                                <p className="text-[11px] font-medium text-gray-500">Pilih opsi paling praktis sesuai ketersediaan waktu dan armada Anda.</p>
                            </div>
                            <Truck className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="space-y-4">
                            {/* Opsi 1: Dijemput */}
                            <div 
                                onClick={() => setMetode('dijemput')}
                                onKeyDown={(e) => handleKeyDown(e, () => setMetode('dijemput'))}
                                role="button"
                                tabIndex={0}
                                aria-pressed={metode === 'dijemput'}
                                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 border-2 outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] ${
                                    metode === 'dijemput' ? 'bg-[#FFFDF5] border-[#FFCC00] shadow-[0_4px_15px_rgba(255,204,0,0.1)]' : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${metode === 'dijemput' ? 'bg-[#FFCC00] text-gray-900 shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-0.5">
                                                Dijemput <span className="bg-[#FFCC00] text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded-full">Rekomendasi Bebas Repot</span>
                                            </h4>
                                            <p className="text-[10px] text-gray-500">SISAIN / mitra penjemputan mengambil material langsung dari lokasi kamu.</p>
                                        </div>
                                    </div>
                                    {metode === 'dijemput' ? (
                                        <div className="w-5 h-5 bg-[#FFCC00] rounded-full flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3}/></div>
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-300 shrink-0" strokeWidth={1.5}/>
                                    )}
                                </div>

                                {metode === 'dijemput' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white rounded-xl p-3 border border-yellow-100 shadow-sm">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimasi Waktu Penjemputan</p>
                                                <p className="text-[11px] font-black text-gray-900 flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5 text-yellow-600"/> Hari Ini, 14:00 - 16:00 WIB</p>
                                                <p className="text-[9px] font-bold text-emerald-600">Kurir Siaga di Radius Candisari</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-3 border border-yellow-100 shadow-sm">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Armada & Personel</p>
                                                <p className="text-[11px] font-black text-gray-900 flex items-center gap-1.5 mb-1"><Truck className="w-3.5 h-3.5 text-yellow-600"/> Tiga Roda Sisain EcoLogistica</p>
                                                <p className="text-[9px] text-gray-500">Driver: Mas Heru Santoso (+ 1 tim)</p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-yellow-100 shadow-sm mb-4">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><MapPin className="w-3.5 h-3.5 text-gray-400"/> Alamat Titik Muat Penjemputan</p>
                                            <p className="text-[11px] font-black text-gray-900 mb-0.5">Jl. Pandanaran No. 42 (Gudang Kontraktor / Depan Pagar Hijau)</p>
                                            <p className="text-[10px] text-gray-500">Kontak PIC Lapangan: Budi Santoso (+62 812-3456-7890)</p>
                                        </div>
                                        <div className="bg-[#E6F4EA] rounded-lg p-2.5 flex items-start gap-2 border border-emerald-100">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-bold text-emerald-800 leading-relaxed">
                                                Fasilitas Bebas Biaya: Bantuan angkut 2 relawan lokal swadaya RW sudah termasuk untuk memindahkan semen ke bak motor listrik.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Opsi 2: Kirim Sendiri */}
                            <div 
                                onClick={() => setMetode('kirim_sendiri')}
                                onKeyDown={(e) => handleKeyDown(e, () => setMetode('kirim_sendiri'))}
                                role="button"
                                tabIndex={0}
                                aria-pressed={metode === 'kirim_sendiri'}
                                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 border-2 outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] ${
                                    metode === 'kirim_sendiri' ? 'bg-[#FFFDF5] border-[#FFCC00] shadow-[0_4px_15px_rgba(255,204,0,0.1)]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${metode === 'kirim_sendiri' ? 'bg-[#FFCC00] text-gray-900 shadow-sm' : 'bg-gray-200 text-gray-500'}`}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-0.5">
                                                Kirim Sendiri <span className="bg-gray-200 text-gray-600 text-[8px] font-bold px-2 py-0.5 rounded-full">Mandiri</span>
                                            </h4>
                                            <p className="text-[10px] text-gray-500">Kamu mengantarkan langsung material ke posko tujuan proyek.</p>
                                        </div>
                                    </div>
                                    {metode === 'kirim_sendiri' ? (
                                        <div className="w-5 h-5 bg-[#FFCC00] rounded-full flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3}/></div>
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-300 shrink-0" strokeWidth={1.5}/>
                                    )}
                                </div>
                                {metode === 'kirim_sendiri' && (
                                    <div className="mt-4 pt-4 border-t border-yellow-200 text-[10px] text-gray-600 flex items-center gap-1.5 animate-in fade-in duration-300">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        Tujuan: Posko Swadaya RT 03 Candisari - Jarak 0.7 km - Diterima s/d 17.30 WIB
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pastikan Material Siap Diserahkan */}
                    <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-black text-gray-900 mb-5 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Pastikan Material Siap Diserahkan
                        </h3>

                        <div className="space-y-3 mb-6">
                            {CHECKLIST_ITEMS.map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => toggleChecklist(item.id)}
                                    onKeyDown={(e) => handleKeyDown(e, () => toggleChecklist(item.id))}
                                    role="checkbox"
                                    aria-checked={checklist[item.id]}
                                    tabIndex={0}
                                    className="bg-gray-50 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]"
                                >
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checklist[item.id] ? 'bg-[#FFCC00]' : 'bg-white border-2 border-gray-300'}`}>
                                        {checklist[item.id] && <Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3}/>}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#E6F4EA] rounded-xl p-4 flex items-start gap-3 border border-emerald-100">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-900 mb-1">Jaminan Logistik Sirkular SISAIN</h4>
                                <p className="text-[9px] text-emerald-800 leading-relaxed font-medium">
                                    Pengangkutan dilindungi asuransi keselamatan material konstruksi surplus. Setiap kilogram semen yang berpindah tangan langsung tercatat dalam audit transparansi pengurangan emisi semen nasional.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="bg-white rounded-[24px] p-5 flex justify-between items-center shadow-sm border border-gray-100">
                        <button 
                            onClick={onBack}
                            className="text-[11px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-2 px-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded"
                        >
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Detail Kebutuhan
                        </button>
                        
                        <button 
                            onClick={() => onNext({ metode, checklist })}
                            disabled={!isAllChecked}
                            className={`px-6 py-3.5 rounded-full text-xs font-black flex items-center gap-2 transition-all outline-none focus-visible:ring-4 focus-visible:ring-yellow-200 ${
                                isAllChecked 
                                ? 'bg-[#FFCC00] hover:bg-yellow-400 text-gray-900 shadow-md active:scale-95' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Konfirmasi Pengiriman <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}