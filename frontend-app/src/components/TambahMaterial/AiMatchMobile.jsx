import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, List, Map as MapIcon, Navigation } from 'lucide-react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function AIMatchMobile() {
    const navigate = useNavigate();
    const [selectedRadius, setSelectedRadius] = useState('5km');
    const [viewMode, setViewMode] = useState('map');
    const [selectedMatch, setSelectedMatch] = useState(0);
    const [viewState, setViewState] = useState({ latitude: -6.9758, longitude: 110.3951, zoom: 13 });

    const matches = [
        {
            id: 1,
            title: 'Perbaikan Jalan Gang RT 03',
            matchRate: '98%',
            urgent: true,
            verified: true,
            distance: '0.7 km',
            requirement: 'Butuh 120 kg (3 Sak)',
            desc: 'Material sesuai standar: Semen PCC. Volume pas: Sisa 40 kg dapat dialihkan ke pos lain. Radius sangat dekat: 0.7 km (±4 menit). Koordinator aktif & siap jemput langsung.',
            image: 'https://images.unsplash.com/photo-1584467735811-628d014f1632?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 2,
            title: 'Renovasi Wudhu Musala Al-Ikhlas',
            matchRate: '89%',
            urgent: false,
            verified: false,
            distance: '1.4 km',
            requirement: 'Butuh 80 kg semen',
            desc: 'Siap jemput sore ini langsung ke lokasi.',
            image: null
        }
    ];

    const handleSelectMatch = () => {
        alert(`Berhasil memilih kebutuhan: ${matches[selectedMatch].title}`);
        navigate('/redistribusi');
    };

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-28 font-sans text-gray-900 relative">
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-bold text-gray-800 hover:text-gray-900">
                    <ChevronLeft className="w-5 h-5" /> Kembali
                </button>
                <h2 className="text-xs font-black text-gray-900">Sistem Matching</h2>
                <div className="w-6"></div>
            </div>

            <div className="relative h-[340px] w-full bg-gray-200">
                <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    style={{ width: '100%', height: '100%' }}
                >
                    <Marker latitude={-6.9758} longitude={110.3951} anchor="bottom">
                        <div className="bg-gray-900 text-white p-2 rounded-full shadow-lg border-2 border-yellow-400">
                            <MapPin size={16} className="text-yellow-400" />
                        </div>
                    </Marker>
                    <Marker latitude={-6.9820} longitude={110.4010} anchor="bottom">
                        <div className="bg-yellow-400 text-gray-950 px-2.5 py-1 rounded-full shadow-lg font-black text-[10px] flex items-center gap-1 border border-white">
                            ★ 98% RT 03
                        </div>
                    </Marker>
                </Map>

                <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-md flex items-center justify-between gap-2 border border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-yellow-100 rounded-xl flex items-center justify-center text-xs shrink-0">📦</div>
                        <span className="text-[11px] font-black text-gray-900 truncate">Semen 160 kg • Candisari</span>
                    </div>
                    <div className="flex bg-gray-100 p-0.5 rounded-xl shrink-0">
                        {['3km', '5km', '10km'].map(r => (
                            <button 
                                key={r} 
                                onClick={() => setSelectedRadius(r)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${selectedRadius === r ? 'bg-[#FFCC00] text-gray-950 shadow-sm' : 'text-gray-500'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-lg flex items-center gap-1 border border-gray-100">
                    <button 
                        onClick={() => setViewMode('map')} 
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-[#FFCC00] text-gray-950 shadow-sm' : 'text-gray-600'}`}
                    >
                        <MapIcon className="w-3.5 h-3.5" /> Peta
                    </button>
                    <button 
                        onClick={() => setViewMode('list')} 
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-[#FFCC00] text-gray-950 shadow-sm' : 'text-gray-600'}`}
                    >
                        <List className="w-3.5 h-3.5" /> List
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-6 relative z-10">
                <div className="bg-white rounded-t-[32px] p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] border-t border-gray-100">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4"></div>

                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-base font-black text-gray-900">Material Cocok Ditemukan</h2>
                            <p className="text-[10px] font-medium text-gray-500">Semen PCC • ±160 kg • Kualitas Prima Siap Pakai</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-full">3 Sesuai</span>
                    </div>

                    <div className="space-y-4">
                        {matches.map((item, idx) => (
                            <div 
                                key={item.id} 
                                onClick={() => setSelectedMatch(idx)}
                                className={`rounded-3xl p-4 border-2 transition-all cursor-pointer ${
                                    selectedMatch === idx 
                                    ? 'bg-white border-[#FFCC00] shadow-md ring-4 ring-yellow-400/10' 
                                    : 'bg-white border-gray-100 shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="bg-yellow-100 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full">★ {item.matchRate} Sesuai</span>
                                    {item.urgent && <span className="bg-red-50 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">⚠ Urgent Fasum</span>}
                                    {item.verified && <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Terverifikasi RW</span>}
                                </div>

                                <div className="flex justify-between items-start gap-3 mb-2">
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900">{item.title}</h3>
                                        <p className="text-[10px] font-bold text-gray-500 mt-0.5 flex items-center gap-1">
                                            <Navigation className="w-3 h-3 text-yellow-600" /> {item.distance} • {item.requirement}
                                        </p>
                                    </div>
                                    {item.image && (
                                        <img src={item.image} alt={item.title} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-sm" />
                                    )}
                                </div>

                                {selectedMatch === idx && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-[10px] font-medium text-gray-700">
                                        <p className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Material sesuai standar: Semen PCC</p>
                                        <p className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Volume pas: Sisa 40 kg dapat dialihkan ke pos lain</p>
                                        <p className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Radius sangat dekat: 0.7 km (±4 menit)</p>
                                        <p className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Koordinator aktif & siap jemput langsung</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={handleSelectMatch}
                    className="w-full bg-[#FFCC00] hover:bg-yellow-400 text-gray-950 font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform mb-2"
                >
                    <span>Pilih Kebutuhan Ini</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => navigate('/redistribusi')}
                    className="w-full text-center text-[10px] font-bold text-gray-500 hover:text-gray-800 py-1"
                >
                    Lihat Kebutuhan Lain
                </button>
            </div>
        </div>
    );
}