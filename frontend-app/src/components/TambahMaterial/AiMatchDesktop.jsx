import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleAlert, Info, Leaf, MapPin, Navigation, Package, RefreshCw, Route, Search, ShieldCheck, Truck, X } from 'lucide-react';
import { useAiRedistribusi } from '../../hooks/useAiRedistribusi';

const DEFAULT_CENTER = { latitude: -7.025, longitude: 110.422 };
const DEFAULT_RADIUS = 5;
const MAX_RESULTS = 6;

const OSM_STYLE = {
    version: 8,
    sources: {
        openstreetmap: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
        }
    },
    layers: [
        {
            id: 'openstreetmap',
            type: 'raster',
            source: 'openstreetmap'
        }
    ]
};

const DEMO_RECOMMENDATIONS = [
    {
        id: 'demo-1',
        title: 'Perbaikan Jalan Gang RT 03',
        nama_proyek: 'Perbaikan Jalan Gang RT 03',
        kategori: 'Infrastruktur',
        alamat: 'Kelurahan Pedalangan, Banyumanik',
        lokasi: 'Kelurahan Pedalangan, Banyumanik',
        latitude: -7.0154,
        longitude: 110.4217,
        jarak: '1.4 km',
        confidence: 98,
        estimasi: '40 kg',
        deskripsi: 'Perbaikan akses jalan lingkungan untuk meningkatkan akses warga dan mobilitas masyarakat.',
        kebutuhan: ['Semen Portland PCC', 'Material konstruksi', 'Perbaikan jalan'],
        image: 'https://images.unsplash.com/photo-1590644365607-1c5a3c7d8f40?auto=format&fit=crop&w=1200&q=80',
        demo: true
    },
    {
        id: 'demo-2',
        title: 'Renovasi Tempat Wudhu Mushola Al-Ikhlas',
        nama_proyek: 'Renovasi Tempat Wudhu Mushola Al-Ikhlas',
        kategori: 'Fasilitas Sosial',
        alamat: 'Tembalang, Semarang',
        lokasi: 'Tembalang, Semarang',
        latitude: -7.0398,
        longitude: 110.4356,
        jarak: '3.1 km',
        confidence: 89,
        estimasi: '25 kg',
        deskripsi: 'Renovasi tempat wudhu untuk meningkatkan fasilitas sanitasi mushola warga.',
        kebutuhan: ['Semen', 'Pasir', 'Material bangunan'],
        image: 'https://images.unsplash.com/photo-1584555684040-bad5fe8aa1a9?auto=format&fit=crop&w=1200&q=80',
        demo: true
    },
    {
        id: 'demo-3',
        title: 'Pembuatan Saluran Air Posyandu',
        nama_proyek: 'Pembuatan Saluran Air Posyandu',
        kategori: 'Fasilitas Umum',
        alamat: 'Pedurungan, Semarang',
        lokasi: 'Pedurungan, Semarang',
        latitude: -7.0086,
        longitude: 110.4479,
        jarak: '4.8 km',
        confidence: 76,
        estimasi: '20 kg',
        deskripsi: 'Pembuatan saluran air untuk mendukung fasilitas umum masyarakat.',
        kebutuhan: ['Semen', 'Pipa', 'Material konstruksi'],
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
        demo: true
    }
];

const parseNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
};

const getMaterialName = (data) => data?.nama_material || data?.namaMaterial || data?.jenis || 'Material Konstruksi';

const getMaterialWeight = (data) => {
    const weight = data?.bobot ?? data?.berat ?? data?.estimasi_bobot;
    return weight !== null && weight !== undefined && weight !== '' ? `${Number(weight).toLocaleString('id-ID')} kg` : '-';
};

const getMaterialQuantity = (data) => {
    const quantity = data?.jumlah ?? data?.quantity;
    const unit = data?.satuan || data?.unit || 'unit';
    return quantity ? `${quantity} ${unit}` : '-';
};

const getMaterialCondition = (data) => {
    const condition = data?.kondisi_barang || data?.kondisi || data?.kelayakan;
    return condition ? String(condition).replaceAll('_', ' ') : 'Layak Pakai';
};

const getMaterialLocation = (data) => data?.alamat || data?.lokasi || 'Semarang';

const getRecommendationList = (response) => {
    const list = response?.daftar_rekomendasi_mentah ?? response?.rekomendasi ?? response?.recommendations ?? response?.data;
    if (Array.isArray(list)) return list;
    if (Array.isArray(response?.results)) return response.results;
    return [];
};

const calculateDistance = (from, to) => {
    const earthRadius = 6371;
    const lat1 = (from.latitude * Math.PI) / 180;
    const lat2 = (to.latitude * Math.PI) / 180;
    const deltaLat = ((to.latitude - from.latitude) * Math.PI) / 180;
    const deltaLng = ((to.longitude - from.longitude) * Math.PI) / 180;
    const value = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
    return earthRadius * (2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)));
};

const formatDistance = (distance) => distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;

const normalizeRecommendation = (item, index, materialCenter) => {
    const latitude = parseNumber(item?.latitude ?? item?.lat ?? item?.lokasi_lat);
    const longitude = parseNumber(item?.longitude ?? item?.lng ?? item?.lokasi_lng ?? item?.lon);
    const coordinates = latitude !== null && longitude !== null ? { latitude, longitude } : null;
    const calculatedDistance = coordinates ? calculateDistance(materialCenter, coordinates) : null;

    return {
        ...item,
        id: item?.id ?? item?.project_id ?? item?.material_id ?? `api-${index}`,
        title: item?.title ?? item?.nama_proyek ?? item?.nama_kebutuhan ?? item?.nama ?? item?.nama_material ?? 'Kebutuhan Material',
        nama_proyek: item?.nama_proyek ?? item?.title ?? item?.nama_kebutuhan ?? item?.nama ?? item?.nama_material ?? 'Kebutuhan Material',
        kategori: item?.kategori ?? item?.category ?? 'Kebutuhan Sosial',
        alamat: item?.alamat ?? item?.lokasi ?? item?.location ?? 'Lokasi belum tersedia',
        lokasi: item?.lokasi ?? item?.alamat ?? item?.location ?? 'Lokasi belum tersedia',
        latitude,
        longitude,
        jarak: item?.jarak ?? item?.distance ?? item?.distance_km ?? (calculatedDistance !== null ? formatDistance(calculatedDistance) : null),
        distanceValue: calculatedDistance,
        confidence: parseNumber(item?.confidence ?? item?.score ?? item?.similarity) ?? 80,
        estimasi: item?.estimasi ?? item?.jumlah ?? item?.quantity ?? null,
        deskripsi: item?.deskripsi ?? item?.description ?? item?.keterangan ?? item?.kebutuhan ?? 'Kebutuhan material untuk mendukung fasilitas masyarakat.',
        kebutuhan: Array.isArray(item?.kebutuhan) ? item.kebutuhan : [item?.kategori || 'Material konstruksi'].filter(Boolean),
        image: item?.image ?? item?.gambar ?? item?.foto ?? null,
        demo: Boolean(item?.demo)
    };
};

const createRadiusGeoJSON = (center, radiusKm) => {
    const points = 80;
    const coordinates = [];
    const latDistance = radiusKm / 110.574;
    const lonDistance = radiusKm / (111.32 * Math.cos((center.latitude * Math.PI) / 180));

    for (let index = 0; index <= points; index += 1) {
        const angle = (index / points) * Math.PI * 2;
        coordinates.push([
            center.longitude + lonDistance * Math.cos(angle),
            center.latitude + latDistance * Math.sin(angle)
        ]);
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
        }
    };
};

const Stepper = () => {
    const steps = [
        ['01', 'Foto Material'],
        ['02', 'Analisis AI'],
        ['03', 'Konfirmasi'],
        ['04', 'Pencarian']
    ];

    return (
        <div className="flex items-center justify-center gap-2">
            {steps.map(([number, label], index) => (
                <React.Fragment key={number}>
                    <div className="flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-3 py-1.5 text-gray-900">
                        <Check className="h-3 w-3" />
                        <span className="text-[9px] font-black">{number}</span>
                        <span className="text-[9px] font-bold">{label}</span>
                    </div>
                    {index < steps.length - 1 && <div className="h-px w-5 bg-gray-200" />}
                </React.Fragment>
            ))}
        </div>
    );
};

const MaterialSummary = ({ finalData }) => (
    <div className="mb-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EFF6F1]">
                {finalData?.image ? (
                    <img src={finalData.image} alt={getMaterialName(finalData)} className="h-full w-full object-cover" />
                ) : (
                    <Package className="h-4 w-4 text-emerald-600" />
                )}
            </div>

            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="truncate text-[12px] font-black text-gray-900">{getMaterialName(finalData)}</h3>
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-[8px] font-bold text-gray-500">{getMaterialQuantity(finalData)}</span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[8px] font-medium text-gray-500">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" />{getMaterialCondition(finalData)}</span>
                    <span>•</span>
                    <span>{getMaterialWeight(finalData)}</span>
                    <span>•</span>
                    <span>{getMaterialLocation(finalData)}</span>
                </div>
            </div>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black text-emerald-700 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            AI Terverifikasi
        </div>
    </div>
);

const MatchTags = ({ tags = [] }) => (
    <div className="flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((tag, index) => (
            <span key={`${tag}-${index}`} className="rounded-full bg-emerald-50 px-2.5 py-1.5 text-[8px] font-bold text-emerald-700">✓ {tag}</span>
        ))}
    </div>
);

const NeedCard = ({ need, selected, expanded, onSelect, onToggle }) => (
    <article className={`overflow-hidden rounded-[20px] border bg-white shadow-sm transition-all duration-300 ${selected ? 'border-[#FFCC00] shadow-[0_8px_25px_rgba(255,204,0,0.14)]' : 'border-gray-100 hover:border-gray-200'}`}>
        <button type="button" onClick={() => onToggle(need)} className="w-full p-3.5 text-left">
            <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-[#FFCC00]' : 'bg-[#F1F3F2]'}`}>
                    {selected ? <Check className="h-4 w-4 text-gray-900" /> : <MapPin className="h-4 w-4 text-emerald-600" />}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-black text-emerald-700">{need.kategori}</span>
                                {need.demo && <span className="rounded-full bg-orange-50 px-2 py-1 text-[7px] font-black text-orange-600">Demo</span>}
                            </div>

                            <h3 className="text-[12px] font-black leading-tight text-gray-900">{need.title}</h3>

                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] font-medium text-gray-500">
                                <MapPin className="h-2.5 w-2.5 text-red-500" />
                                <span>{need.lokasi}</span>
                                {need.jarak && <><span>•</span><span>{need.jarak}</span></>}
                            </div>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#FFF7D7]">
                            <span className="text-[11px] font-black text-[#A97700]">{need.confidence}%</span>
                            <span className="text-[6px] font-bold text-gray-500">match</span>
                        </div>
                    </div>
                </div>
            </div>
        </button>

        {expanded && (
            <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3">
                {need.image && (
                    <div className="mb-3 h-28 overflow-hidden rounded-xl">
                        <img src={need.image} alt={need.title} className="h-full w-full object-cover" />
                    </div>
                )}

                <div className="rounded-xl bg-[#F8F9F7] p-3">
                    <p className="text-[7px] font-black uppercase tracking-wide text-gray-400">Alasan Kecocokan AI</p>
                    <p className="mt-1.5 text-[9px] leading-relaxed text-gray-600">{need.deskripsi}</p>

                    <div className="mt-3">
                        <MatchTags tags={need.kebutuhan} />
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between rounded-xl bg-[#FFF9DE] px-3 py-2.5">
                    <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-[#A97700]" />
                        <span className="text-[8px] font-bold text-gray-600">Estimasi kebutuhan</span>
                    </div>

                    <span className="text-[9px] font-black text-gray-900">{need.estimasi || '-'}</span>
                </div>

                <button type="button" onClick={() => onSelect(need)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] py-3 text-[9px] font-black text-gray-900 transition hover:bg-[#F4C000]">
                    {selected ? 'Kebutuhan Terpilih' : 'Pilih Kebutuhan Ini'}
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        )}
    </article>
);

const EmptyState = ({ loading, error, onRetry }) => (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[20px] border border-gray-100 bg-white px-8 text-center shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF8D7]">
            {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F0D46D] border-t-[#9C7600]" /> : <CircleAlert className="h-5 w-5 text-[#A97700]" />}
        </div>

        <h3 className="text-sm font-black text-gray-900">{loading ? 'Mencari kebutuhan...' : 'Belum ada kebutuhan yang cocok'}</h3>

        <p className="mt-2 max-w-sm text-[9px] leading-relaxed text-gray-500">
            {loading ? 'SISAIN sedang mencocokkan material dengan data kebutuhan.' : error || 'Belum ada kebutuhan yang tersedia pada radius pencarian ini.'}
        </p>

        {!loading && (
            <button type="button" onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-4 py-2.5 text-[9px] font-black text-gray-900">
                <RefreshCw className="h-3.5 w-3.5" />
                Coba Cari Lagi
            </button>
        )}
    </div>
);

const MapPanel = ({ center, radius, recommendations, selected, onSelect }) => {
    const mapRef = useRef(null);
    const [popupNeed, setPopupNeed] = useState(null);
    const radiusGeoJSON = useMemo(() => createRadiusGeoJSON(center, radius), [center, radius]);

    useEffect(() => {
        if (!mapRef.current) return;
        mapRef.current.flyTo({ center: [center.longitude, center.latitude], zoom: 12.8, duration: 700 });
    }, [center]);

    useEffect(() => {
        if (!mapRef.current || !selected?.latitude || !selected?.longitude) return;
        mapRef.current.flyTo({ center: [selected.longitude, selected.latitude], zoom: 14.3, duration: 650 });
    }, [selected]);

    return (
        <div className="relative h-[560px] overflow-hidden rounded-[22px] border border-gray-100 bg-[#E9EEE8] shadow-sm">
            <Map ref={mapRef} initialViewState={{ latitude: center.latitude, longitude: center.longitude, zoom: 12.8 }} mapStyle={OSM_STYLE} mapStyleDiffing attributionControl={false} dragRotate={false} touchZoomRotate={false} cooperativeGestures>
                <NavigationControl position="bottom-right" showCompass={false} />

                <Source id="radius-source" type="geojson" data={radiusGeoJSON}>
                    <Layer id="radius-fill" type="fill" paint={{ 'fill-color': '#FFCC00', 'fill-opacity': 0.10 }} />
                    <Layer id="radius-outline" type="line" paint={{ 'line-color': '#D9AE00', 'line-width': 1.5, 'line-dasharray': [3, 3], 'line-opacity': 0.85 }} />
                </Source>

                <Marker longitude={center.longitude} latitude={center.latitude} anchor="center">
                    <button type="button" onClick={() => setPopupNeed(null)} className="relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#FFCC00] shadow-lg">
                        <span className="absolute inset-[-6px] animate-ping rounded-full bg-[#FFCC00]/25" />
                        <Leaf className="relative h-4 w-4 text-gray-900" />
                    </button>
                </Marker>

                {recommendations.map((need) => {
                    if (need.latitude === null || need.longitude === null) return null;

                    const active = selected?.id === need.id;

                    return (
                        <Marker key={need.id} longitude={need.longitude} latitude={need.latitude} anchor="bottom">
                            <button type="button" onClick={() => { onSelect(need); setPopupNeed(need); }} className={`flex h-8 w-8 items-center justify-center rounded-full border-3 border-white shadow-md transition ${active ? 'scale-110 bg-[#FFCC00]' : 'bg-emerald-600'}`}>
                                <MapPin className={`h-3.5 w-3.5 ${active ? 'text-gray-900' : 'text-white'}`} />
                            </button>
                        </Marker>
                    );
                })}

                {popupNeed && popupNeed.latitude !== null && popupNeed.longitude !== null && (
                    <Popup longitude={popupNeed.longitude} latitude={popupNeed.latitude} anchor="bottom" closeButton onClose={() => setPopupNeed(null)} maxWidth="250px">
                        <div className="p-1">
                            <p className="text-[9px] font-black text-emerald-600">{popupNeed.kategori}</p>
                            <p className="mt-1 text-[12px] font-black text-gray-900">{popupNeed.title}</p>
                            <p className="mt-1 text-[9px] leading-relaxed text-gray-500">{popupNeed.lokasi}</p>
                            <p className="mt-2 text-[9px] font-black text-[#A97700]">{popupNeed.confidence}% cocok • {popupNeed.jarak || 'Jarak tersedia setelah koordinat diproses'}</p>
                        </div>
                    </Popup>
                )}
            </Map>

            <div className="absolute left-4 top-4 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-md backdrop-blur">
                <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <div>
                        <p className="text-[8px] font-black text-gray-900">Lokasi Material Anda</p>
                        <p className="mt-0.5 text-[6px] font-medium text-gray-400">OpenStreetMap • MapLibre</p>
                    </div>
                </div>
            </div>

            <div className="absolute left-1/2 top-[38%] -translate-x-1/2">
                <div className="rounded-full bg-[#FFCC00] px-4 py-2 shadow-md">
                    <span className="text-[8px] font-black text-gray-900">Radius {radius} km</span>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
                <div className="flex items-center gap-3 text-[7px] font-bold text-gray-600">
                    <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#FFCC00]" />Pusat Material</span>
                    <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />Penerima</span>
                    <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-yellow-500 bg-white" />Radius</span>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-2 text-[7px] font-black text-emerald-700 shadow-md">
                {recommendations.length} hasil
            </div>
        </div>
    );
};

export default function AiMatchDesktop({ finalData, imagePayload, onBack, onNext, enableDemoFallback = true }) {
    const { fetchRecommendations, isLoading } = useAiRedistribusi();
    const [radius, setRadius] = useState(DEFAULT_RADIUS);
    const [recommendations, setRecommendations] = useState([]);
    const [selectedNeed, setSelectedNeed] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    const center = useMemo(() => {
        const latitude = parseNumber(finalData?.lat ?? finalData?.latitude);
        const longitude = parseNumber(finalData?.longitude ?? finalData?.lng ?? finalData?.lon);

        return latitude !== null && longitude !== null
            ? { latitude, longitude }
            : DEFAULT_CENTER;
    }, [finalData]);

    const requestMessage = useMemo(() => {
        return `Cari kebutuhan yang cocok untuk material ${getMaterialName(finalData)}, kategori ${finalData?.kategori || 'material bangunan'}, kondisi ${getMaterialCondition(finalData)}, jumlah ${getMaterialQuantity(finalData)}, bobot ${getMaterialWeight(finalData)}, dari lokasi ${getMaterialLocation(finalData)}. Prioritaskan kebutuhan terdekat dan yang paling sesuai untuk digunakan kembali.`;
    }, [finalData]);

    const loadRecommendations = useCallback(async () => {
        setError(null);
        setIsDemoMode(false);
        setSelectedNeed(null);
        setExpandedId(null);

        try {
            const response = await fetchRecommendations(requestMessage);
            const apiItems = getRecommendationList(response).map((item, index) => normalizeRecommendation(item, index, center));

            if (apiItems.length > 0) {
                setRecommendations(apiItems);
                return;
            }

            if (!enableDemoFallback) {
                setRecommendations([]);
                setError(response?.rekomendasi_ai || 'Belum ada kebutuhan yang sesuai.');
                return;
            }

            const demoItems = DEMO_RECOMMENDATIONS.map((item, index) => normalizeRecommendation(item, index, center));
            setRecommendations(demoItems);
            setIsDemoMode(true);
            setError('Belum ada kebutuhan dari API. Data demo digunakan agar alur presentasi tetap bisa dijalankan.');
        } catch (requestError) {
            if (!enableDemoFallback) {
                setRecommendations([]);
                setError(requestError?.message || 'Gagal memuat kebutuhan dari server.');
                return;
            }

            const demoItems = DEMO_RECOMMENDATIONS.map((item, index) => normalizeRecommendation(item, index, center));
            setRecommendations(demoItems);
            setIsDemoMode(true);
            setError('API belum mengembalikan kebutuhan. Mode demo digunakan untuk presentasi.');
        }
    }, [center, enableDemoFallback, fetchRecommendations, requestMessage]);

    useEffect(() => {
        loadRecommendations();
    }, [loadRecommendations]);

    const visibleRecommendations = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return recommendations
            .filter((item) => {
                if (!query) return true;

                return [
                    item.title,
                    item.kategori,
                    item.lokasi,
                    item.alamat,
                    item.deskripsi,
                    ...(item.kebutuhan || [])
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(query);
            })
            .filter((item) => {
                if (item.demo) return true;
                if (item.distanceValue === null) return true;
                return item.distanceValue <= radius;
            })
            .sort((a, b) => {
                const scoreA = Number(a.confidence || 0);
                const scoreB = Number(b.confidence || 0);

                if (scoreA !== scoreB) return scoreB - scoreA;

                if (a.distanceValue === null) return 1;
                if (b.distanceValue === null) return -1;

                return a.distanceValue - b.distanceValue;
            })
            .slice(0, MAX_RESULTS);
    }, [recommendations, radius, searchQuery]);

    useEffect(() => {
        if (expandedId && !visibleRecommendations.some((item) => item.id === expandedId)) {
            setExpandedId(null);
        }
    }, [expandedId, visibleRecommendations]);

    const handleToggleNeed = useCallback((need) => {
        setExpandedId((current) => current === need.id ? null : need.id);
        setSelectedNeed(need);
    }, []);

    const handleSelectNeed = useCallback((need) => {
        setSelectedNeed(need);
        setExpandedId(need.id);
    }, []);

    const handleContinue = useCallback(() => {
        if (!selectedNeed) return;

        onNext?.({
            ...selectedNeed,
            materialData: finalData,
            imagePayload,
            source: selectedNeed.demo ? 'demo' : 'api',
            isDemo: Boolean(selectedNeed.demo)
        });
    }, [finalData, imagePayload, onNext, selectedNeed]);

    return (
        <main className="min-h-screen bg-[#FCF9F8] pb-12 text-gray-900">
            <div className="mx-auto max-w-[1360px] px-6 pt-5">
                <div className="mb-5 flex items-center justify-between">
                    <button type="button" onClick={onBack} className="flex items-center gap-2 text-[9px] font-bold text-gray-500 transition hover:text-gray-900">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali ke Distribusi
                    </button>

                    <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3 py-1.5 shadow-sm">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        <span className="text-[8px] font-black text-gray-600">AI Matching Aktif</span>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="mb-4 text-[8px] font-medium text-gray-400">Beranda &gt; Tambah Material &gt; AI Match</p>
                    <Stepper />
                </div>

                <MaterialSummary finalData={finalData} />

                <div className="grid grid-cols-[minmax(0,1.32fr)_minmax(360px,.78fr)] gap-5">
                    <section className="min-w-0">
                        <div className="mb-3 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-600">Pencarian Lokasi</p>
                                <h1 className="mt-1 text-[23px] font-black tracking-tight text-gray-900">Temukan kebutuhan terdekat</h1>
                            </div>

                            <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3 py-2 shadow-sm">
                                <Navigation className="h-3.5 w-3.5 text-[#C49600]" />
                                <span className="text-[8px] font-bold text-gray-500">Radius</span>
                                <select value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="bg-transparent text-[8px] font-black outline-none">
                                    {[1, 3, 5, 10, 15, 20].map((value) => <option key={value} value={value}>{value} km</option>)}
                                </select>
                            </div>
                        </div>

                        <MapPanel center={center} radius={radius} recommendations={visibleRecommendations} selected={selectedNeed} onSelect={handleSelectNeed} />

                        <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2 text-[8px] font-bold text-gray-500">
                                <Route className="h-3.5 w-3.5 text-[#C49600]" />
                                <span>OpenStreetMap • MapLibre GL JS • radius dinamis</span>
                            </div>

                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black text-emerald-700">
                                {visibleRecommendations.length} kebutuhan
                            </span>
                        </div>
                    </section>

                    <section className="min-w-0">
                        <div className="mb-4 flex items-end justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B08200]">AI Match Recommendation</p>
                                <h2 className="mt-1 text-[24px] font-black leading-tight text-gray-900">Material yang cocok ditemukan</h2>
                                <p className="mt-2 text-[9px] leading-relaxed text-gray-500">Pilih kebutuhan untuk melihat detail dan menentukan tujuan material.</p>
                            </div>

                            <button type="button" onClick={loadRecommendations} disabled={isLoading} className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-2 text-[8px] font-black text-gray-500 shadow-sm disabled:opacity-50">
                                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>

                        <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm">
                            <Search className="h-3.5 w-3.5 text-gray-400" />
                            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari kebutuhan, lokasi, atau kategori..." className="min-w-0 flex-1 bg-transparent text-[9px] font-medium text-gray-700 outline-none placeholder:text-gray-300" />
                            {searchQuery && (
                                <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {isDemoMode && (
                            <div className="mb-3 flex items-start gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2.5">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />

                                <div className="min-w-0 flex-1">
                                    <p className="text-[8px] font-black text-orange-700">Mode Demo Aktif</p>
                                    <p className="mt-0.5 text-[8px] leading-relaxed text-orange-600">{error}</p>
                                </div>
                            </div>
                        )}

                        {!isDemoMode && error && visibleRecommendations.length > 0 && (
                            <div className="mb-3 rounded-xl border border-yellow-100 bg-yellow-50 px-3 py-2.5">
                                <p className="text-[8px] font-medium leading-relaxed text-yellow-700">{error}</p>
                            </div>
                        )}

                        {isLoading ? (
                            <EmptyState loading />
                        ) : visibleRecommendations.length === 0 ? (
                            <EmptyState error={error} onRetry={loadRecommendations} />
                        ) : (
                            <div className="space-y-2.5">
                                {visibleRecommendations.map((need, index) => (
                                    <div key={need.id}>
                                        {index === 0 && (
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="rounded-full bg-[#FFCC00] px-2.5 py-1 text-[7px] font-black text-gray-900">REKOMENDASI UTAMA</span>
                                                <span className="text-[7px] font-bold text-gray-400">Kecocokan tertinggi</span>
                                            </div>
                                        )}

                                        <NeedCard need={need} selected={selectedNeed?.id === need.id} expanded={expandedId === need.id} onSelect={handleSelectNeed} onToggle={handleToggleNeed} />
                                    </div>
                                ))}

                                <div className="rounded-xl bg-gray-100 px-3 py-2.5 text-center">
                                    <span className="text-[7px] font-bold text-gray-500">Klik kartu untuk membuka detail kebutuhan.</span>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B08200]" />

                    <p className="text-[8px] leading-relaxed text-gray-500">
                        <span className="font-black text-gray-700">Catatan penting:</span> hasil dari API ditampilkan apa adanya setelah dinormalisasi untuk kebutuhan UI. Data demo hanya digunakan ketika API belum mengembalikan kandidat. Kebutuhan yang dipilih akan diteruskan ke proses berikutnya bersama data material.
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[8px] font-black text-gray-500 transition hover:bg-gray-50">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali
                    </button>

                    <div className="flex items-center gap-3">
                        {selectedNeed && (
                            <div className="hidden text-right md:block">
                                <p className="text-[7px] font-medium text-gray-400">Kebutuhan dipilih</p>
                                <p className="max-w-[220px] truncate text-[9px] font-black text-gray-900">{selectedNeed.title}</p>
                            </div>
                        )}

                        <button type="button" onClick={handleContinue} disabled={!selectedNeed || isLoading} className="flex items-center gap-2 rounded-full bg-[#FFCC00] px-6 py-3 text-[9px] font-black text-gray-900 shadow-sm transition hover:bg-[#F4C000] disabled:cursor-not-allowed disabled:opacity-40">
                            Lanjut ke Detail Kebutuhan
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}