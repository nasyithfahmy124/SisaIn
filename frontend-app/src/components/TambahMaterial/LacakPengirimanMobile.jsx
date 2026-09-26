import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
    ChevronLeft, Copy, Headset, MapPin, 
    Truck, CheckCircle2, Clock, Package
} from 'lucide-react';

const originCoords = [110.422, -7.025];
const destCoords = [110.427, -7.021];
const currentTruckCoords = [110.4245, -7.023]; // Posisi kurir saat ini

const routeGeoJSON = {
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: [originCoords, currentTruckCoords, destCoords]
    }
};

const routePassedGeoJSON = {
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: [originCoords, currentTruckCoords]
    }
};

export default function LacakPengirimanMobile({ trackingId, onBack }) {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    
    const resi = trackingId || 'SNC-88291038472';

    const handleCopy = () => {
        navigator.clipboard.writeText(resi);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        if (onBack) onBack();
        else navigate('/beranda');
    };

    const trackingHistory = [
        {
            time: '14:30',
            date: '26 Sep',
            title: 'Material dalam Perjalanan',
            desc: 'Kurir SISAIN (Mas Heru) sedang menuju ke Proyek Jalan Gang RT 03.',
            active: true,
            icon: Truck
        },
        {
            time: '14:15',
            date: '26 Sep',
            title: 'Material Telah Dijemput',
            desc: '4 Sak Semen PCC telah dipindah tangankan dari Gudang Candisari.',
            active: false,
            icon: Package
        },
        {
            time: '13:50',
            date: '26 Sep',
            title: 'Kurir Menuju Titik Pickup',
            desc: 'Armada Motor Roda Tiga sedang menuju lokasi Anda.',
            active: false,
            icon: MapPin
        },
        {
            time: '13:45',
            date: '26 Sep',
            title: 'Distribusi Dijadwalkan',
            desc: 'Menunggu penugasan armada SISAIN terdekat.',
            active: false,
            icon: Clock
        }
    ];

    return (
        <div className="bg-[#FAF9F7] min-h-screen font-sans text-gray-900 flex flex-col relative">
            
            {/* Header Mengambang di atas Peta */}
            <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <button onClick={handleBack} className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-gray-900">
                    <ChevronLeft className="w-5 h-5" /> 
                    <span className="text-[13px]">Lacak Distribusi</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <Headset className="w-4 h-4" />
                </button>
            </div>

            {/* Bagian Peta (Setengah Layar Atas) */}
            <div className="h-[45vh] w-full relative bg-gray-200">
                <Map
                    initialViewState={{ longitude: 110.4245, latitude: -7.023, zoom: 14.5 }}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    style={{ width: '100%', height: '100%' }}
                    interactive={true}
                >
                    {/* Garis Rute Keseluruhan */}
                    <Source id="route" type="geojson" data={routeGeoJSON}>
                        <Layer id="route-line" type="line" paint={{ 'line-color': '#E5E7EB', 'line-width': 4, 'line-dasharray': [2, 1] }} />
                    </Source>

                    {/* Garis Rute Yang Sudah Dilewati */}
                    <Source id="route-passed" type="geojson" data={routePassedGeoJSON}>
                        <Layer id="route-line-passed" type="line" paint={{ 'line-color': '#10B981', 'line-width': 4 }} />
                    </Source>

                    {/* Marker Asal (Material) */}
                    <Marker longitude={originCoords[0]} latitude={originCoords[1]} anchor="center">
                        <div className="w-4 h-4 bg-gray-900 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                    </Marker>

                    {/* Marker Tujuan (Proyek) */}
                    <Marker longitude={destCoords[0]} latitude={destCoords[1]} anchor="bottom">
                        <div className="text-red-500 flex flex-col items-center">
                            <MapPin className="w-7 h-7 fill-red-50" strokeWidth={2} />
                        </div>
                    </Marker>

                    {/* Marker Kurir Aktif */}
                    <Marker longitude={currentTruckCoords[0]} latitude={currentTruckCoords[1]} anchor="center">
                        <div className="bg-[#FFCC00] p-1.5 rounded-full border-2 border-white shadow-lg animate-pulse">
                            <Truck className="w-4 h-4 text-gray-900" />
                        </div>
                    </Marker>
                </Map>
            </div>

            {/* Panel Informasi Bawah (Bottom Sheet) */}
            <div className="relative z-30 flex-1 bg-white rounded-t-[32px] mt-[-24px] shadow-[0_-8px_25px_rgba(0,0,0,0.06)] px-5 pt-6 pb-8 border-t border-gray-100 flex flex-col">
                
                {/* Garis Tarik */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto absolute top-2.5 left-1/2 -translate-x-1/2"></div>

                {/* Card Estimasi & Kurir */}
                <div className="bg-[#FFFDF5] border border-yellow-200 rounded-2xl p-4 mb-5 shadow-sm">
                    <h3 className="text-xs font-black text-gray-900 mb-1">Estimasi Tiba: Hari ini, 14:45 WIB</h3>
                    <p className="text-[10px] text-gray-600 mb-3">Motor Roda Tiga SISAIN - Mas Heru (B 1234 XYZ)</p>
                    
                    <div className="flex items-center justify-between border-t border-yellow-100 pt-3">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">No. Resi SISAIN</span>
                            <span className="text-[11px] font-black text-gray-900">{resi}</span>
                        </div>
                        <button onClick={handleCopy} className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md">
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Disalin' : 'SALIN'}
                        </button>
                    </div>
                </div>

                <h3 className="text-xs font-black text-gray-900 mb-4 px-1">Riwayat Perjalanan</h3>

                {/* Timeline Pengiriman */}
                <div className="flex-1 overflow-y-auto px-1 hide-scrollbar">
                    <div className="relative border-l-2 border-gray-100 ml-4 space-y-6 pb-4">
                        {trackingHistory.map((item, idx) => (
                            <div key={idx} className="relative pl-6">
                                {/* Ikon Node */}
                                <div className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${item.active ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <item.icon className="w-3 h-3" />
                                </div>
                                
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className={`text-[11px] font-black ${item.active ? 'text-emerald-700' : 'text-gray-800'}`}>
                                            {item.title}
                                        </h4>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed mb-1">{item.desc}</p>
                                    <span className="text-[9px] font-bold text-gray-400">{item.date}, {item.time} WIB</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}