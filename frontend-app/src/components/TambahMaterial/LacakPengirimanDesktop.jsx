import React, { useMemo } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, CheckCircle2, Clock, MapPin, MessageCircle, Navigation, Package, Phone, ShieldCheck, Truck } from 'lucide-react';

const DEFAULT_LOCATION = { longitude: 110.422, latitude: -7.025 };

const OSM_STYLE = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
        }
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
};

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const parseNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string') return null;

    const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '');
    const number = Number(normalized);

    return Number.isFinite(number) ? number : null;
};

const getCoordinates = (data, fallback = DEFAULT_LOCATION) => {
    if (!data) return fallback;

    const latitude = parseNumber(firstValue(
        data?.latitude,
        data?.lat,
        data?.koordinat?.latitude,
        data?.koordinat?.lat,
        data?.location?.latitude,
        data?.location?.lat,
        data?.lokasi?.latitude,
        data?.lokasi?.lat
    ));

    const longitude = parseNumber(firstValue(
        data?.longitude,
        data?.lng,
        data?.lon,
        data?.koordinat?.longitude,
        data?.koordinat?.lng,
        data?.location?.longitude,
        data?.location?.lng,
        data?.lokasi?.longitude,
        data?.lokasi?.lng
    ));

    if (latitude !== null && longitude !== null) {
        return { latitude, longitude };
    }

    const coordinates = firstValue(
        data?.coordinates,
        data?.koordinat?.coordinates,
        data?.location?.coordinates
    );

    if (Array.isArray(coordinates) && coordinates.length >= 2) {
        const lng = parseNumber(coordinates[0]);
        const lat = parseNumber(coordinates[1]);

        if (lat !== null && lng !== null) {
            return { latitude: lat, longitude: lng };
        }
    }

    return fallback;
};

const hasCoordinates = (data) => {
    if (!data) return false;

    const coords = getCoordinates(data, null);
    return Boolean(coords);
};

const getMaterialName = (data) => firstValue(
    data?.nama_material,
    data?.namaMaterial,
    data?.material_name,
    data?.material,
    data?.jenis,
    'Material Bangunan'
);

const getMaterialCategory = (data) => firstValue(
    data?.kategori,
    data?.category,
    data?.material_category,
    'Material'
);

const getMaterialQuantity = (data) => firstValue(
    data?.jumlah,
    data?.quantity,
    data?.volume
);

const getMaterialUnit = (data) => firstValue(
    data?.satuan,
    data?.unit,
    'unit'
);

const getMaterialWeight = (data) => firstValue(
    data?.bobot,
    data?.berat,
    data?.availableKg,
    data?.available_kg,
    data?.weight,
    data?.berat_kg
);

const getMaterialCondition = (data) => firstValue(
    data?.kondisi_barang,
    data?.kondisi,
    data?.kelayakan,
    data?.condition,
    'Belum ditentukan'
);

const getMaterialAddress = (data) => firstValue(
    data?.alamat,
    data?.address,
    data?.lokasi,
    data?.location,
    data?.location_name,
    'Lokasi material belum tersedia'
);

const getMaterialImage = (data) => firstValue(
    data?.image_url,
    data?.gambar_url,
    data?.foto_url,
    data?.photo_url,
    data?.image,
    data?.gambar,
    data?.foto,
    data?.photo
);

const getProjectName = (data) => firstValue(
    data?.title,
    data?.nama_proyek,
    data?.nama_project,
    data?.project_name,
    data?.nama_kebutuhan,
    data?.nama,
    data?.name,
    'Proyek Tujuan'
);

const getProjectCategory = (data) => firstValue(
    data?.kategori,
    data?.category,
    data?.jenis_proyek,
    data?.tipe_proyek,
    'Proyek'
);

const getProjectAddress = (data) => firstValue(
    data?.alamat,
    data?.address,
    data?.lokasi,
    data?.location,
    data?.location_name,
    'Alamat tujuan belum tersedia'
);

const getProjectPic = (data) => firstValue(
    data?.pic,
    data?.nama_pic,
    data?.pic_name,
    data?.penanggung_jawab,
    data?.contact_name,
    data?.kontak_nama
);

const getProjectPhone = (data) => firstValue(
    data?.phone,
    data?.no_telepon,
    data?.nomor_telepon,
    data?.telepon,
    data?.contact_phone,
    data?.kontak,
    data?.kontak_telepon
);

const getProjectDistance = (data) => firstValue(
    data?.distance_display,
    data?.distance,
    data?.jarak,
    data?.distance_km,
    data?.jarak_km
);

const getTrackingStatus = (data) => firstValue(
    data?.current_status,
    data?.status_label,
    data?.status,
    data?.tracking_status,
    data?.delivery_status,
    'Menunggu pembaruan tracking'
);

const getTrackingMessage = (data) => firstValue(
    data?.status_message,
    data?.message,
    data?.description,
    data?.current_message
);

const getCourier = (data) => {
    const courier = data?.courier ?? data?.driver ?? data?.rider ?? data?.kurir ?? {};
    return courier || {};
};

const getCourierName = (data) => firstValue(
    data?.courier_name,
    data?.driver_name,
    data?.rider_name,
    data?.nama_kurir,
    data?.nama_driver,
    data?.name
);

const getCourierPhone = (data) => firstValue(
    data?.courier_phone,
    data?.driver_phone,
    data?.rider_phone,
    data?.nomor_kurir,
    data?.telepon_kurir,
    data?.phone
);

const getVehicle = (data) => firstValue(
    data?.vehicle_name,
    data?.vehicle,
    data?.kendaraan,
    data?.armada,
    data?.courier_vehicle
);

const getPlateNumber = (data) => firstValue(
    data?.plate_number,
    data?.plate,
    data?.plat_nomor,
    data?.nomor_polisi,
    data?.vehicle_plate
);

const getCourierImage = (data) => firstValue(
    data?.courier_image,
    data?.driver_image,
    data?.rider_image,
    data?.foto_kurir,
    data?.profile_image,
    data?.avatar
);

const getTrackingCoordinates = (data) => {
    const location = data?.courier_location
        ?? data?.current_location
        ?? data?.driver_location
        ?? data?.rider_location
        ?? data?.live_location
        ?? data?.location;

    return hasCoordinates(location) ? getCoordinates(location, null) : null;
};

const formatWeight = (value) => {
    const number = parseNumber(value);
    return number !== null ? `${number.toLocaleString('id-ID')} kg` : '-';
};

const formatQuantity = (quantity, unit) => {
    if (quantity === null || quantity === undefined || quantity === '') return '-';
    return `${quantity} ${unit || 'unit'}`;
};

const formatDistance = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'string' && /km|meter|\bm\b/i.test(value)) return value;

    const number = parseNumber(value);

    return number !== null
        ? `${number.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km`
        : String(value);
};

const formatTime = (value) => {
    if (!value) return 'Belum tersedia';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
    }).format(date);
};

const normalizeHistory = (trackingData) => {
    const history = firstValue(
        trackingData?.history,
        trackingData?.timeline,
        trackingData?.events,
        trackingData?.tracking_history,
        trackingData?.trackingHistory
    );

    if (!Array.isArray(history)) {
        return [];
    }

    return history.map((item, index) => ({
        id: item?.id ?? index,
        status: item?.status ?? item?.status_label ?? item?.title ?? 'Pembaruan tracking',
        location: item?.location ?? item?.lokasi ?? item?.address ?? item?.alamat ?? 'Lokasi belum tersedia',
        time: item?.time ?? item?.timestamp ?? item?.created_at ?? item?.updated_at,
        isLatest: item?.isLatest ?? item?.is_latest ?? index === 0
    }));
};

const InfoCard = ({ label, value, icon: Icon }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="mb-1 text-[7px] font-black uppercase tracking-widest text-gray-400">
            {label}
        </p>

        <p className="flex items-center gap-1.5 text-[10px] font-black text-gray-900">
            <Icon className="h-3.5 w-3.5 text-emerald-600" />
            {value}
        </p>
    </div>
);

export default function LacakPengirimanDesktop({
    trackingId,
    finalData,
    projectData,
    trackingData,
    onBack
}) {
    const material = finalData || {};
    const project = projectData || finalData?.selected_project || finalData?.selectedProject || {};
    const tracking = trackingData || {};

    const originCoords = useMemo(
        () => getCoordinates(material),
        [material]
    );

    const destinationCoords = useMemo(() => {
        if (!hasCoordinates(project)) return null;
        return getCoordinates(project, null);
    }, [project]);

    const courierCoords = useMemo(
        () => getTrackingCoordinates(tracking),
        [tracking]
    );

    const materialName = getMaterialName(material);
    const materialCategory = getMaterialCategory(material);
    const materialQuantity = getMaterialQuantity(material);
    const materialUnit = getMaterialUnit(material);
    const materialWeight = getMaterialWeight(material);
    const materialCondition = getMaterialCondition(material);
    const materialAddress = getMaterialAddress(material);
    const materialImage = getMaterialImage(material);

    const projectName = getProjectName(project);
    const projectCategory = getProjectCategory(project);
    const projectAddress = getProjectAddress(project);
    const projectPic = getProjectPic(project);
    const projectPhone = getProjectPhone(project);
    const projectDistance = getProjectDistance(project);

    const trackingStatus = getTrackingStatus(tracking);
    const trackingMessage = getTrackingMessage(tracking);

    const courier = getCourier(tracking);
    const courierName = getCourierName(courier) ?? getCourierName(tracking);
    const courierPhone = getCourierPhone(courier) ?? getCourierPhone(tracking);
    const vehicle = getVehicle(courier) ?? getVehicle(tracking);
    const plateNumber = getPlateNumber(courier) ?? getPlateNumber(tracking);
    const courierImage = getCourierImage(courier) ?? getCourierImage(tracking);

    const trackingHistory = useMemo(
        () => normalizeHistory(tracking),
        [tracking]
    );

    const routeGeoJSON = useMemo(() => {
        if (!destinationCoords) return null;

        const coordinates = [
            [originCoords.longitude, originCoords.latitude]
        ];

        if (courierCoords) {
            coordinates.push([courierCoords.longitude, courierCoords.latitude]);
        }

        coordinates.push([
            destinationCoords.longitude,
            destinationCoords.latitude
        ]);

        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates
            }
        };
    }, [originCoords, destinationCoords, courierCoords]);

    const initialViewState = useMemo(() => {
        if (courierCoords) {
            return {
                longitude: courierCoords.longitude,
                latitude: courierCoords.latitude,
                zoom: 13.8
            };
        }

        if (destinationCoords) {
            return {
                longitude: (originCoords.longitude + destinationCoords.longitude) / 2,
                latitude: (originCoords.latitude + destinationCoords.latitude) / 2,
                zoom: 12.8
            };
        }

        return {
            longitude: originCoords.longitude,
            latitude: originCoords.latitude,
            zoom: 13.5
        };
    }, [originCoords, destinationCoords, courierCoords]);

    const deliveryMethod = firstValue(
        finalData?.metode_pengiriman,
        finalData?.delivery_method,
        'dijemput'
    );

    const hasTracking = Boolean(trackingId);
    const hasCourier = Boolean(courierName || vehicle || courierCoords);
    const isLive = Boolean(
        tracking?.is_live
        ?? tracking?.live
        ?? tracking?.tracking_active
        ?? courierCoords
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#FCF9F8] pb-10 font-sans">
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4 shadow-sm">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-[10px] font-bold text-gray-600 transition hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Beranda
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-gray-400">
                        ID Lacak
                    </span>

                    <span className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 text-[9px] font-black tracking-widest text-gray-900">
                        {trackingId || 'MENUNGGU ID'}
                    </span>
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 p-6 lg:grid-cols-12">
                <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-gray-200 bg-gray-100 shadow-sm lg:col-span-7">
                    <Map
                        initialViewState={initialViewState}
                        mapStyle={OSM_STYLE}
                        style={{ width: '100%', height: '100%', minHeight: '520px' }}
                        attributionControl={false}
                        dragRotate={false}
                    >
                        <NavigationControl
                            position="bottom-right"
                            showCompass={false}
                        />

                        {routeGeoJSON && (
                            <Source
                                id="tracking-route"
                                type="geojson"
                                data={routeGeoJSON}
                            >
                                <Layer
                                    id="tracking-route-line"
                                    type="line"
                                    paint={{
                                        'line-color': '#10B981',
                                        'line-width': 4,
                                        'line-dasharray': [2, 1.5],
                                        'line-opacity': 0.9
                                    }}
                                />
                            </Source>
                        )}

                        <Marker
                            longitude={originCoords.longitude}
                            latitude={originCoords.latitude}
                            anchor="center"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#FFCC00] shadow-lg">
                                <Package className="h-4 w-4 text-gray-900" />
                            </div>
                        </Marker>

                        {destinationCoords && (
                            <Marker
                                longitude={destinationCoords.longitude}
                                latitude={destinationCoords.latitude}
                                anchor="center"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-red-500 shadow-lg">
                                    <MapPin className="h-4 w-4 text-white" />
                                </div>
                            </Marker>
                        )}

                        {courierCoords && (
                            <Marker
                                longitude={courierCoords.longitude}
                                latitude={courierCoords.latitude}
                                anchor="center"
                            >
                                <div className="relative flex flex-col items-center">
                                    <div className="mb-1 flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900 px-2.5 py-1 text-[7px] font-black text-white shadow-lg">
                                        <Truck className="h-3 w-3 text-[#FFCC00]" />
                                        {vehicle || 'Kurir SISAIN'}
                                    </div>

                                    <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#FFCC00] shadow-xl">
                                        <span className="h-2 w-2 rounded-full bg-gray-900" />
                                    </div>
                                </div>
                            </Marker>
                        )}
                    </Map>

                    <div className="absolute left-5 top-5 max-w-[290px] rounded-[20px] border border-gray-100 bg-white/95 p-4 shadow-lg backdrop-blur">
                        <div className="mb-2 flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${isLive ? 'animate-pulse bg-emerald-500' : 'bg-gray-400'}`} />

                            <span className={`text-[9px] font-black uppercase tracking-widest ${isLive ? 'text-emerald-600' : 'text-gray-500'}`}>
                                {isLive ? 'Live Tracking Aktif' : 'Tracking Menunggu Update'}
                            </span>
                        </div>

                        <h2 className="text-xl font-black leading-tight text-gray-900">
                            {trackingStatus}
                        </h2>

                        <p className="mt-1.5 text-[9px] leading-relaxed text-gray-500">
                            {trackingMessage || (
                                hasTracking
                                    ? 'Menunggu pembaruan posisi dan status terbaru dari server.'
                                    : 'ID tracking belum tersedia dari response penyimpanan distribusi.'
                            )}
                        </p>
                    </div>

                    <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                        <span className="rounded bg-white/90 px-2.5 py-1.5 text-[7px] font-bold text-emerald-700 shadow-sm">
                            OpenStreetMap
                        </span>

                        <span className="rounded bg-white/90 px-2.5 py-1.5 text-[7px] font-bold text-yellow-700 shadow-sm">
                            Lokasi Material
                        </span>

                        {destinationCoords && (
                            <span className="rounded bg-white/90 px-2.5 py-1.5 text-[7px] font-bold text-red-600 shadow-sm">
                                Tujuan Proyek
                            </span>
                        )}

                        {courierCoords && (
                            <span className="rounded bg-white/90 px-2.5 py-1.5 text-[7px] font-bold text-gray-800 shadow-sm">
                                Posisi Kurir
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-lg transition hover:bg-gray-50 active:scale-95"
                    >
                        <Navigation className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-5 overflow-y-auto pb-4 lg:col-span-5">
                    <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                Informasi Pengiriman
                            </p>

                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[8px] font-black text-emerald-700">
                                {deliveryMethod === 'kirim_sendiri' ? 'Kirim Sendiri' : 'Dijemput'}
                            </span>
                        </div>

                        <h3 className="text-lg font-black text-gray-900">
                            {projectName}
                        </h3>

                        <p className="mt-1 flex items-start gap-1.5 text-[9px] leading-relaxed text-gray-500">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {projectAddress}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <InfoCard
                                label="Jarak"
                                value={formatDistance(projectDistance)}
                                icon={MapPin}
                            />

                            <InfoCard
                                label="Kategori"
                                value={projectCategory}
                                icon={CheckCircle2}
                            />

                            <InfoCard
                                label="Material"
                                value={materialName}
                                icon={Package}
                            />

                            <InfoCard
                                label="Jumlah"
                                value={formatQuantity(materialQuantity, materialUnit)}
                                icon={Truck}
                            />
                        </div>
                    </section>

                    <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                    Informasi Armada
                                </p>

                                <h3 className="mt-1 text-sm font-black text-gray-900">
                                    Penjemputan / Pengiriman
                                </h3>
                            </div>

                            <Truck className="h-5 w-5 text-gray-400" />
                        </div>

                        {hasCourier ? (
                            <>
                                <div className="mb-5 flex items-center gap-4">
                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-emerald-100 bg-gray-100">
                                        {courierImage ? (
                                            <img
                                                src={courierImage}
                                                alt={courierName || 'Kurir'}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Truck className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-black text-gray-900">
                                                {courierName || 'Kurir SISAIN'}
                                            </h3>

                                            <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[7px] font-black text-emerald-700">
                                                <ShieldCheck className="h-2.5 w-2.5" />
                                                Terverifikasi
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[9px] text-gray-500">
                                            {vehicle || 'Jenis armada belum tersedia'}
                                            {plateNumber ? ` • ${plateNumber}` : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-[#E6F4EA] py-3 text-[9px] font-bold text-emerald-800 transition hover:bg-emerald-100"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Chat
                                    </button>

                                    <button
                                        type="button"
                                        disabled={!courierPhone}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-[9px] font-bold transition ${
                                            courierPhone
                                                ? 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100'
                                                : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                                        }`}
                                    >
                                        <Phone className="h-4 w-4" />
                                        Telepon
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="rounded-xl border border-yellow-100 bg-[#FFFAEB] p-4">
                                <p className="text-[9px] font-bold leading-relaxed text-yellow-900">
                                    Data kurir atau armada belum tersedia dari API tracking.
                                    Informasi akan muncul setelah backend mengirim penugasan armada.
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                                {materialImage ? (
                                    <img
                                        src={materialImage}
                                        alt={materialName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Package className="h-5 w-5 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                    {materialCategory}
                                </p>

                                <h4 className="mt-0.5 truncate text-[11px] font-black text-gray-900">
                                    {materialName}
                                </h4>

                                <p className="mt-1 text-[8px] text-gray-500">
                                    {formatQuantity(materialQuantity, materialUnit)}
                                    {materialWeight ? ` • ${formatWeight(materialWeight)}` : ''}
                                </p>

                                <p className="mt-1 text-[8px] text-gray-400">
                                    Kondisi: {materialCondition}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

                            <div>
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                    Titik Asal
                                </p>

                                <p className="mt-0.5 text-[9px] font-bold leading-relaxed text-gray-700">
                                    {materialAddress}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="flex-1 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                    Tracking
                                </p>

                                <h3 className="mt-1 text-sm font-black text-gray-900">
                                    Status Perjalanan
                                </h3>
                            </div>

                            <span className={`rounded-full px-2.5 py-1 text-[7px] font-black ${
                                isLive
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-100 text-gray-500'
                            }`}>
                                {isLive ? 'LIVE' : 'MENUNGGU UPDATE'}
                            </span>
                        </div>

                        {trackingHistory.length > 0 ? (
                            <div className="relative">
                                {trackingHistory.map((item, index) => {
                                    const isLast = index === trackingHistory.length - 1;

                                    return (
                                        <div
                                            key={item.id}
                                            className="relative flex gap-4 pb-8 last:pb-0"
                                        >
                                            {!isLast && (
                                                <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100" />
                                            )}

                                            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-[3px] ${
                                                    item.isLatest
                                                        ? 'border-white bg-[#FFCC00] text-gray-900 shadow-md'
                                                        : 'border-gray-200 bg-white text-gray-400'
                                                }`}>
                                                    {item.isLatest ? (
                                                        <Truck className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="min-w-0 flex-1 pt-1">
                                                <p className={`text-[10px] leading-relaxed ${
                                                    item.isLatest
                                                        ? 'font-black text-gray-900'
                                                        : 'font-bold text-gray-600'
                                                }`}>
                                                    {item.status}
                                                </p>

                                                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] font-medium text-gray-400">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(item.time)}
                                                    <span>•</span>
                                                    {item.location}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-yellow-100 bg-[#FFFAEB] p-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-yellow-700" />

                                    <div>
                                        <h4 className="text-[10px] font-black text-yellow-900">
                                            Belum ada riwayat tracking
                                        </h4>

                                        <p className="mt-1 text-[8px] leading-relaxed text-yellow-800">
                                            {hasTracking
                                                ? 'ID pelacakan sudah tersedia, tetapi backend belum mengirim riwayat perjalanan.'
                                                : 'Data tracking belum tersedia dari response API penyimpanan distribusi.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                    PIC Tujuan
                                </p>

                                <p className="mt-1 text-[9px] font-black text-gray-900">
                                    {projectPic || 'Belum tersedia'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                    Kontak
                                </p>

                                <p className="mt-1 text-[9px] font-black text-gray-900">
                                    {projectPhone || 'Belum tersedia'}
                                </p>
                            </div>
                        </div>
                    </section>

                    <button
                        type="button"
                        onClick={onBack}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] py-3.5 text-[10px] font-black text-gray-900 shadow-sm transition hover:bg-yellow-400 active:scale-[0.99]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
}