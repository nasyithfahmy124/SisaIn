import { useEffect, useMemo, useRef, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl/maplibre';
import { ArrowUpRight, MapPin, Sparkles, Truck, ArrowRight, ExternalLink } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';
const INITIAL_VIEW = { longitude: 110.422, latitude: -6.999, zoom: 13.3 };

export default function MapView({ items = [], selected, onSelect }) {
    const mapRef = useRef(null);
    const [showMatch, setShowMatch] = useState(true);

    const validItems = useMemo(() => items.filter(item => Number.isFinite(Number(item.lng)) && Number.isFinite(Number(item.lat))), [items]);
    const supply = useMemo(() => validItems.filter(item => item.type === 'supply'), [validItems]);
    const demand = useMemo(() => validItems.filter(item => item.type === 'demand'), [validItems]);

    const matchTarget = useMemo(() => {
        if (!selected) return null;

        return validItems
            .filter(item => item.id !== selected.id)
            .sort((a, b) => (b.match || 0) - (a.match || 0))[0] || null;
    }, [selected, validItems]);

    const matchLine = useMemo(() => {
        if (!selected || !matchTarget) return null;

        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [
                    [Number(selected.lng), Number(selected.lat)],
                    [Number(matchTarget.lng), Number(matchTarget.lat)]
                ]
            },
            properties: {}
        };
    }, [selected, matchTarget]);

    useEffect(() => {
        if (!selected || !Number.isFinite(Number(selected.lng)) || !Number.isFinite(Number(selected.lat))) return;

        mapRef.current?.flyTo({
            center: [Number(selected.lng), Number(selected.lat)],
            zoom: 15,
            duration: 850
        });
    }, [selected]);

    const handleSelect = item => {
        if (!Number.isFinite(Number(item.lng)) || !Number.isFinite(Number(item.lat))) return;

        onSelect(item);

        mapRef.current?.flyTo({
            center: [Number(item.lng), Number(item.lat)],
            zoom: 15,
            duration: 850
        });
    };

    return (
        <div className="relative h-full min-h-[620px] w-full overflow-hidden rounded-[28px] bg-[#eef1ed]">
            <Map
                ref={mapRef}
                initialViewState={INITIAL_VIEW}
                mapStyle={MAP_STYLE}
                attributionControl={false}
                onClick={() => onSelect(null)}
                style={{ width: '100%', height: '100%' }}
            >
                <NavigationControl position="top-right" showCompass={false} />

                {showMatch && matchLine && (
                    <Source id="ai-match" type="geojson" data={matchLine}>
                        <Layer
                            id="match-line"
                            type="line"
                            paint={{
                                'line-color': '#f5b400',
                                'line-width': 4,
                                'line-opacity': 0.9,
                                'line-dasharray': [2, 1.5]
                            }}
                        />
                    </Source>
                )}

                {validItems.map(item => (
                    <Marker key={item.id} longitude={Number(item.lng)} latitude={Number(item.lat)} anchor="bottom">
                        <button
                            type="button"
                            onClick={event => {
                                event.stopPropagation();
                                handleSelect(item);
                            }}
                            className={`group relative grid h-10 w-10 place-items-center rounded-full border-[3px] border-white shadow-[0_8px_20px_rgba(15,23,42,.2)] transition-all duration-300 hover:scale-110 ${item.type === 'supply' ? 'bg-[#f5b400] text-[#111827]' : 'bg-[#111827] text-[#f5b400]'}`}
                        >
                            {item.type === 'supply' ? <MapPin size={16} /> : <Sparkles size={16} />}

                            <span className="absolute -bottom-1 h-2.5 w-2.5 rotate-45 bg-inherit" />

                            {item.match >= 94 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[7px] font-black text-white">
                                    ✓
                                </span>
                            )}
                        </button>
                    </Marker>
                ))}

                {selected && Number.isFinite(Number(selected.lng)) && Number.isFinite(Number(selected.lat)) && (
                    <Popup
                        longitude={Number(selected.lng)}
                        latitude={Number(selected.lat)}
                        anchor="bottom"
                        offset={38}
                        closeButton={false}
                        closeOnClick={false}
                        onClose={() => onSelect(null)}
                    >
                        <PopupCard item={selected} />
                    </Popup>
                )}
            </Map>

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <StatusBadge color="bg-emerald-500" label={`${supply.length} Supply`} />
                <StatusBadge color="bg-gray-900" label={`${demand.length} Demand`} />
            </div>

            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-2.5 shadow-xl backdrop-blur">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-yellow-100 text-yellow-600">
                    <Sparkles size={17} />
                </div>

                <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">AI Matching</p>
                    <p className="text-[11px] font-black text-gray-900">Material cocok ditemukan</p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowMatch(value => !value)}
                    className={`ml-2 h-6 w-10 rounded-full p-1 transition ${showMatch ? 'bg-yellow-400' : 'bg-gray-200'}`}
                >
                    <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${showMatch ? 'translate-x-4' : ''}`} />
                </button>
            </div>

            <div className="absolute bottom-5 right-5 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
                <div className="flex items-center gap-2">
                    <Truck size={15} className="text-yellow-500" />

                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">Radius pencarian</p>
                        <p className="text-xs font-black text-gray-900">5 km</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ color, label }) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-bold text-gray-700 shadow-lg backdrop-blur">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            {label}
        </div>
    );
}

function PopupCard({ item }) {
    const isDemand = item.type === 'demand';
    const title = item.title || item.material || 'Perbaikan Gang & Trotoar RT 03 / RW 05';
    const distance = item.distance || '1.1 km';
    
    // Data simulasi (sesuaikan dengan properti data item Anda yang sebenarnya)
    const imageSrc = item.image || '/src/assets/img/semen-placeholder.jpg'; 
    const aiEstimation = item.ai_estimation || 'Estimasi 3 Sak Semen & 2 Sak Pasir';
    const description = item.description || 'Warga swadaya telah menyiapkan tenaga tukang. Menunggu redistribusi sisa semen proyek renovasi terdekat untuk pengecoran.';

    return (
        <div className="w-[320px] p-2">
            {/* Header: Label & Target Spasial */}
            <div className="flex items-center justify-between mb-3">
                <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${isDemand ? 'border-red-100 bg-red-50 text-red-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isDemand ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {isDemand ? 'Kebutuhan Mendesak' : 'Supply Terverifikasi'}
                </span>
                <span className="text-[10px] font-medium text-gray-400">Target Spasial</span>
            </div>

            {/* Judul & Jarak */}
            <h3 className="mb-3 text-[15px] font-black leading-snug text-gray-900">
                {title} ({distance})
            </h3>

            {/* Gambar & Overlay AI Analysis */}
            <div className="relative mb-3 h-40 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
                
                <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-gray-900/90 px-3 py-2.5 backdrop-blur-sm">
                    <p className="text-[10px] font-medium text-gray-100">
                        <span className="font-bold text-yellow-400 mr-1.5">AI Sisain:</span> 
                        {aiEstimation}
                    </p>
                </div>
            </div>

            {/* Deskripsi */}
            <p className="mb-4 text-[11px] leading-relaxed text-gray-600 font-medium">
                {description}
            </p>

            {/* Tombol Aksi Utama */}
            <button 
                type="button" 
                className="group flex w-full items-center justify-between rounded-full bg-[#FFCC00] py-2 pl-5 pr-2 transition-all hover:bg-yellow-400 shadow-sm"
            >
                <span className="text-[12px] font-bold text-gray-950">
                    Cocokkan Material Saya ke Sini
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
                    <ArrowRight size={14} strokeWidth={2.5} />
                </div>
            </button>

            {/* Tautan Rute Maps */}
            <div className="mt-4 flex justify-center">
                <button 
                    type="button" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ExternalLink size={12} />
                    Buka Rute Pengambilan (Google Maps)
                </button>
            </div>
        </div>
    );
}