import React, { useMemo, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clock, MapPin, Package, ShieldCheck, Truck, AlertCircle } from 'lucide-react';

const DEFAULT_ORIGIN = { longitude: 110.422, latitude: -7.025 };

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

const getCoordinates = (data, fallback = DEFAULT_ORIGIN) => {
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
        const longitudeFromArray = parseNumber(coordinates[0]);
        const latitudeFromArray = parseNumber(coordinates[1]);

        if (latitudeFromArray !== null && longitudeFromArray !== null) {
            return {
                latitude: latitudeFromArray,
                longitude: longitudeFromArray
            };
        }
    }

    return fallback;
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

const getMaterialCondition = (data) => firstValue(
    data?.kondisi_barang,
    data?.kondisi,
    data?.kelayakan,
    data?.condition,
    'Belum ditentukan'
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

const getMaterialAddress = (data) => firstValue(
    data?.alamat,
    data?.address,
    data?.lokasi,
    data?.location,
    data?.location_name,
    'Lokasi material belum tersedia'
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
    data?.project_type,
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

const getProjectDistance = (data) => firstValue(
    data?.distance_display,
    data?.distance,
    data?.jarak,
    data?.distance_km,
    data?.jarak_km
);

const getProjectDescription = (data) => firstValue(
    data?.deskripsi,
    data?.description,
    data?.keterangan,
    data?.detail,
    data?.project_description
);

const getProjectPurpose = (data) => firstValue(
    data?.tujuan,
    data?.penggunaan,
    data?.tujuan_penggunaan,
    data?.kebutuhan_detail,
    data?.material_usage,
    data?.kegunaan
);

const getProjectPic = (data) => firstValue(
    data?.pic,
    data?.nama_pic,
    data?.pic_name,
    data?.penanggung_jawab,
    data?.penanggungJawab,
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

const getPickupTime = (data) => firstValue(
    data?.pickup_time,
    data?.pickupTime,
    data?.jadwal_pickup,
    data?.waktu_pickup,
    data?.estimated_pickup,
    data?.pickup_schedule
);

const getEstimatedDuration = (data) => firstValue(
    data?.estimated_duration,
    data?.durasi,
    data?.estimasi_waktu,
    data?.eta,
    data?.delivery_eta
);

const getAccessNote = (data) => firstValue(
    data?.akses,
    data?.access_note,
    data?.catatan_akses,
    data?.access,
    data?.akses_lokasi
);

const getImageUrl = (data) => firstValue(
    data?.image_url,
    data?.gambar_url,
    data?.foto_url,
    data?.photo_url,
    data?.image,
    data?.gambar,
    data?.foto,
    data?.photo
);

const formatWeight = (value) => {
    const number = parseNumber(value);
    return number !== null ? `${number.toLocaleString('id-ID')} kg` : '-';
};

const formatQuantity = (quantity, unit = 'unit') => {
    if (quantity === null || quantity === undefined || quantity === '') return '-';
    return `${quantity} ${unit}`;
};

const formatDistance = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'string' && /km|meter| m\b/i.test(value)) return value;

    const number = parseNumber(value);

    return number !== null
        ? `${number.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km`
        : String(value);
};

const RadioIndicator = ({ active }) => (
    active ? (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFCC00]">
            <Check className="h-3 w-3 text-gray-900" strokeWidth={3} />
        </div>
    ) : (
        <Circle className="h-5 w-5 text-gray-300" strokeWidth={1.5} />
    )
);

const ChecklistItem = ({ active, onClick, title, description }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
            active
                ? 'border-yellow-100 bg-gray-50 hover:bg-gray-100'
                : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
    >
        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition ${
            active ? 'bg-[#FFCC00]' : 'border-2 border-gray-300 bg-white'
        }`}>
            {active && <Check className="h-3.5 w-3.5 text-gray-900" strokeWidth={3} />}
        </div>

        <div className="min-w-0">
            <h4 className="text-[10px] font-black text-gray-900">{title}</h4>
            <p className="mt-1 text-[9px] leading-relaxed text-gray-500">{description}</p>
        </div>
    </button>
);

export default function KonfirmasiPengirimanDesktop({ finalData, projectData, onBack, onNext }) {
    const [metode, setMetode] = useState(
        finalData?.metode_pengiriman
        ?? finalData?.delivery_method
        ?? 'dijemput'
    );

    const [checklist, setChecklist] = useState({
        kondisi: finalData?.checklist?.kondisi ?? true,
        akses: finalData?.checklist?.akses ?? true,
        pic: finalData?.checklist?.pic ?? true
    });

    const material = finalData || {};
    const project = projectData || finalData?.selected_project || finalData?.selectedProject || {};

    const originCoords = useMemo(() => getCoordinates(material), [material]);

    const destinationCoords = useMemo(() => {
        const hasOwnCoordinates = (
            parseNumber(firstValue(
                project?.latitude,
                project?.lat,
                project?.koordinat?.latitude,
                project?.koordinat?.lat,
                project?.location?.latitude,
                project?.location?.lat
            )) !== null
        ) && (
            parseNumber(firstValue(
                project?.longitude,
                project?.lng,
                project?.lon,
                project?.koordinat?.longitude,
                project?.koordinat?.lng,
                project?.location?.longitude,
                project?.location?.lng
            )) !== null
        );

        return hasOwnCoordinates ? getCoordinates(project, null) : null;
    }, [project]);

    const materialName = getMaterialName(material);
    const materialCategory = getMaterialCategory(material);
    const materialCondition = getMaterialCondition(material);
    const materialQuantity = getMaterialQuantity(material);
    const materialUnit = getMaterialUnit(material);
    const materialWeight = getMaterialWeight(material);
    const materialImage = getMaterialImage(material);
    const materialAddress = getMaterialAddress(material);

    const projectName = getProjectName(project);
    const projectCategory = getProjectCategory(project);
    const projectAddress = getProjectAddress(project);
    const projectDistance = getProjectDistance(project);
    const projectDescription = getProjectDescription(project);
    const projectPurpose = getProjectPurpose(project);
    const projectPic = getProjectPic(project);
    const projectPhone = getProjectPhone(project);
    const pickupTime = getPickupTime(project);
    const estimatedDuration = getEstimatedDuration(project);
    const accessNote = getAccessNote(project);
    const projectImage = getImageUrl(project);

    const isAllChecked = checklist.kondisi && checklist.akses && checklist.pic;

    const routeGeoJSON = useMemo(() => {
        if (!destinationCoords) return null;

        if (
            Math.abs(originCoords.longitude - destinationCoords.longitude) < 0.00001
            && Math.abs(originCoords.latitude - destinationCoords.latitude) < 0.00001
        ) {
            return null;
        }

        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [
                    [originCoords.longitude, originCoords.latitude],
                    [destinationCoords.longitude, destinationCoords.latitude]
                ]
            }
        };
    }, [originCoords, destinationCoords]);

    const handleChecklist = (key) => {
        setChecklist((current) => ({
            ...current,
            [key]: !current[key]
        }));
    };

    const handleSubmit = () => {
        if (!isAllChecked) return;

        onNext?.({
            ...finalData,
            selectedProject: project,
            projectData: project,
            metode_pengiriman: metode,
            delivery_method: metode,
            checklist,
            checklist_complete: true,
            alamat_asal: materialAddress,
            alamat_tujuan: projectAddress,
            koordinat_asal: originCoords,
            koordinat_tujuan: destinationCoords,
            deliveryData: {
                metode_pengiriman: metode,
                delivery_method: metode,
                checklist,
                alamat_asal: materialAddress,
                alamat_tujuan: projectAddress,
                koordinat_asal: originCoords,
                koordinat_tujuan: destinationCoords,
                project_id: project?.id ?? project?.project_id ?? project?.kebutuhan_id ?? null,
                material_id: finalData?.id ?? finalData?.material_id ?? null
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#FCF9F8] pb-24 font-sans">
            <div className="mx-auto max-w-[1280px] px-6 pt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-[10px] font-bold text-gray-600 transition-colors hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Detail Kebutuhan
                </button>

                <div className="mb-8">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-yellow-200 bg-[#FFF9E6] px-2.5 py-1 text-[8px] font-black text-yellow-800">
                            LANGKAH SELANJUTNYA
                        </span>

                        <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-700">
                            Data AI Match
                        </span>
                    </div>

                    <h1 className="text-[32px] font-black tracking-tight text-gray-900">
                        Konfirmasi Pickup / Kirim
                    </h1>

                    <p className="mt-1.5 max-w-3xl text-[11px] font-medium leading-relaxed text-gray-500">
                        Tentukan metode serah-terima material surplus dan pastikan seluruh kondisi material serta akses penyerahan sudah sesuai sebelum dikirim ke tujuan.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-5 space-y-5">
                        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between gap-3">
                                <h3 className="flex items-center gap-2 text-[13px] font-black text-gray-900">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    Rute Distribusi Material
                                </h3>

                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[8px] font-bold text-emerald-700">
                                    {projectDistance ? `Jarak ${formatDistance(projectDistance)}` : 'Data lokasi'}
                                </span>
                            </div>

                            <div className="relative pl-3">
                                <div className="absolute left-[27px] top-5 bottom-8 w-px border-l-2 border-dashed border-gray-300" />

                                <div className="relative z-10 mb-6 flex gap-4">
                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#FFCC00] shadow-sm">
                                        <Package className="h-3.5 w-3.5 text-gray-900" />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                Dari
                                            </span>

                                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[8px] font-bold text-gray-500">
                                                Lokasi Material
                                            </span>
                                        </div>

                                        <h4 className="text-sm font-black text-gray-900">
                                            {materialName}
                                        </h4>

                                        <p className="mt-0.5 text-[9px] leading-relaxed text-gray-500">
                                            {materialAddress}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-10 mb-6 ml-10 inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[8px] font-bold text-gray-600 shadow-sm">
                                    <span>
                                        {projectDistance ? formatDistance(projectDistance) : 'Jarak belum tersedia'}
                                    </span>

                                    {estimatedDuration && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {estimatedDuration}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="relative z-10 flex gap-4">
                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-red-500 shadow-sm">
                                        <MapPin className="h-3.5 w-3.5 text-white" />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                Ke
                                            </span>

                                            <span className="rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[8px] font-bold text-red-600">
                                                {projectCategory}
                                            </span>
                                        </div>

                                        <h4 className="text-sm font-black text-gray-900">
                                            {projectName}
                                        </h4>

                                        <p className="mt-0.5 text-[9px] leading-relaxed text-gray-500">
                                            {projectAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mt-6 h-[180px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                                <Map
                                    initialViewState={{
                                        longitude: destinationCoords?.longitude ?? originCoords.longitude,
                                        latitude: destinationCoords?.latitude ?? originCoords.latitude,
                                        zoom: 12.8
                                    }}
                                    mapStyle={OSM_STYLE}
                                    style={{ width: '100%', height: '100%' }}
                                    interactive={false}
                                    attributionControl={false}
                                >
                                    <NavigationControl position="bottom-right" showCompass={false} />

                                    {routeGeoJSON && (
                                        <Source id="delivery-route" type="geojson" data={routeGeoJSON}>
                                            <Layer
                                                id="delivery-route-line"
                                                type="line"
                                                paint={{
                                                    'line-color': '#10B981',
                                                    'line-width': 3,
                                                    'line-dasharray': [2, 1],
                                                    'line-opacity': 0.9
                                                }}
                                            />
                                        </Source>
                                    )}

                                    <Marker longitude={originCoords.longitude} latitude={originCoords.latitude}>
                                        <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-900 bg-[#FFCC00] shadow-md" />
                                    </Marker>

                                    {destinationCoords && (
                                        <Marker longitude={destinationCoords.longitude} latitude={destinationCoords.latitude}>
                                            <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500 shadow-md" />
                                        </Marker>
                                    )}
                                </Map>

                                <div className="absolute left-2.5 top-2.5 rounded-md border border-gray-100 bg-white/90 px-2.5 py-1.5 text-[8px] font-bold text-gray-700 shadow-sm backdrop-blur">
                                    {destinationCoords ? 'Rute berbasis koordinat API' : 'Koordinat tujuan belum tersedia'}
                                </div>

                                <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1.5">
                                    <span className="rounded bg-white/90 px-2 py-1 text-[7px] font-bold text-emerald-700 shadow-sm">
                                        OpenStreetMap
                                    </span>

                                    <span className="rounded bg-white/90 px-2 py-1 text-[7px] font-bold text-yellow-700 shadow-sm">
                                        Titik Material
                                    </span>

                                    <span className="rounded bg-white/90 px-2 py-1 text-[7px] font-bold text-red-600 shadow-sm">
                                        Tujuan Proyek
                                    </span>
                                </div>
                            </div>

                            {accessNote && (
                                <div className="mt-3 flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                                    <p className="text-[8px] leading-relaxed text-gray-600">
                                        <strong className="text-gray-800">Akses:</strong> {accessNote}
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <h3 className="text-[12px] font-black text-gray-900">
                                    Material yang Akan Diserahkan
                                </h3>

                                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[8px] font-black text-emerald-700">
                                    <ShieldCheck className="h-3 w-3" />
                                    Terverifikasi
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                                    {materialImage ? (
                                        <img src={materialImage} alt={materialName} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-gray-400">
                                            FOTO
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                        {materialCategory}
                                    </p>

                                    <h4 className="text-sm font-black text-gray-900">
                                        {materialName}
                                    </h4>

                                    <p className="mt-0.5 text-[9px] text-gray-500">
                                        Kondisi: {materialCondition}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        <span className="rounded bg-[#FFFAEB] px-2 py-1 text-[8px] font-bold text-yellow-800">
                                            {formatQuantity(materialQuantity, materialUnit)}
                                        </span>

                                        {materialWeight !== null && materialWeight !== undefined && materialWeight !== '' && (
                                            <span className="rounded bg-gray-100 px-2 py-1 text-[8px] font-bold text-gray-700">
                                                {formatWeight(materialWeight)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {projectPurpose && (
                                <div className="mt-5 rounded-xl border border-yellow-100 bg-[#FFFAEB] p-3">
                                    <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-yellow-700">
                                        Tujuan Penggunaan
                                    </p>

                                    <p className="text-[9px] leading-relaxed text-gray-700">
                                        {projectPurpose}
                                    </p>
                                </div>
                            )}

                            {projectDescription && (
                                <p className="mt-3 text-[9px] leading-relaxed text-gray-500">
                                    {projectDescription}
                                </p>
                            )}
                        </section>
                    </div>

                    <div className="col-span-7 space-y-5">
                        <section className="rounded-[24px] border border-gray-100 bg-white p-6 lg:p-8 shadow-sm">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-black text-gray-900">
                                        Pilih Cara Serah-Terima
                                    </h3>

                                    <p className="mt-1 text-[10px] font-medium text-gray-500">
                                        Pilih metode sesuai informasi distribusi yang tersedia untuk material dan proyek ini.
                                    </p>
                                </div>

                                <Truck className="h-5 w-5 shrink-0 text-gray-400" />
                            </div>

                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={() => setMetode('dijemput')}
                                    className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                                        metode === 'dijemput'
                                            ? 'border-[#FFCC00] bg-[#FFFDF5] shadow-[0_4px_15px_rgba(255,204,0,0.1)]'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                metode === 'dijemput'
                                                    ? 'bg-[#FFCC00] text-gray-900 shadow-sm'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                <Truck className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h4 className="flex flex-wrap items-center gap-2 text-sm font-black text-gray-900">
                                                    Dijemput

                                                    <span className="rounded-full bg-[#FFCC00] px-2 py-0.5 text-[7px] font-black text-yellow-900">
                                                        Penjemputan
                                                    </span>
                                                </h4>

                                                <p className="mt-0.5 text-[9px] leading-relaxed text-gray-500">
                                                    Material diambil dari lokasi asal dan diteruskan ke proyek tujuan.
                                                </p>
                                            </div>
                                        </div>

                                        <RadioIndicator active={metode === 'dijemput'} />
                                    </div>

                                    {metode === 'dijemput' && (
                                        <div className="mt-5 border-t border-yellow-100 pt-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl border border-yellow-100 bg-white p-3">
                                                    <p className="mb-1 text-[7px] font-black uppercase tracking-widest text-gray-400">
                                                        Jadwal
                                                    </p>

                                                    <p className="text-[10px] font-black text-gray-900">
                                                        {pickupTime || 'Belum tersedia'}
                                                    </p>

                                                    <p className="mt-1 text-[8px] text-gray-500">
                                                        Mengikuti informasi pickup dari API.
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-yellow-100 bg-white p-3">
                                                    <p className="mb-1 text-[7px] font-black uppercase tracking-widest text-gray-400">
                                                        Estimasi
                                                    </p>

                                                    <p className="text-[10px] font-black text-gray-900">
                                                        {estimatedDuration || 'Belum tersedia'}
                                                    </p>

                                                    <p className="mt-1 text-[8px] text-gray-500">
                                                        Durasi pengiriman jika tersedia.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                                <p className="mb-1 flex items-center gap-1.5 text-[7px] font-black uppercase tracking-widest text-gray-400">
                                                    <MapPin className="h-3 w-3" />
                                                    Titik Muat
                                                </p>

                                                <p className="text-[9px] font-black text-gray-900">
                                                    {materialAddress}
                                                </p>

                                                {projectPic && (
                                                    <p className="mt-1 text-[8px] text-gray-500">
                                                        PIC: {projectPic}
                                                        {projectPhone ? ` • ${projectPhone}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMetode('kirim_sendiri')}
                                    className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                                        metode === 'kirim_sendiri'
                                            ? 'border-[#FFCC00] bg-[#FFFDF5] shadow-[0_4px_15px_rgba(255,204,0,0.1)]'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                metode === 'kirim_sendiri'
                                                    ? 'bg-[#FFCC00] text-gray-900 shadow-sm'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}>
                                                <Truck className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h4 className="flex flex-wrap items-center gap-2 text-sm font-black text-gray-900">
                                                    Kirim Sendiri

                                                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[7px] font-bold text-gray-600">
                                                        Mandiri
                                                    </span>
                                                </h4>

                                                <p className="mt-0.5 text-[9px] leading-relaxed text-gray-500">
                                                    Anda mengantarkan material langsung ke alamat proyek tujuan.
                                                </p>
                                            </div>
                                        </div>

                                        <RadioIndicator active={metode === 'kirim_sendiri'} />
                                    </div>

                                    {metode === 'kirim_sendiri' && (
                                        <div className="mt-4 border-t border-yellow-100 pt-4">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

                                                <div>
                                                    <p className="text-[9px] font-black text-gray-900">
                                                        {projectAddress}
                                                    </p>

                                                    <p className="mt-1 text-[8px] leading-relaxed text-gray-500">
                                                        {projectDistance
                                                            ? `Jarak terdata: ${formatDistance(projectDistance)}`
                                                            : 'Jarak belum tersedia dari API.'}
                                                        {estimatedDuration ? ` • Estimasi ${estimatedDuration}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </section>

                        <section className="rounded-[24px] border border-gray-100 bg-white p-6 lg:p-8 shadow-sm">
                            <div className="mb-5">
                                <h3 className="flex items-center gap-2 text-sm font-black text-gray-900">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    Pastikan Material Siap Diserahkan
                                </h3>

                                <p className="mt-1 text-[9px] leading-relaxed text-gray-500">
                                    Semua checklist harus dikonfirmasi sebelum data pengiriman dikirim ke sistem.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <ChecklistItem
                                    active={checklist.kondisi}
                                    onClick={() => handleChecklist('kondisi')}
                                    title="Kondisi Material Sesuai"
                                    description={`${materialName} berada dalam kondisi ${materialCondition.toLowerCase()} dan jumlah material yang diserahkan sesuai data yang sudah dikonfirmasi.`}
                                />

                                <ChecklistItem
                                    active={checklist.akses}
                                    onClick={() => handleChecklist('akses')}
                                    title="Akses Lokasi Sudah Dipastikan"
                                    description={accessNote || `Alamat asal material tercatat sebagai ${materialAddress}. Pastikan kendaraan atau proses pickup dapat menjangkau lokasi tersebut.`}
                                />

                                <ChecklistItem
                                    active={checklist.pic}
                                    onClick={() => handleChecklist('pic')}
                                    title="PIC atau Penerima Siap"
                                    description={
                                        projectPic
                                            ? `${projectPic}${projectPhone ? ` dapat dihubungi melalui ${projectPhone}.` : ' tercatat sebagai PIC tujuan.'}`
                                            : 'Informasi PIC belum tersedia dari data proyek. Pastikan pihak penerima dapat dihubungi saat serah-terima.'
                                    }
                                />
                            </div>

                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-[#E6F4EA] p-4">
                                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />

                                <div>
                                    <h4 className="mb-1 text-[10px] font-black text-emerald-900">
                                        Validasi Serah-Terima SISAIN
                                    </h4>

                                    <p className="text-[8px] font-medium leading-relaxed text-emerald-800">
                                        Data metode pengiriman, lokasi asal, tujuan, dan checklist akan diteruskan bersama data material serta proyek terpilih pada saat penyimpanan distribusi.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {!isAllChecked && (
                            <div className="flex items-start gap-2 rounded-xl border border-yellow-100 bg-[#FFFAEB] px-4 py-3">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-700" />

                                <p className="text-[9px] font-medium leading-relaxed text-yellow-900">
                                    Lengkapi seluruh checklist material, akses, dan PIC sebelum melanjutkan.
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex items-center gap-2 px-2 text-[10px] font-bold text-gray-600 transition-colors hover:text-gray-900"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Detail
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!isAllChecked}
                                className={`flex items-center gap-2 rounded-full px-6 py-3.5 text-[10px] font-black transition-all ${
                                    isAllChecked
                                        ? 'bg-[#FFCC00] text-gray-900 shadow-md hover:bg-yellow-400 active:scale-[0.98]'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                }`}
                            >
                                Konfirmasi Pengiriman
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}