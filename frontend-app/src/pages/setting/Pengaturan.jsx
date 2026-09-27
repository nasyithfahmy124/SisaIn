import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Bell,
    Camera,
    Check,
    CheckCircle2,
    ChevronDown,
    CircleUserRound,
    Loader2,
    MapPin,
    Save,
    Shield,
    Sparkles,
    User,
    X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://sisa-in.vercel.app').replace(/\/+$/, '');

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
};

const getFullName = (profile) => (
    [profile?.first_name, profile?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim()
);

const getInitials = (profile) => {
    const name = getFullName(profile);

    if (!name) return 'U';

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('');
};

const SectionHeader = ({ icon: Icon, title, description, open, onClick, accent = 'yellow' }) => (
    <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center gap-4 p-5 text-left transition-all md:p-6 ${
            open
                ? 'bg-[#FFFDF5]'
                : 'bg-white hover:bg-gray-50'
        }`}
    >
        <motion.div
            animate={{
                scale: open ? 1.05 : 1,
                rotate: open ? 0 : -2
            }}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                open
                    ? accent === 'green'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-[#FFCC00] text-gray-900'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
            }`}
        >
            <Icon className="h-5 w-5" />
        </motion.div>

        <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-gray-900">{title}</h3>

                {open && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-full bg-emerald-100 px-2 py-0.5 text-[7px] font-black text-emerald-700"
                    >
                        AKTIF
                    </motion.span>
                )}
            </div>

            <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-gray-500">
                {description}
            </p>
        </div>

        <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
        >
            <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
    </button>
);

const Field = ({ label, name, value, onChange, placeholder, type = 'text', disabled = false }) => (
    <div>
        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-600">
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all ${
                disabled
                    ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-[#FFCC00] focus:ring-4 focus:ring-yellow-100'
            }`}
        />
    </div>
);

const StatusToast = ({ type, message, onClose }) => {
    if (!message) return null;

    const success = type === 'success';

    return (
        <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${
                success
                    ? 'border-emerald-100 bg-emerald-50'
                    : 'border-red-100 bg-red-50'
            }`}
        >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                success
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-600'
            }`}>
                {success ? (
                    <CheckCircle2 className="h-5 w-5" />
                ) : (
                    <X className="h-5 w-5" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className={`text-[10px] font-black ${
                    success ? 'text-emerald-900' : 'text-red-900'
                }`}>
                    {success ? 'Berhasil disimpan' : 'Gagal menyimpan'}
                </p>

                <p className={`mt-0.5 text-[9px] leading-relaxed ${
                    success ? 'text-emerald-700' : 'text-red-700'
                }`}>
                    {message}
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="text-gray-400 transition hover:text-gray-700"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

const CompletionBar = ({ value }) => (
    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-[#FFCC00]"
        />
    </div>
);

export default function Pengaturan() {
    const {
        profile,
        updateProfile,
        refreshProfile,
        isUpdating,
        error: profileError
    } = useProfile();

    const [openSection, setOpenSection] = useState('akun');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        no_tlp: '',
        gender: 'L',
        alamat: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [status, setStatus] = useState({
        type: '',
        message: ''
    });

    const [isDirty, setIsDirty] = useState(false);
    const [savedPulse, setSavedPulse] = useState(false);

    const fileInputRef = useRef(null);
    const previewObjectUrlRef = useRef(null);
    const statusTimerRef = useRef(null);

    useEffect(() => {
        if (!profile) return;

        setFormData({
            first_name: profile?.first_name ?? '',
            last_name: profile?.last_name ?? '',
            no_tlp: profile?.no_tlp ?? '',
            gender: profile?.gender ?? 'L',
            alamat: profile?.alamat ?? ''
        });

        if (!selectedFile) {
            setPreviewUrl(getImageUrl(profile?.image));
        }

        setIsDirty(false);
    }, [profile]);

    useEffect(() => {
        return () => {
            if (previewObjectUrlRef.current) {
                URL.revokeObjectURL(previewObjectUrlRef.current);
            }

            if (statusTimerRef.current) {
                clearTimeout(statusTimerRef.current);
            }
        };
    }, []);

    const fullName = useMemo(() => getFullName(profile), [profile]);

    const initials = useMemo(() => getInitials(profile), [profile]);

    const completeness = useMemo(() => {
        const fields = [
            formData.first_name,
            formData.last_name,
            formData.no_tlp,
            formData.gender,
            formData.alamat
        ];

        const filled = fields.filter(
            (value) => String(value ?? '').trim().length > 0
        ).length;

        return Math.round((filled / fields.length) * 100);
    }, [formData]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        setIsDirty(true);

        setStatus({
            type: '',
            message: ''
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
        }

        const objectUrl = URL.createObjectURL(file);

        previewObjectUrlRef.current = objectUrl;

        setSelectedFile(file);
        setPreviewUrl(objectUrl);
        setIsDirty(true);

        setStatus({
            type: '',
            message: ''
        });
    };

    const handleToggleSection = (section) => {
        setOpenSection((current) => (
            current === section ? null : section
        ));
    };

    const handleSave = async (event) => {
    event.preventDefault();

    setStatus({
        type: '',
        message: ''
    });

    const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        no_tlp: formData.no_tlp.trim(),
        gender: formData.gender,
        alamat: formData.alamat.trim()
    };

    console.log('=== PROFILE UPDATE PAYLOAD ===');
    console.log(payload);

    try {
        await updateProfile(payload);

        setIsDirty(false);
        setSavedPulse(true);

        setStatus({
            type: 'success',
            message: 'Data profil berhasil disimpan.'
        });
    } catch (error) {
        console.error('UPDATE PROFILE ERROR:', error);

        setStatus({
            type: 'error',
            message: error?.message || 'Gagal menyimpan data profil.'
        });
    }
};

    const handleCloseStatus = () => {
        setStatus({
            type: '',
            message: ''
        });
    };

    const handleSecurityClick = () => {
        setStatus({
            type: 'error',
            message: 'Fitur ubah password belum terhubung ke endpoint backend.'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-[#FCF9F8]"
        >
            <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-8 md:py-8">
                <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1.5 rounded-full bg-[#FFF4C4] px-3 py-1 text-[8px] font-black text-yellow-800">
                                <Sparkles className="h-3 w-3" />
                                SISAIN PROFILE
                            </span>

                            {isDirty && (
                                <motion.span
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="rounded-full bg-orange-100 px-3 py-1 text-[8px] font-black text-orange-700"
                                >
                                    Perubahan belum disimpan
                                </motion.span>
                            )}
                        </div>

                        <h1 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
                            Pengaturan Akun
                        </h1>

                        <p className="mt-1.5 max-w-2xl text-[10px] font-medium leading-relaxed text-gray-500 md:text-[11px]">
                            Kelola identitas, kontak, alamat, notifikasi, dan keamanan akun SISAIN dari satu tempat.
                        </p>
                    </div>

                    <motion.div
                        animate={savedPulse ? {
                            scale: [1, 1.04, 1],
                            y: [0, -2, 0]
                        } : { scale: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                    >
                        <motion.div
                            animate={savedPulse ? {
                                rotate: [0, -8, 8, 0]
                            } : { rotate: 0 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
                        >
                            <CircleUserRound className="h-5 w-5" />
                        </motion.div>

                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                Status Profil
                            </p>

                            <p className="mt-0.5 text-[10px] font-black text-gray-900">
                                {completeness}% Lengkap
                            </p>
                        </div>

                        <CompletionBar value={completeness} />
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    <StatusToast
                        key={`${status.type}-${status.message}`}
                        type={status.type}
                        message={status.message}
                        onClose={handleCloseStatus}
                    />
                </AnimatePresence>

                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                    className="relative mb-6 overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm"
                >
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#FFCC00]/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-emerald-100/40 blur-3xl" />

                    <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-7">
                        <div className="flex items-center gap-4">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] border-4 border-white bg-gray-100 shadow-md"
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profil"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                        <User className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                    <Camera className="h-5 w-5 text-white" />
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.08 }}
                                    className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#FFCC00]"
                                >
                                    <Camera className="h-3 w-3 text-gray-900" />
                                </motion.div>
                            </motion.button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-black text-gray-900">
                                        {fullName || 'Pengguna SISAIN'}
                                    </h2>

                                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[7px] font-black text-emerald-700">
                                        <Check className="h-2.5 w-2.5" />
                                        AKUN AKTIF
                                    </span>
                                </div>

                                <p className="mt-1 text-[9px] font-medium text-gray-500">
                                    {profile?.email || 'Email akun'}
                                </p>

                                <p className="mt-2 flex items-center gap-1.5 text-[8px] font-bold text-gray-400">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                                        {initials}
                                    </span>
                                    Data profil tersinkron dengan server
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                    Telepon
                                </p>

                                <p className="mt-1 truncate text-[9px] font-black text-gray-900">
                                    {formData.no_tlp || 'Belum diisi'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                                    Lokasi
                                </p>

                                <p className="mt-1 truncate text-[9px] font-black text-gray-900">
                                    {formData.alamat ? 'Tersimpan' : 'Belum diisi'}
                                </p>
                            </div>

                            <div className="col-span-2 rounded-xl bg-[#FFF9E6] px-3 py-2.5 sm:col-span-1">
                                <p className="text-[7px] font-black uppercase tracking-widest text-yellow-700">
                                    Profil
                                </p>

                                <p className="mt-1 text-[9px] font-black text-gray-900">
                                    {completeness}% lengkap
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
                    <div className="border-b border-gray-100">
                        <SectionHeader
                            icon={User}
                            title="Informasi Akun"
                            description="Kelola nama, email, nomor telepon, foto profil, dan jenis kelamin."
                            open={openSection === 'akun'}
                            onClick={() => handleToggleSection('akun')}
                        />

                        <AnimatePresence initial={false}>
                            {openSection === 'akun' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <form
                                        onSubmit={handleSave}
                                        className="border-t border-gray-100 bg-gray-50/50 p-5 md:p-6"
                                    >
                                        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <Field
                                                label="Nama Depan"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                placeholder="Masukkan nama depan"
                                            />

                                            <Field
                                                label="Nama Belakang"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                placeholder="Masukkan nama belakang"
                                            />

                                            <Field
                                                label="Email"
                                                name="email"
                                                value={profile?.email || ''}
                                                disabled
                                            />

                                            <Field
                                                label="Nomor Telepon"
                                                name="no_tlp"
                                                value={formData.no_tlp}
                                                onChange={handleChange}
                                                placeholder="08xxxxxxxxxx"
                                                type="tel"
                                            />

                                            <div>
                                                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-600">
                                                    Jenis Kelamin
                                                </label>

                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition hover:border-gray-300 focus:border-[#FFCC00] focus:ring-4 focus:ring-yellow-100"
                                                >
                                                    <option value="L">Laki-laki</option>
                                                    <option value="P">Perempuan</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    animate={isUpdating ? {
                                                        scale: [1, 1.06, 1]
                                                    } : {}}
                                                    transition={{
                                                        duration: 0.7,
                                                        repeat: isUpdating ? Infinity : 0
                                                    }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </motion.div>

                                                <div>
                                                    <p className="text-[9px] font-black text-gray-900">
                                                        Sinkronisasi Profil
                                                    </p>

                                                    <p className="mt-0.5 text-[8px] font-medium text-gray-500">
                                                        Perubahan disimpan ke server dan dimuat kembali.
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isUpdating || !isDirty}
                                                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[9px] font-black transition-all ${
                                                    isUpdating || !isDirty
                                                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                        : 'bg-gray-900 text-white shadow-sm hover:bg-gray-800 active:scale-[0.98]'
                                                }`}
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        MENYIMPAN
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4" />
                                                        SIMPAN PERUBAHAN
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="border-b border-gray-100">
                        <SectionHeader
                            icon={MapPin}
                            title="Alamat & Lokasi"
                            description="Atur alamat utama yang digunakan untuk distribusi material."
                            open={openSection === 'alamat'}
                            onClick={() => handleToggleSection('alamat')}
                            accent="green"
                        />

                        <AnimatePresence initial={false}>
                            {openSection === 'alamat' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <form
                                        onSubmit={handleSave}
                                        className="border-t border-gray-100 bg-gray-50/50 p-5 md:p-6"
                                    >
                                        <div className="rounded-2xl border border-emerald-100 bg-[#F4FBF5] p-4">
                                            <div className="mb-4 flex items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                                    <MapPin className="h-5 w-5" />
                                                </div>

                                                <div>
                                                    <h4 className="text-[10px] font-black text-gray-900">
                                                        Lokasi Utama Material
                                                    </h4>

                                                    <p className="mt-1 text-[8px] font-medium leading-relaxed text-gray-500">
                                                        Alamat ini akan digunakan kembali pada proses distribusi material.
                                                    </p>
                                                </div>
                                            </div>

                                            <textarea
                                                name="alamat"
                                                value={formData.alamat}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="Masukkan alamat lengkap lokasi material..."
                                                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition hover:border-gray-300 focus:border-[#FFCC00] focus:ring-4 focus:ring-yellow-100"
                                            />

                                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-2 text-[8px] font-medium text-gray-500">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                    Alamat tersimpan pada profile akun
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isUpdating || !isDirty}
                                                    className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[9px] font-black transition ${
                                                        isUpdating || !isDirty
                                                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                            : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 active:scale-[0.98]'
                                                    }`}
                                                >
                                                    {isUpdating ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Save className="h-4 w-4" />
                                                    )}
                                                    SIMPAN ALAMAT
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="border-b border-gray-100">
                        <SectionHeader
                            icon={Bell}
                            title="Notifikasi"
                            description="Atur informasi dan pembaruan yang ingin diterima."
                            open={openSection === 'notifikasi'}
                            onClick={() => handleToggleSection('notifikasi')}
                        />

                        <AnimatePresence initial={false}>
                            {openSection === 'notifikasi' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-5 md:p-6">
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-yellow-200 hover:bg-[#FFFDF5]">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="h-4 w-4 rounded border-gray-300 text-[#FFCC00] focus:ring-[#FFCC00]"
                                                />

                                                <div>
                                                    <p className="text-[9px] font-black text-gray-900">
                                                        Pembaruan Status Distribusi
                                                    </p>

                                                    <p className="mt-0.5 text-[8px] text-gray-500">
                                                        Terima informasi terkait material dan distribusi.
                                                    </p>
                                                </div>
                                            </label>

                                            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-yellow-200 hover:bg-[#FFFDF5]">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="h-4 w-4 rounded border-gray-300 text-[#FFCC00] focus:ring-[#FFCC00]"
                                                />

                                                <div>
                                                    <p className="text-[9px] font-black text-gray-900">
                                                        Berita Acara & Sertifikat
                                                    </p>

                                                    <p className="mt-0.5 text-[8px] text-gray-500">
                                                        Beri tahu saat dokumen distribusi tersedia.
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div>
                        <SectionHeader
                            icon={Shield}
                            title="Keamanan"
                            description="Pengaturan keamanan akun dan perlindungan akses."
                            open={openSection === 'keamanan'}
                            onClick={() => handleToggleSection('keamanan')}
                            accent="green"
                        />

                        <AnimatePresence initial={false}>
                            {openSection === 'keamanan' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-5 md:p-6">
                                        <div className="rounded-2xl border border-amber-100 bg-[#FFFBEB] p-4">
                                            <div className="flex items-start gap-3">
                                                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                                                <div>
                                                    <h4 className="text-[10px] font-black text-gray-900">
                                                        Perlindungan Akun
                                                    </h4>

                                                    <p className="mt-1 text-[8px] leading-relaxed text-gray-600">
                                                        Gunakan kata sandi yang kuat dan jangan membagikan informasi login kepada pihak lain.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <input
                                                type="password"
                                                placeholder="Kata sandi baru"
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-[#FFCC00] focus:ring-4 focus:ring-yellow-100"
                                            />

                                            <input
                                                type="password"
                                                placeholder="Ulangi kata sandi baru"
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-[#FFCC00] focus:ring-4 focus:ring-yellow-100"
                                            />
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleSecurityClick}
                                                className="rounded-xl bg-gray-900 px-5 py-3 text-[9px] font-black text-white transition hover:bg-gray-800 active:scale-[0.98]"
                                            >
                                                PERBARUI KEAMANAN
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-5 flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E6] text-yellow-700">
                        <Sparkles className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-[9px] font-black text-gray-900">
                            Data profil digunakan kembali saat distribusi
                        </p>

                        <p className="mt-1 text-[8px] font-medium leading-relaxed text-gray-500">
                            Nama, nomor telepon, dan alamat yang tersimpan di server dapat digunakan kembali pada proses penyaluran material.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}