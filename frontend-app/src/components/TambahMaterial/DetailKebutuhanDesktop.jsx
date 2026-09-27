import React, { useEffect, useMemo, useRef } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, ArrowRight, Camera, Check, CheckCircle2, Clock3, Leaf, Lock, Map as MapIcon, MapPin, Shield, ShieldCheck, Truck, Wrench } from 'lucide-react';

const DEFAULT_ORIGIN = { latitude: -7.025, longitude: 110.422 };

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

const parseNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string') return null;

    const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '');
    const number = Number(normalized);

    return Number.isFinite(number) ? number : null;
};

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const unwrapProjectData = (data) => {
    if (!data) return {};
    return data?.selected_project ?? data?.selectedProject ?? data?.project ?? data?.kebutuhan ?? data?.data ?? data;
};

const getCoordinates = (data, fallback = DEFAULT_ORIGIN) => {
    const record = unwrapProjectData(data);

    const latitude = parseNumber(firstValue(
        record?.latitude,
        record?.lat,
        record?.koordinat?.latitude,
        record?.koordinat?.lat,
        record?.location?.latitude,
        record?.location?.lat,
        record?.lokasi?.latitude,
        record?.lokasi?.lat
    ));

    const longitude = parseNumber(firstValue(
        record?.longitude,
        record?.lng,
        record?.lon,
        record?.koordinat?.longitude,
        record?.koordinat?.lng,
        record?.location?.longitude,
        record?.location?.lng,
        record?.lokasi?.longitude,
        record?.lokasi?.lng
    ));

    if (latitude !== null && longitude !== null) {
        return { latitude, longitude };
    }

    const coordinates = record?.coordinates ?? record?.koordinat?.coordinates ?? record?.location?.coordinates;

    if (Array.isArray(coordinates) && coordinates.length >= 2) {
        const [longitudeValue, latitudeValue] = coordinates;
        const latitudeFromArray = parseNumber(latitudeValue);
        const longitudeFromArray = parseNumber(longitudeValue);

        if (latitudeFromArray !== null && longitudeFromArray !== null) {
            return {
                latitude: latitudeFromArray,
                longitude: longitudeFromArray
            };
        }
    }

    return fallback;
};

const hasCoordinates = (data) => {
    const record = unwrapProjectData(data);
    const coordinate = getCoordinates(record, null);
    return Boolean(coordinate);
};

const getProjectId = (data) => firstValue(
    data?.id,
    data?.project_id,
    data?.projectId,
    data?.kebutuhan_id,
    data?.kebutuhanId
);

const getProjectName = (data) => firstValue(
    data?.title,
    data?.nama_proyek,
    data?.nama_project,
    data?.project_name,
    data?.nama_kebutuhan,
    data?.nama,
    data?.name,
    'Detail Kebutuhan Proyek'
);

const getProjectLocation = (data) => firstValue(
    data?.location_name,
    data?.lokasi_nama,
    data?.location,
    data?.lokasi,
    data?.alamat,
    data?.address,
    'Lokasi belum tersedia'
);

const getProjectDistance = (data) => firstValue(
    data?.distance_display,
    data?.distance,
    data?.jarak,
    data?.distance_km,
    data?.jarak_km
);

const getProjectCategory = (data) => firstValue(
    data?.kategori,
    data?.category,
    data?.jenis_proyek,
    data?.tipe_proyek,
    data?.project_type,
    'Proyek'
);

const getProjectDescription = (data) => firstValue(
    data?.deskripsi,
    data?.description,
    data?.keterangan,
    data?.detail,
    data?.project_description,
    data?.kebutuhan_deskripsi
);

const getProjectPurpose = (data) => firstValue(
    data?.tujuan,
    data?.penggunaan,
    data?.tujuan_penggunaan,
    data?.kebutuhan_detail,
    data?.material_usage,
    data?.target_penggunaan,
    data?.kegunaan
);

const getProjectImage = (data) => firstValue(
    data?.image_url,
    data?.gambar_url,
    data?.foto_url,
    data?.photo_url,
    data?.image,
    data?.gambar,
    data?.foto,
    data?.photo,
    data?.thumbnail
);

const getNeededMaterialName = (data) => firstValue(
    data?.material_name,
    data?.material,
    data?.nama_material,
    data?.namaMaterial,
    data?.jenis_material,
    data?.material_dibutuhkan,
    data?.kebutuhan_material
);

const getNeededWeight = (data) => firstValue(
    data?.neededKg,
    data?.needed_kg,
    data?.jumlah_kebutuhan_kg,
    data?.kebutuhan_kg,
    data?.required_weight,
    data?.required_kg,
    data?.bobot_kebutuhan,
    data?.berat_kebutuhan,
    data?.weight_needed
);

const getNeededQuantity = (data) => firstValue(
    data?.neededQuantity,
    data?.needed_quantity,
    data?.jumlah_kebutuhan,
    data?.quantity_needed,
    data?.jumlah,
    data?.quantity,
    data?.volume
);

const getNeededUnit = (data) => firstValue(
    data?.neededUnit,
    data?.needed_unit,
    data?.satuan_kebutuhan,
    data?.satuan,
    data?.unit
);

const getAvailableWeight = (data) => firstValue(
    data?.bobot,
    data?.berat,
    data?.availableKg,
    data?.available_kg,
    data?.weight,
    data?.berat_kg
);

const getAvailableQuantity = (data) => firstValue(
    data?.jumlah,
    data?.quantity,
    data?.volume
);

const getAvailableUnit = (data) => firstValue(
    data?.satuan,
    data?.unit
);

const getMaterialType = (data) => firstValue(
    data?.nama_material,
    data?.namaMaterial,
    data?.material_name,
    data?.jenis,
    data?.material,
    'Material Bangunan'
);

const getMatchScore = (data) => {
    const score = parseNumber(firstValue(
        data?.match_percentage,
        data?.match_percent,
        data?.match_score,
        data?.matchScore,
        data?.match,
        data?.confidence,
        data?.score,
        data?.similarity,
        data?.persentase_match,
        data?.skor_kecocokan
    ));

    if (score === null) return 0;

    return Math.max(0, Math.min(100, score));
};

const getMatchReason = (data) => firstValue(
    data?.match_reason,
    data?.matchReason,
    data?.alasan_match,
    data?.reason,
    data?.catatan_match,
    data?.ai_reason,
    data?.penjelasan_match
);

const getConditionLabel = (data) => firstValue(
    data?.kondisi_barang,
    data?.kondisi,
    data?.kelayakan,
    data?.condition,
    'Belum ditentukan'
);

const getValidationStatus = (data) => firstValue(
    data?.status_verifikasi,
    data?.verification_status,
    data?.verification,
    data?.status_validasi,
    data?.status
);

const getValidationOfficer = (data) => firstValue(
    data?.verified_by,
    data?.nama_verifikator,
    data?.verifikator,
    data?.koordinator,
    data?.validator,
    data?.verifiedBy
);

const getValidationNote = (data) => firstValue(
    data?.validation_note,
    data?.catatan_verifikasi,
    data?.catatan_validasi,
    data?.catatan
);

const getAccessNote = (data) => firstValue(
    data?.akses,
    data?.access_note,
    data?.catatan_akses,
    data?.access,
    'Informasi akses belum tersedia dari API.'
);

const getEstimatedDuration = (data) => firstValue(
    data?.estimated_duration,
    data?.durasi,
    data?.estimasi_waktu,
    data?.eta,
    data?.delivery_eta
);

const getOrganization = (data) => firstValue(
    data?.nama_organisasi,
    data?.organisasi,
    data?.organization,
    data?.pemohon,
    data?.penanggung_jawab,
    data?.pic,
    data?.owner_name
);

const formatWeight = (value) => {
    const number = parseNumber(value);
    return number !== null ? `${number.toLocaleString('id-ID')} kg` : '-';
};

const formatQuantity = (quantity, unit = 'unit') => {
    if (quantity === null || quantity === undefined || quantity === '') return '-';
    return `${quantity} ${unit || 'unit'}`;
};

const formatDistance = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'string' && /km|meter|m\b/i.test(value)) return value;

    const number = parseNumber(value);

    return number !== null
        ? `${number.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km`
        : String(value);
};

const formatDate = (value) => {
    if (!value) return 'Belum tersedia';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const getReferenceId = (project) => {
    const id = getProjectId(project);

    return id ? `MTC-${String(id).padStart(6, '0')}` : 'MTC-API';
};

const calculateSurplus = (available, needed) => {
    const availableNumber = parseNumber(available);
    const neededNumber = parseNumber(needed);

    if (availableNumber === null || neededNumber === null) return null;

    return availableNumber - neededNumber;
};

const getMatchLabel = (score) => {
    if (score >= 90) return 'Kesesuaian Tinggi';
    if (score >= 75) return 'Kesesuaian Baik';
    if (score > 0) return 'Perlu Ditinjau';
    return 'Belum Dinilai';
};

const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
        <p className="text-[10px] leading-relaxed text-gray-700">
            <strong className="text-gray-900">{label}:</strong> {children}
        </p>
    </div>
);

const StatusBadge = ({ children, tone = 'green' }) => {
    const classes = tone === 'red'
        ? 'border-red-100 bg-red-50 text-red-600'
        : tone === 'yellow'
            ? 'border-yellow-100 bg-yellow-50 text-yellow-700'
            : 'border-emerald-100 bg-emerald-50 text-emerald-700';

    return (
        <span className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[8px] font-bold ${classes}`}>
            {children}
        </span>
    );
};

const SectionTitle = ({ icon: Icon, children, accent = 'yellow' }) => (
    <h3 className="flex items-center gap-2 text-sm font-black text-gray-900">
        <Icon className={`h-4 w-4 ${accent === 'green' ? 'text-emerald-600' : 'text-yellow-600'}`} />
        {children}
    </h3>
);

export default function DetailKebutuhanDesktop({ projectData, materialData, onBack, onNext }) {
    const mapRef = useRef(null);

    const project = useMemo(() => unwrapProjectData(projectData), [projectData]);
    const material = useMemo(() => unwrapProjectData(materialData), [materialData]);

    const projectCoordinate = useMemo(() => {
        const coordinate = getCoordinates(project, null);
        return coordinate;
    }, [project]);

    const origin = useMemo(() => {
        return getCoordinates(material, projectCoordinate || DEFAULT_ORIGIN);
    }, [material, projectCoordinate]);

    const destination = useMemo(() => projectCoordinate, [projectCoordinate]);

    const projectName = getProjectName(project);
    const projectLocation = getProjectLocation(project);
    const projectDistance = getProjectDistance(project);
    const projectCategory = getProjectCategory(project);
    const projectDescription = getProjectDescription(project);
    const projectPurpose = getProjectPurpose(project);
    const projectImage = getProjectImage(project);
    const organization = getOrganization(project);

    const materialType = getMaterialType(material);
    const materialCondition = getConditionLabel(material);
    const availableWeight = getAvailableWeight(material);
    const availableQuantity = getAvailableQuantity(material);
    const availableUnit = getAvailableUnit(material);

    const neededMaterialName = getNeededMaterialName(project);
    const neededWeight = getNeededWeight(project);
    const neededQuantity = getNeededQuantity(project);
    const neededUnit = getNeededUnit(project);

    const matchScore = getMatchScore(project);
    const matchLabel = getMatchLabel(matchScore);
    const matchReason = getMatchReason(project);

    const validationStatus = getValidationStatus(project);
    const validationOfficer = getValidationOfficer(project);
    const validationNote = getValidationNote(project);
    const accessNote = getAccessNote(project);
    const estimatedDuration = getEstimatedDuration(project);

    const surplusWeight = calculateSurplus(availableWeight, neededWeight);

    const routeGeoJSON = useMemo(() => {
        if (!projectCoordinate) return null;

        if (
            origin.latitude === projectCoordinate.latitude
            && origin.longitude === projectCoordinate.longitude
        ) {
            return null;
        }

        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [
                    [origin.longitude, origin.latitude],
                    [projectCoordinate.longitude, projectCoordinate.latitude]
                ]
            }
        };
    }, [origin, projectCoordinate]);

    useEffect(() => {
        if (!mapRef.current) return;

        if (!destination) {
            mapRef.current.flyTo({
                center: [origin.longitude, origin.latitude],
                zoom: 13.5,
                duration: 700
            });
            return;
        }

        const samePoint = Math.abs(origin.longitude - destination.longitude) < 0.00001
            && Math.abs(origin.latitude - destination.latitude) < 0.00001;

        if (samePoint) {
            mapRef.current.flyTo({
                center: [origin.longitude, origin.latitude],
                zoom: 13.5,
                duration: 700
            });
            return;
        }

        const west = Math.min(origin.longitude, destination.longitude);
        const east = Math.max(origin.longitude, destination.longitude);
        const south = Math.min(origin.latitude, destination.latitude);
        const north = Math.max(origin.latitude, destination.latitude);

        mapRef.current.fitBounds(
            [[west, south], [east, north]],
            { padding: 70, duration: 800, maxZoom: 14 }
        );
    }, [origin, destination]);

    const handleNext = () => {
        const payload = {
            ...projectData,
            selectedProject: projectData,
            materialData,
            detailConfirmed: true,
            project_id: getProjectId(project),
            match_score: matchScore,
            match_label: matchLabel
        };

        onNext?.(payload);
    };

    const hasProjectImage = Boolean(projectImage);
    const hasProjectCoordinates = hasCoordinates(project);
    const distanceText = formatDistance(projectDistance);
    const nextButtonLabel = 'Salurkan ke Proyek Ini';

    return (
        <main className="min-h-screen bg-[#FCF9F8] pb-24 font-sans text-gray-900">
            <header className="sticky top-0 z-40 border-b border-gray-100 bg-[#FCF9F8]/95 px-8 py-4 backdrop-blur">
                <div className="mx-auto flex max-w-[1280px] items-center justify-between">
                    <button type="button" onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-gray-600 transition hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Matching
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-[8px] font-black tracking-wider text-gray-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            ID REFERENSI : {getReferenceId(project)}
                        </span>

                        <span className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-[9px] font-bold text-white shadow-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-yellow-400" />
                            Data AI Match Dipilih
                        </span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-[1280px] px-6 pt-5">
                <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                    <p className="flex items-center gap-2 text-[9px] font-bold text-gray-500">
                        <span className="text-gray-300">⚑</span>
                        Langkah Berikutnya: Konfirmasi Pickup / Kirim
                    </p>

                    <span className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Siap Diproses
                    </span>
                </div>

                <section className="mb-7">
                    <div className="mb-3 flex flex-wrap gap-2">
                        <StatusBadge tone="yellow">Konfirmasi Tujuan Penyaluran</StatusBadge>
                        <StatusBadge>Dari AI Matching</StatusBadge>
                        {matchScore > 0 && (
                            <StatusBadge tone="green">{matchScore}% Match</StatusBadge>
                        )}
                    </div>

                    <h1 className="text-[32px] font-black tracking-tight text-gray-900">
                        Detail Kebutuhan Proyek
                    </h1>

                    <p className="mt-1.5 max-w-3xl text-[11px] font-medium leading-relaxed text-gray-500">
                        Tinjau detail proyek dan kecocokan material berdasarkan data yang diterima dari AI Match sebelum menentukan metode pengiriman atau penjemputan.
                    </p>
                </section>

                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-7 space-y-4">
                        <section className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <StatusBadge>
                                    <ShieldCheck className="h-3 w-3" />
                                    {validationStatus || 'Status verifikasi tersedia'}
                                </StatusBadge>

                                {project?.urgent && (
                                    <StatusBadge tone="red">
                                        <span className="font-black">*</span>
                                        URGENT
                                    </StatusBadge>
                                )}

                                <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-[8px] font-bold text-gray-600">
                                    {projectCategory}
                                </span>
                            </div>

                            <p className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold text-gray-600">
                                <MapPin className="h-3.5 w-3.5 text-red-500" />
                                <strong className="text-gray-900">{distanceText}</strong>
                                {distanceText !== '-' && ' dari lokasi material'}
                            </p>

                            <h2 className="text-[28px] font-black tracking-tight text-gray-900">
                                {projectName}
                            </h2>

                            <p className="mb-5 flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                                <MapPin className="h-3.5 w-3.5" />
                                {projectLocation}
                            </p>

                            {organization && (
                                <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                                    <Shield className="h-3.5 w-3.5 text-emerald-600" />
                                    <div>
                                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                            Pengelola / Pemohon
                                        </p>
                                        <p className="mt-0.5 text-[9px] font-bold text-gray-800">
                                            {organization}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-[16px] border border-gray-100 bg-gray-100">
                                {hasProjectImage ? (
                                    <img src={projectImage} alt={projectName} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-[#EEF3EE]">
                                        <div className="text-center">
                                            <MapPin className="mx-auto h-8 w-8 text-emerald-500" />
                                            <p className="mt-2 text-[9px] font-bold text-gray-500">
                                                Foto proyek belum tersedia dari AI Match
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-8">
                                    <p className="flex items-center gap-2 text-[8px] font-medium text-white">
                                        <Camera className="h-3.5 w-3.5" />
                                        Dokumentasi proyek
                                    </p>

                                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[7px] font-bold text-gray-800">
                                        Data AI Match
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-[16px] border border-yellow-100 bg-[#FFFAEB] p-4">
                                <p className="mb-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-yellow-700">
                                    <Wrench className="h-3.5 w-3.5" />
                                    Material Akan Digunakan Untuk
                                </p>

                                <h3 className="text-[14px] font-black text-gray-900">
                                    {projectPurpose || neededMaterialName || 'Keterangan penggunaan belum tersedia'}
                                </h3>

                                {projectDescription && (
                                    <p className="mt-2 text-[10px] leading-relaxed text-gray-600">
                                        {projectDescription}
                                    </p>
                                )}

                                {neededMaterialName && (
                                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-yellow-100 bg-white p-2.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                        <p className="text-[9px] font-bold text-gray-700">
                                            Material yang dibutuhkan: {neededMaterialName}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="rounded-[22px] border border-emerald-100 bg-[#F9FDF9] p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-100">
                                    <Shield className="h-5 w-5 text-emerald-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center justify-between gap-4">
                                        <h3 className="text-[12px] font-black text-gray-900">
                                            Informasi Verifikasi
                                        </h3>

                                        <span className="text-[8px] font-bold text-gray-400">
                                            {formatDate(project?.verified_at ?? project?.updated_at)}
                                        </span>
                                    </div>

                                    <p className="mb-3 text-[9px] font-medium text-gray-600">
                                        {validationOfficer
                                            ? `Permintaan diverifikasi oleh ${validationOfficer}.`
                                            : validationStatus
                                                ? `Status verifikasi: ${validationStatus}.`
                                                : 'Informasi verifikasi detail belum dikirim oleh API.'}
                                    </p>

                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                        <p className="text-[9px] italic leading-relaxed text-gray-500">
                                            {validationNote || 'Catatan validasi belum tersedia dari data AI Match.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="col-span-5 space-y-4">
                        <section className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <SectionTitle icon={MapIcon}>
                                    Kecocokan Material
                                </SectionTitle>

                                <span className="rounded-md bg-[#FFCC00] px-2.5 py-1 text-[8px] font-black text-gray-900">
                                    {matchLabel}
                                </span>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                                    <p className="mb-1 text-[7px] font-black uppercase tracking-widest text-gray-400">
                                        Material Kamu
                                    </p>

                                    <p className="text-lg font-black leading-none text-gray-900">
                                        {formatWeight(availableWeight)}
                                    </p>

                                    <p className="mt-1 text-[8px] font-medium text-gray-500">
                                        {materialType} • {formatQuantity(availableQuantity, availableUnit)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-red-100 bg-white p-3 text-center shadow-sm">
                                    <p className="mb-1 text-[7px] font-black uppercase tracking-widest text-red-400">
                                        Kebutuhan Proyek
                                    </p>

                                    <p className="text-lg font-black leading-none text-red-600">
                                        {formatWeight(neededWeight)}
                                    </p>

                                    <p className="mt-1 text-[8px] font-medium text-gray-500">
                                        {neededMaterialName || 'Kebutuhan'} • {formatQuantity(neededQuantity, neededUnit)}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                                <div>
                                    <p className="mb-1 text-[7px] font-black uppercase tracking-widest text-gray-400">
                                        Index Kecocokan
                                    </p>

                                    <p className="text-[10px] font-black text-gray-900">
                                        {matchLabel}
                                    </p>

                                    {matchReason && (
                                        <p className="mt-1.5 max-w-[220px] text-[8px] leading-relaxed text-gray-500">
                                            {matchReason}
                                        </p>
                                    )}
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-gray-900 bg-[#FFCC00] shadow-sm">
                                    <span className="text-sm font-black text-gray-900">
                                        {matchScore}%
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4 rounded-xl border border-yellow-100 bg-[#FFFAEB] p-3.5">
                                <h4 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black text-yellow-900">
                                    <Check className="h-3.5 w-3.5 text-yellow-600" />
                                    Ringkasan alokasi
                                </h4>

                                <p className="text-[9px] leading-relaxed text-gray-600">
                                    {neededWeight !== null && availableWeight !== null
                                        ? `Kebutuhan proyek ${formatWeight(neededWeight)} dibanding material tersedia ${formatWeight(availableWeight)}.`
                                        : neededQuantity !== null && availableQuantity !== null
                                            ? `Kebutuhan proyek ${formatQuantity(neededQuantity, neededUnit)} dibanding material tersedia ${formatQuantity(availableQuantity, availableUnit)}.`
                                            : 'Data kebutuhan dan material belum cukup untuk menghitung alokasi.'}
                                </p>

                                {surplusWeight !== null && surplusWeight > 0 && (
                                    <p className="mt-2 text-[9px] font-bold text-emerald-700">
                                        Estimasi material tersisa: {formatWeight(surplusWeight)}.
                                    </p>
                                )}

                                {surplusWeight !== null && surplusWeight < 0 && (
                                    <p className="mt-2 text-[9px] font-bold text-red-600">
                                        Material kurang sekitar {formatWeight(Math.abs(surplusWeight))} dari kebutuhan.
                                    </p>
                                )}

                                {surplusWeight === 0 && (
                                    <p className="mt-2 text-[9px] font-bold text-emerald-700">
                                        Jumlah material sesuai dengan kebutuhan terdata.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2.5">
                                <InfoRow icon={CheckCircle2} label="Tipe Material">
                                    {materialType}
                                </InfoRow>

                                <InfoRow icon={ShieldCheck} label="Kondisi Mutu">
                                    {materialCondition}
                                </InfoRow>

                                <InfoRow icon={CheckCircle2} label="Kebutuhan">
                                    {formatQuantity(neededQuantity, neededUnit)}
                                </InfoRow>

                                <InfoRow icon={MapPin} label="Lokasi Proyek">
                                    {projectLocation}
                                </InfoRow>
                            </div>
                        </section>

                        <section className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <SectionTitle icon={MapIcon} accent="green">
                                    Rute Distribusi Spasial
                                </SectionTitle>

                                {estimatedDuration && (
                                    <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-[8px] font-bold text-gray-600">
                                        <Clock3 className="h-3 w-3" />
                                        {estimatedDuration}
                                    </span>
                                )}
                            </div>

                            <div className="relative mb-3 h-[220px] overflow-hidden rounded-xl border border-gray-200 bg-[#EEF3EE]">
                                <Map
                                    ref={mapRef}
                                    initialViewState={{ longitude: origin.longitude, latitude: origin.latitude, zoom: 12.8 }}
                                    mapStyle={OSM_STYLE}
                                    style={{ width: '100%', height: '100%' }}
                                    attributionControl={false}
                                    dragRotate={false}
                                    touchZoomRotate={false}
                                >
                                    <NavigationControl position="bottom-right" showCompass={false} />

                                    {routeGeoJSON && (
                                        <Source id="detail-route-source" type="geojson" data={routeGeoJSON}>
                                            <Layer
                                                id="detail-route-line"
                                                type="line"
                                                paint={{
                                                    'line-color': '#10B981',
                                                    'line-width': 4,
                                                    'line-dasharray': [2, 1],
                                                    'line-opacity': 0.9
                                                }}
                                            />
                                        </Source>
                                    )}

                                    <Marker longitude={origin.longitude} latitude={origin.latitude} anchor="center">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-gray-900 bg-[#FFCC00] shadow-md">
                                            <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                                        </div>
                                    </Marker>

                                    {destination && (
                                        <Marker longitude={destination.longitude} latitude={destination.latitude} anchor="center">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-red-500 shadow-md">
                                                <MapPin className="h-3.5 w-3.5 text-white" />
                                            </div>
                                        </Marker>
                                    )}
                                </Map>

                                <div className="absolute left-3 top-3 rounded-xl border border-gray-100 bg-white/95 p-3 shadow-md backdrop-blur">
                                    <div className="relative pl-4">
                                        <span className="absolute left-0 top-1 h-2 w-2 rounded-full border-2 border-gray-900 bg-[#FFCC00]" />

                                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                            Titik Asal Material
                                        </p>

                                        <p className="mt-0.5 max-w-[175px] text-[9px] font-black text-gray-900">
                                            {firstValue(
                                                material?.alamat,
                                                material?.lokasi,
                                                material?.location,
                                                'Lokasi material'
                                            )}
                                        </p>
                                    </div>

                                    {destination && (
                                        <>
                                            <div className="ml-[3px] my-1 h-4 w-0.5 bg-emerald-400" />

                                            <div className="relative pl-4">
                                                <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-red-500" />

                                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                                    Tujuan Penyaluran
                                                </p>

                                                <p className="mt-0.5 max-w-[175px] text-[9px] font-black text-gray-900">
                                                    {projectName}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                                    <span className="flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-[7px] font-bold text-emerald-700 shadow-sm">
                                        <Leaf className="h-2.5 w-2.5" />
                                        OpenStreetMap
                                    </span>

                                    <span className="flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-[7px] font-bold text-yellow-700 shadow-sm">
                                        <Truck className="h-2.5 w-2.5" />
                                        Rute Distribusi
                                    </span>
                                </div>

                                {!hasProjectCoordinates && (
                                    <div className="absolute inset-x-3 bottom-12 rounded-lg border border-yellow-100 bg-[#FFFAEB]/95 px-3 py-2 text-center">
                                        <p className="text-[8px] font-bold text-yellow-800">
                                            Koordinat proyek belum tersedia dari data AI Match.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                                <span className="flex items-center gap-2 text-[8px] font-medium text-gray-600">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                    {accessNote}
                                </span>

                                <span className="text-[8px] font-black text-gray-900">
                                    {distanceText}
                                </span>
                            </div>
                        </section>

                        <section className="rounded-[22px] border border-gray-100 bg-white p-5 text-center shadow-sm">
                            <div className="mb-4 text-left">
                                <h3 className="text-[11px] font-black text-gray-900">
                                    Langkah selanjutnya:
                                </h3>

                                <p className="mt-1.5 text-[9px] leading-relaxed text-gray-500">
                                    Setelah proyek ini dipilih, data hasil AI Match dan data material akan diteruskan ke tahap konfirmasi pengiriman.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="mb-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] py-3.5 text-[10px] font-black text-gray-900 shadow-sm transition hover:bg-yellow-400 active:scale-[0.99]"
                            >
                                {nextButtonLabel}
                                <ArrowRight className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                onClick={onBack}
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-[#FCF9F8] py-3.5 text-[9px] font-bold text-gray-700 transition hover:bg-gray-50"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Pilih Tujuan Lain di Matching
                            </button>

                            <p className="mt-4 flex items-center justify-center gap-1.5 text-[8px] font-bold text-emerald-600">
                                <Lock className="h-3 w-3" />
                                Data proyek dan material diteruskan ke tahap berikutnya
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}