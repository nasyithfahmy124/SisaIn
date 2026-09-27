import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    Edit3,
    Leaf,
    MapPin,
    Package,
    ShieldCheck,
    Sparkles,
    Weight
} from 'lucide-react';

const CATEGORY_OPTIONS = [
    { value: 'material', label: 'Semen & Perekat', description: 'Material konstruksi berbasis semen atau perekat.' },
    { value: 'batu', label: 'Batu & Agregat', description: 'Batu, pasir, kerikil, dan material agregat.' },
    { value: 'dll', label: 'Material Lainnya', description: 'Material konstruksi lain yang masih dapat digunakan.' }
];

const CONDITION_OPTIONS = [
    { value: 'baru', label: 'Kondisi Baru', description: 'Material masih dalam kondisi baru dan belum digunakan.' },
    { value: 'layak', label: 'Layak Pakai', description: 'Material masih dapat digunakan kembali.' },
    { value: 'perbaikan', label: 'Perlu Perbaikan', description: 'Material membutuhkan perbaikan sebelum digunakan.' },
    { value: 'second', label: 'Bekas / Second', description: 'Material sudah pernah digunakan tetapi masih memiliki nilai guna.' }
];

const getImageUrl = (payload) => payload?.url || payload?.preview || payload?.image || null;

const parseNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const normalizeCondition = (value) => {
    const condition = String(value || '').toLowerCase().trim();

    if (condition.includes('baru')) return 'baru';
    if (condition.includes('perbaikan') || condition.includes('perlu')) return 'perbaikan';
    if (condition.includes('second') || condition.includes('bekas')) return 'second';

    return 'layak';
};

const normalizeCategory = (value) => {
    const category = String(value || '').toLowerCase().trim();

    if (category.includes('batu') || category.includes('agregat')) return 'batu';
    if (category.includes('dll') || category.includes('lain')) return 'dll';

    return 'material';
};

const getCategoryLabel = (value) =>
    CATEGORY_OPTIONS.find((item) => item.value === normalizeCategory(value))?.label || 'Semen & Perekat';

const getConditionLabel = (value) =>
    CONDITION_OPTIONS.find((item) => item.value === normalizeCondition(value))?.label || 'Layak Pakai';

const formatWeight = (value) => {
    const weight = parseNumber(value);

    if (!weight) return 'Belum tersedia';

    return `${weight.toLocaleString('id-ID', {
        maximumFractionDigits: 1
    })} kg`;
};

const normalizeAIData = (data = {}) => ({
    ...data,
    nama_material: data.nama_material || data.namaMaterial || data.material || 'Material terdeteksi',
    kategori: normalizeCategory(data.kategori || data.category),
    kondisi_barang: normalizeCondition(data.kondisi_barang || data.kondisi || data.condition),
    bobot: parseNumber(data.bobot ?? data.berat ?? data.weight),
    jumlah: parseNumber(data.jumlah ?? data.quantity, 1),
    satuan: data.satuan || data.unit || 'pcs',
    deskripsi: data.deskripsi || data.description || 'Material terdeteksi dari foto dan dapat digunakan kembali.',
    confidence: data.confidence ?? data.accuracy ?? null,
    kelayakan: data.kelayakan || data.grade || 'Layak'
});

const getConfidence = (value) => {
    if (value === null || value === undefined || value === '') return 'Hasil AI';

    const confidence = Number(value);

    if (!Number.isFinite(confidence)) return 'Hasil AI';

    const percentage = confidence <= 1 ? confidence * 100 : confidence;

    return `${percentage.toFixed(1)}%`;
};

const getOwnerData = () => {
    try {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) return {};

        const user = JSON.parse(storedUser);

        return {
            nama_pemilik: user?.nama_lengkap || user?.nama || user?.username || '',
            no_hp: user?.no_hp || user?.phone || ''
        };
    } catch {
        return {};
    }
};

const SummaryItem = ({ icon: Icon, label, value, accent = false }) => (
    <div className="flex items-start gap-3 rounded-[14px] bg-[#F8F8F6] p-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${accent ? 'bg-[#FFF4BF]' : 'bg-white'}`}>
            <Icon className={`h-3.5 w-3.5 ${accent ? 'text-[#B88C00]' : 'text-gray-500'}`} />
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                {label}
            </p>
            <p className="mt-0.5 break-words text-[10px] font-black leading-[1.35] text-gray-800">
                {value}
            </p>
        </div>
    </div>
);

const FieldLabel = ({ children, required = false }) => (
    <div className="mb-2 flex items-center gap-1">
        <span className="text-[10px] font-black text-gray-700">{children}</span>
        {required && <span className="text-[10px] font-black text-red-500">*</span>}
    </div>
);

const SelectField = ({ value, options, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-full appearance-none rounded-[11px] border border-gray-200 bg-white px-3 pr-9 text-[10px] font-bold text-gray-800 outline-none transition focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
    </div>
);

export default function KonfirmasiDesktop({
    imagePayload,
    finalData,
    onBack,
    onNext
}) {
    const aiData = useMemo(() => normalizeAIData(finalData), [finalData]);
    const ownerData = useMemo(() => getOwnerData(), []);

    const [formData, setFormData] = useState({
        nama_material: aiData.nama_material,
        kategori: aiData.kategori,
        kondisi_barang: aiData.kondisi_barang,
        bobot: aiData.bobot,
        jumlah: aiData.jumlah,
        satuan: aiData.satuan,
        deskripsi: aiData.deskripsi,
        alamat: finalData?.alamat || '',
        lat: finalData?.lat ?? '',
        longitude: finalData?.longitude ?? '',
        catatan: finalData?.catatan || '',
        nama_pemilik: finalData?.nama_pemilik || ownerData.nama_pemilik || '',
        no_hp: finalData?.no_hp || ownerData.no_hp || ''
    });

    useEffect(() => {
        setFormData((current) => ({
            ...current,
            nama_material: aiData.nama_material,
            kategori: aiData.kategori,
            kondisi_barang: aiData.kondisi_barang,
            bobot: aiData.bobot,
            jumlah: aiData.jumlah,
            satuan: aiData.satuan,
            deskripsi: aiData.deskripsi
        }));
    }, [aiData]);

    const imageUrl = getImageUrl(imagePayload);
    const confidenceLabel = getConfidence(aiData.confidence);
    const conditionLabel = getConditionLabel(formData.kondisi_barang);
    const categoryLabel = getCategoryLabel(formData.kategori);

    const updateField = (field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value
        }));
    };

    const handleQuantityChange = (delta) => {
        setFormData((current) => ({
            ...current,
            jumlah: Math.max(1, parseNumber(current.jumlah, 1) + delta)
        }));
    };

    const handleUseAIData = () => {
        onNext?.({
            ...formData,
            aiData,
            analysis: aiData,
            imagePayload
        });
    };

    const handleAddressChange = (event) => {
        updateField('alamat', event.target.value);
    };

    const impactValue = useMemo(() => {
        const weight = parseNumber(formData.bobot);

        if (!weight) return '-';

        return `-${(weight * 0.0022).toFixed(2)} ton CO₂e`;
    }, [formData.bobot]);

    return (
        <div className="min-h-screen bg-[#FCF9F8] pb-24 font-sans text-gray-900">
            <header className="border-b border-gray-100 bg-white/95 px-8 py-4 backdrop-blur">
                <div className="mx-auto flex max-w-[1250px] items-center justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-bold text-gray-600 transition hover:text-gray-900"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali ke Analisis AI
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400">
                            <Check className="h-3 w-3" />
                            01 Foto Material
                        </div>

                        <div className="h-px w-8 bg-gray-200" />

                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400">
                            <Check className="h-3 w-3" />
                            02 Analisis AI
                        </div>

                        <div className="h-px w-8 bg-gray-200" />

                        <div className="flex items-center gap-2 rounded-full bg-[#FFCC00] px-4 py-2 text-[9px] font-black text-gray-900 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                            03 Konfirmasi
                        </div>

                        <div className="h-px w-8 bg-gray-200" />

                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                            04 Distribusi
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1250px] px-6 pt-7">
                <div className="mb-6 flex items-end justify-between gap-6">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#F0D77A] bg-[#FFF8D8] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#8D7000]">
                            <Sparkles className="h-3 w-3" />
                            Hasil Verifikasi AI SisaIn
                        </div>

                        <h1 className="text-[28px] font-black tracking-tight text-gray-900">
                            Konfirmasi Material
                        </h1>

                        <p className="mt-1 max-w-2xl text-[10px] font-medium leading-relaxed text-gray-500">
                            Tinjau dan koreksi data hasil deteksi AI. Pastikan seluruh informasi material sudah benar sebelum dilanjutkan ke tahap distribusi.
                        </p>
                    </div>

                    <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 lg:flex">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[8px] font-black text-emerald-700">
                            Data Analisis Terverifikasi
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-12 items-start gap-6">
                    <aside className="col-span-5 space-y-4">
                        <section className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_5px_22px_rgba(30,25,15,0.04)]">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF1B8]">
                                        <Sparkles className="h-3.5 w-3.5 text-[#A37A00]" />
                                    </div>

                                    <div>
                                        <h2 className="text-[12px] font-black text-gray-900">
                                            Rangkuman AI SisaIn
                                        </h2>
                                        <p className="text-[8px] font-medium text-gray-400">
                                            Sumber data hasil analisis foto
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-black text-emerald-600">
                                    Akurasi {confidenceLabel}
                                </span>
                            </div>

                            <div className="relative mb-4 overflow-hidden rounded-[16px] bg-gray-100">
                                <div className="aspect-[4/3]">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={formData.nama_material}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">
                                            <AlertCircle className="mr-2 h-4 w-4" />
                                            <span className="text-[9px] font-bold">
                                                Foto tidak tersedia
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-2.5 py-1.5 text-[7px] font-black text-gray-700 shadow-md backdrop-blur">
                                    AI Vision Verified
                                </div>
                            </div>

                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                                    Hasil Prediksi Visual
                                </span>

                                <span className="rounded-full bg-[#FFF4B8] px-2 py-1 text-[7px] font-black text-[#927300]">
                                    {conditionLabel}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <SummaryItem
                                    icon={Package}
                                    label="Material Terdeteksi"
                                    value={formData.nama_material}
                                />

                                <SummaryItem
                                    icon={Weight}
                                    label="Estimasi Bobot"
                                    value={`${formatWeight(formData.bobot)} • ${formData.jumlah} ${formData.satuan}`}
                                    accent
                                />

                                <SummaryItem
                                    icon={ShieldCheck}
                                    label="Kondisi Material"
                                    value={`${conditionLabel} • ${aiData.kelayakan || 'Layak'}`}
                                />

                                <SummaryItem
                                    icon={Sparkles}
                                    label="Kategori"
                                    value={categoryLabel}
                                />

                                <div className="rounded-[14px] bg-[#F8F8F6] p-3">
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                            Deskripsi AI
                                        </p>
                                    </div>

                                    <p className="text-[9px] font-medium leading-[1.5] text-gray-600">
                                        {formData.deskripsi}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 rounded-[14px] bg-[#FFF8D8] p-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D9B800]">
                                        <Leaf className="h-3.5 w-3.5 text-white" />
                                    </div>

                                    <div>
                                        <p className="text-[9px] font-black text-[#655100]">
                                            Dampak Lingkungan Potensial
                                        </p>
                                        <p className="mt-0.5 text-[8px] font-medium leading-[1.35] text-[#7D6A17]">
                                            Estimasi penghematan emisi sekitar{' '}
                                            <strong>{impactValue}</strong>{' '}
                                            dibandingkan produksi material baru.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 rounded-[14px] border border-gray-100 bg-gray-50 p-3">
                                <p className="text-[8px] font-bold leading-[1.5] text-gray-500">
                                    Data di atas berasal dari hasil analisis foto AI. Kamu masih dapat memperbaiki informasi sebelum data digunakan pada tahap berikutnya.
                                </p>
                            </div>
                        </section>

                        <section className="rounded-[18px] border border-gray-100 bg-white p-4">
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                    <ShieldCheck className="h-4 w-4 text-gray-500" />
                                </div>

                                <div>
                                    <h3 className="text-[9px] font-black text-gray-800">
                                        Standar Informasi Material SisaIn
                                    </h3>

                                    <p className="mt-1 text-[8px] font-medium leading-[1.45] text-gray-500">
                                        Data material digunakan untuk proses pencocokan kebutuhan, estimasi distribusi, dan pencatatan material pada sistem SisaIn.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </aside>

                    <section className="col-span-12 xl:col-span-7">
                        <div className="rounded-[24px] border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(30,25,15,0.05)]">

                            {/* HEADER */}
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                                            Data Hasil Analisis
                                        </span>

                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-600">
                                            Tersinkron AI
                                        </span>
                                    </div>

                                    <h2 className="text-base font-extrabold leading-tight text-gray-900 sm:text-lg">
                                        Periksa kembali informasi material
                                    </h2>

                                    <p className="mt-1.5 max-w-2xl text-xs font-medium leading-5 text-gray-500">
                                        Informasi berikut otomatis diisi berdasarkan hasil analisis foto.
                                        Kamu dapat mengoreksi data yang kurang sesuai.
                                    </p>
                                </div>

                                <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-500">
                                    <Edit3 className="h-3.5 w-3.5" />
                                    Dapat diedit
                                </div>
                            </div>

                            {/* FORM */}
                            <div className="space-y-5">

                                {/* JENIS MATERIAL */}
                                <div>
                                    <FieldLabel required>
                                        Jenis Material
                                    </FieldLabel>

                                    <div className="relative mt-2">
                                        <input
                                            type="text"
                                            value={formData.nama_material}
                                            onChange={(event) =>
                                                updateField('nama_material', event.target.value)
                                            }
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 pr-11 text-sm font-bold text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-[#FFCC00] focus:bg-white focus:ring-4 focus:ring-[#FFCC00]/15"
                                        />

                                        <CheckCircle2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                    </div>
                                </div>

                                {/* SUB KATEGORI */}
                                <div>
                                    <FieldLabel>
                                        Sub Kategori
                                    </FieldLabel>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {CATEGORY_OPTIONS.map((option) => {
                                            const active = formData.kategori === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() =>
                                                        updateField('kategori', option.value)
                                                    }
                                                    className={`rounded-full border px-4 py-2 text-xs font-extrabold transition-all ${active
                                                            ? 'border-[#E4B800] bg-[#FFF5B8] text-[#755B00] shadow-sm'
                                                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* JUMLAH + SATUAN */}
                                <div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <FieldLabel required>
                                            Jumlah & Satuan Volume
                                        </FieldLabel>

                                        <span className="text-[11px] font-bold text-gray-400">
                                            Estimasi dari AI
                                        </span>
                                    </div>

                                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                        {/* QUANTITY */}
                                        <div className="flex h-11 items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(-1)}
                                                aria-label="Kurangi jumlah"
                                                className="flex h-full w-11 shrink-0 items-center justify-center text-lg font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                                            >
                                                −
                                            </button>

                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.jumlah}
                                                onChange={(event) =>
                                                    updateField(
                                                        'jumlah',
                                                        Math.max(
                                                            1,
                                                            parseNumber(event.target.value, 1)
                                                        )
                                                    )
                                                }
                                                className="h-full min-w-0 flex-1 border-x border-gray-100 bg-white text-center text-sm font-extrabold text-gray-800 outline-none"
                                                aria-label="Jumlah material"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(1)}
                                                aria-label="Tambah jumlah"
                                                className="flex h-full w-11 shrink-0 items-center justify-center text-lg font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* SATUAN */}
                                        <SelectField
                                            value={formData.satuan}
                                            options={[
                                                { value: 'pcs', label: 'pcs / unit' },
                                                { value: 'sak', label: 'sak' },
                                                { value: 'batang', label: 'batang' },
                                                { value: 'kg', label: 'kg' },
                                                { value: 'm3', label: 'm³' }
                                            ]}
                                            onChange={(value) =>
                                                updateField('satuan', value)
                                            }
                                        />
                                    </div>

                                    <div className="mt-2.5 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                                        <p className="font-medium text-gray-400">
                                            Bobot estimasi:{' '}
                                            <strong className="font-extrabold text-gray-700">
                                                {formatWeight(formData.bobot)}
                                            </strong>
                                        </p>

                                        <p className="font-semibold text-emerald-600">
                                            Estimasi AI aktif
                                        </p>
                                    </div>
                                </div>

                                {/* KONDISI MATERIAL */}
                                <div>
                                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                                        <FieldLabel required>
                                            Kondisi Fisik Material
                                        </FieldLabel>

                                        <span className="text-[11px] font-bold text-gray-400">
                                            AI: {conditionLabel}
                                        </span>
                                    </div>

                                    <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {CONDITION_OPTIONS.map((option) => {
                                            const active =
                                                formData.kondisi_barang === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() =>
                                                        updateField(
                                                            'kondisi_barang',
                                                            option.value
                                                        )
                                                    }
                                                    className={`min-h-[96px] rounded-xl border p-3 text-left transition-all ${active
                                                            ? 'border-[#DDB700] bg-[#FFF8D8] shadow-[0_4px_12px_rgba(221,183,0,0.10)]'
                                                            : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white hover:shadow-sm'
                                                        }`}
                                                >
                                                    <div
                                                        className={`mb-2.5 h-2.5 w-2.5 rounded-full ${active
                                                                ? 'bg-[#E0B800]'
                                                                : 'bg-gray-300'
                                                            }`}
                                                    />

                                                    <p
                                                        className={`text-xs font-extrabold leading-4 ${active
                                                                ? 'text-[#765C00]'
                                                                : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {option.label}
                                                    </p>

                                                    <p className="mt-1.5 text-[11px] font-medium leading-4 text-gray-400">
                                                        {option.description}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* LOKASI */}
                                <div>
                                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                                        <FieldLabel required>
                                            Lokasi Penyimpanan / Titik Material
                                        </FieldLabel>

                                        <span className="text-[11px] font-bold text-gray-400">
                                            Digunakan untuk pencocokan lokasi
                                        </span>
                                    </div>

                                    <div className="mt-2.5 flex min-h-[46px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5">
                                        <MapPin className="h-4 w-4 shrink-0 text-[#D7AA00]" />

                                        <input
                                            type="text"
                                            value={formData.alamat}
                                            onChange={handleAddressChange}
                                            placeholder="Masukkan alamat material"
                                            className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-gray-700 outline-none placeholder:text-gray-300"
                                        />

                                        <button
                                            type="button"
                                            className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 text-[11px] font-extrabold text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
                                            onClick={() => {
                                                if (!formData.alamat) {
                                                    updateField('alamat', 'Semarang');
                                                }
                                            }}
                                        >
                                            Atur lokasi
                                        </button>
                                    </div>

                                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-gray-400">
                                                Latitude
                                            </label>

                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={formData.lat}
                                                onChange={(event) =>
                                                    updateField('lat', event.target.value)
                                                }
                                                placeholder="Contoh: -6.9828"
                                                className="h-10 w-full rounded-lg border border-gray-100 bg-gray-50 px-3 text-xs font-medium text-gray-600 outline-none transition focus:border-[#FFCC00] focus:bg-white focus:ring-2 focus:ring-[#FFCC00]/15"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-gray-400">
                                                Longitude
                                            </label>

                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={formData.longitude}
                                                onChange={(event) =>
                                                    updateField(
                                                        'longitude',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Contoh: 110.4092"
                                                className="h-10 w-full rounded-lg border border-gray-100 bg-gray-50 px-3 text-xs font-medium text-gray-600 outline-none transition focus:border-[#FFCC00] focus:bg-white focus:ring-2 focus:ring-[#FFCC00]/15"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* CATATAN */}
                                <div>
                                    <FieldLabel>
                                        Catatan / Informasi Tambahan
                                    </FieldLabel>

                                    <textarea
                                        value={formData.catatan}
                                        onChange={(event) =>
                                            updateField('catatan', event.target.value)
                                        }
                                        rows={4}
                                        placeholder="Tambahkan informasi kondisi, lokasi penyimpanan, atau catatan lainnya..."
                                        className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white p-3.5 text-xs font-medium leading-5 text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-[#FFCC00] focus:ring-4 focus:ring-[#FFCC00]/15"
                                    />
                                </div>

                                {/* STATUS */}
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5 sm:p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-xs font-extrabold text-emerald-800">
                                                    Data siap digunakan
                                                </p>

                                                <span className="w-fit rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                                                    AI Sync
                                                </span>
                                            </div>

                                            <p className="mt-1 text-[11px] font-medium leading-4 text-emerald-700">
                                                Informasi material sudah tersinkron dengan hasil
                                                analisis AI dan siap diteruskan ke proses pencarian
                                                kebutuhan.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER ACTION */}
                            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-extrabold text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Periksa Kembali
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUseAIData}
                                    disabled={!formData.nama_material || !formData.alamat}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFCC00] px-5 text-xs font-extrabold text-gray-900 shadow-[0_6px_18px_rgba(255,204,0,0.20)] transition hover:-translate-y-0.5 hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:min-w-[190px]"
                                >
                                    Gunakan Data & Lanjut
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* INFO CARD */}
                        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF5C7]">
                                    <Sparkles className="h-4 w-4 text-[#B58A00]" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-xs font-extrabold text-gray-800">
                                        Apa langkah selanjutnya setelah konfirmasi?
                                    </h3>

                                    <p className="mt-1.5 text-[11px] font-medium leading-4 text-gray-500">
                                        Setelah data dikonfirmasi, SisaIn akan menggunakan informasi
                                        material untuk mencocokkan kebutuhan sosial atau fasum yang
                                        relevan sebelum proses distribusi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
