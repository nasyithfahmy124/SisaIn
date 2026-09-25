import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
    ArrowLeft, MapPin, Truck, CheckCircle2, 
    Package, Clock, Phone, MessageCircle, 
    ShieldCheck, Navigation, MoreHorizontal
} from 'lucide-react';

export default function LacakPengirimanDesktop({ onBack }) {
    // Data Simulasi Koordinat
    const originCoords = [110.422, -7.025]; // Gudang Anda
    const destCoords = [110.427, -7.021];   // Proyek RT 03
    
    // State untuk posisi kurir (simulasi pergerakan)
    const [courierCoords, setCourierCoords] = useState([110.423, -7.024]);

    // Data Simulasi Garis Rute (GeoJSON)
    const routeGeoJSON = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [originCoords, [110.423, -7.024], [110.4245, -7.023], [110.426, -7.022], destCoords]
        }
    };

    // Simulasi pergerakan kurir sederhana
    useEffect(() => {
        const timer = setTimeout(() => {
            setCourierCoords([110.4245, -7.023]); // Pindah ke titik tengah rute setelah 2 detik
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const trackingHistory = [
        {
            id: 1,
            status: "Kurir SISAIN sedang menuju lokasi penjemputan",
            location: "Jl. Tentara Pelajar, Semarang",
            time: "14:15 WIB",
            isLatest: true,
            icon: Truck
        },
        {
            id: 2,
            status: "Sistem telah menugaskan armada logistik",
            location: "Hub Logistik RW 05",
            time: "14:05 WIB",
            isLatest: false,
            icon: ShieldCheck
        },
        {
            id: 3,
            status: "Reservasi material berhasil dikonfirmasi",
            location: "Sistem SISAIN",
            time: "14:00 WIB",
            isLatest: false,
            icon: CheckCircle2
        }
    ];

    return (
        <div className="min-h-screen bg-[#FCF9F8] font-sans pb-10 flex flex-col">
            
            {/* Header / Top Navigation */}
            <div className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center z-40 sticky top-0 shadow-sm">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Kembali ke Beranda</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-500">ID Lacak:</span>
                    <span className="bg-gray-100 text-gray-900 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-md border border-gray-200">
                        SNC-8827361920
                    </span>
                </div>
            </div>

            {/* Layout Utama */}
            <div className="flex-1 max-w-[1400px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]">
                
                {/* KOLOM KIRI (PETA LIVE TRACKING) - Col 7 */}
                <div className="lg:col-span-7 bg-gray-100 rounded-[32px] overflow-hidden border border-gray-200 shadow-sm relative">
                    <Map
                        initialViewState={{ longitude: 110.4245, latitude: -7.023, zoom: 15 }}
                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* Garis Rute (Solid untuk yang sudah dilewati, Dashed untuk sisa rute) */}
                        <Source id="route-line" type="geojson" data={routeGeoJSON}>
                            <Layer 
                                id="route-layer" 
                                type="line" 
                                paint={{ 'line-color': '#10B981', 'line-width': 4, 'line-dasharray': [2, 1.5] }} 
                            />
                        </Source>

                        {/* Marker: Titik Jemput (Asal) */}
                        <Marker longitude={originCoords[0]} latitude={originCoords[1]} anchor="center">
                            <div className="relative flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-[3px] border-[#FFCC00] shadow-md z-10">
                                    <Package className="w-4 h-4 text-gray-900" />
                                </div>
                                <div className="absolute top-10 bg-white/90 backdrop-blur text-[8px] font-black text-gray-900 px-2 py-1 rounded shadow-sm border border-gray-200 whitespace-nowrap">
                                    Titik Jemput Anda
                                </div>
                            </div>
                        </Marker>

                        {/* Marker: Titik Antar (Tujuan) */}
                        <Marker longitude={destCoords[0]} latitude={destCoords[1]} anchor="center">
                            <div className="relative flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-[3px] border-red-500 shadow-md z-10">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                </div>
                                <div className="absolute top-10 bg-white/90 backdrop-blur text-[8px] font-black text-red-600 px-2 py-1 rounded shadow-sm border border-red-100 whitespace-nowrap">
                                    Proyek RT 03
                                </div>
                            </div>
                        </Marker>

                        {/* Marker: Kurir Bergerak */}
                        <Marker 
                            longitude={courierCoords[0]} 
                            latitude={courierCoords[1]} 
                            anchor="center"
                            style={{ transition: 'all 2s ease-in-out' }} // Efek pergerakan halus
                        >
                            <div className="relative flex flex-col items-center">
                                {/* Tooltip Kurir */}
                                <div className="bg-gray-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-full mb-1 shadow-lg flex items-center gap-1.5 border border-gray-700 whitespace-nowrap animate-bounce">
                                    <Truck className="w-3 h-3 text-[#FFCC00]" />
                                    Tiga Roda SISAIN
                                </div>
                                {/* Ikon Kendaraan */}
                                <div className="w-6 h-6 bg-[#FFCC00] rounded-full border-[3px] border-white shadow-xl flex items-center justify-center z-20 relative">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                    {/* Efek Ping (Riak air) */}
                                    <div className="absolute inset-0 bg-[#FFCC00] rounded-full animate-ping opacity-75"></div>
                                </div>
                            </div>
                        </Marker>
                    </Map>

                    {/* Overlay Info di atas Peta */}
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur rounded-[20px] p-4 shadow-lg border border-gray-100 max-w-[250px]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Tracking Aktif</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">Kurir sedang di jalan</h3>
                        <p className="text-[10px] text-gray-500 mt-1">Estimasi tiba di lokasi penjemputan dalam <strong className="text-gray-900">8 Menit</strong></p>
                    </div>

                    <div className="absolute bottom-6 right-6">
                        <button className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-50 border border-gray-100 flex items-center justify-center transition-transform active:scale-95">
                            <Navigation className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* KOLOM KANAN (INFO KURIR & TIMELINE) - Col 5 */}
                <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-6">
                    
                    {/* Kartu Profil Kurir */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Informasi Penjemputan</p>
                        
                        <div className="flex items-center gap-4 mb-5">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-100 p-0.5">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" alt="Kurir" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-[#FFCC00] p-1 rounded-full border-2 border-white">
                                    <ShieldCheck className="w-2 h-2 text-gray-900" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-black text-gray-900 mb-0.5">Budi Santoso</h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded">Tossa Cargo (Motor Roda 3)</span>
                                    <span className="text-[10px] font-black text-gray-900">H 4567 XYZ</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-[#E6F4EA] hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-emerald-200/50">
                                <MessageCircle className="w-4 h-4" /> Chat Kurir
                            </button>
                            <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-800 text-[11px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200">
                                <Phone className="w-4 h-4" /> Telepon
                            </button>
                        </div>
                    </div>

                    {/* Kartu Material */}
                    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e" alt="Material" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black text-gray-900 mb-0.5">Semen Portland PCC (4 Sak)</h4>
                                <p className="text-[9px] text-gray-500">Akan dijemput dari: Gudang Anda</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-900">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Timeline Pelacakan */}
                    <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100 flex-1">
                        <h3 className="text-sm font-black text-gray-900 mb-6">Status Perjalanan</h3>
                        
                        <div className="relative">
                            {trackingHistory.map((item, index) => {
                                const Icon = item.icon;
                                const isLast = index === trackingHistory.length - 1;

                                return (
                                    <div key={item.id} className="flex gap-4 relative pb-8">
                                        {/* Garis Vertikal */}
                                        {!isLast && (
                                            <div className="absolute top-8 left-4 bottom-0 w-[2px] bg-gray-100 -translate-x-1/2 z-0"></div>
                                        )}

                                        {/* Node / Ikon */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] ${
                                                item.isLatest 
                                                    ? 'bg-[#FFCC00] border-white shadow-md text-gray-900' 
                                                    : 'bg-white border-gray-200 text-gray-400'
                                            }`}>
                                                <Icon className="w-3.5 h-3.5" />
                                            </div>
                                        </div>

                                        {/* Teks Status */}
                                        <div className={`flex-1 pt-1 ${item.isLatest ? 'text-gray-900' : 'text-gray-500'}`}>
                                            <p className={`text-[11px] leading-tight mb-1 ${item.isLatest ? 'font-black' : 'font-bold'}`}>
                                                {item.status}
                                            </p>
                                            <p className="text-[9px] text-gray-400 font-medium flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" /> {item.time} • {item.location}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}