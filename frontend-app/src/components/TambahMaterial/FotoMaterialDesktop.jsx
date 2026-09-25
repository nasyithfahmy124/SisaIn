import React, { useEffect, useRef, useState } from 'react';
import {
    Camera, Image as ImageIcon, CheckCircle2, XCircle,
    Cpu, MapPin, Leaf, ShieldCheck, ArrowRight, Lightbulb,
    Check, AlertCircle, Box, Truck, Building2, UploadCloud,
    X, RotateCcw
} from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB sesuai desain

export default function FotoMaterial({ onNextStep }) {
    // Refs
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // States
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState('');

    // Cleanup
    useEffect(() => {
        return () => {
            stopCamera();
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // File Handling
    const handleFileSelect = (file) => {
        if (!file) return;
        setError('');

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Format foto harus JPG, PNG, atau WEBP.');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError('Ukuran foto maksimal 15 MB.');
            return;
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleInputChange = (e) => {
        handleFileSelect(e.target.files?.[0]);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    // Camera Logic
    const openCamera = async () => {
        setError('');
        setCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setCameraReady(true);
            }
        } catch (err) {
            setCameraOpen(false);
            setCameraReady(false);
            setError('Akses kamera ditolak atau tidak ditemukan.');
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setCameraReady(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !cameraReady) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `material-${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFileSelect(file);
            stopCamera();
            setCameraOpen(false);
        }, 'image/jpeg', 0.92);
    };

    // Simulation
    const handleSimulate = (type) => {
        const dummyUrl = type === 'semen'
            ? 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600'
            : 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600';
        setPreviewUrl(dummyUrl);
        setSelectedFile({ name: `Simulasi ${type}.jpg`, size: 1024, type: 'image/jpeg' }); // Mock file
    };

    const handleSubmit = () => {
        if (!selectedFile) return;
        onNextStep?.({ file: selectedFile, preview: previewUrl });
    };

    return (
        <div className="min-h-screen bg-[#FCF9F8] font-sans pb-20 relative overflow-hidden">

            {/* Background Radial Glows */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FFCC00]/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute top-[13%] right-[5%] w-[250px] h-[250px] bg-emerald-300/20 blur-[30px] rounded-full pointer-events-none z-0"></div>

            {/* Header & Stepper */}
            <div className="relative pt-8 pb-12 z-10">
                <div className="max-w-[1200px] mx-auto px-6">
                    <p className="text-[11px] font-bold text-gray-500 mb-6">Beranda &gt; <span className="text-gray-900">Tambah Material</span></p>

                    {/* Stepper (Sesuai Desain) */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="flex items-center gap-2 bg-[#FFCC00] px-5 py-2 rounded-full shadow-sm">
                            <span className="text-[10px] font-black">01</span>
                            <span className="text-[11px] font-bold">Foto Material</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-[10px] font-black">02</span>
                            <span className="text-[11px] font-bold">Analisis AI</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-[10px] font-black">03</span>
                            <span className="text-[11px] font-bold">Konfirmasi</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-[10px] font-black">04</span>
                            <span className="text-[11px] font-bold">Distribusi</span>
                        </div>
                    </div>

                    {/* Judul Utama (Hero Centered) */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-100/50 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase mb-4 border border-emerald-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Sistem Deteksi Sirkular Pintar V2.4
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Apa material surplus yang ingin kamu sirkulasikan?</h1>
                        <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xl text-center">
                            Cukup unggah foto material sisa proyekmu. AI Sisain akan mendeteksi jenis material, estimasi volume, dan kelayakan kondisinya secara otomatis.
                        </p>
                    </div>
                </div>
            </div>

            {/* Konten Utama 2 Kolom */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* KOLOM KIRI (Upload Area) */}
                <div className="lg:col-span-7">
                    <div
                        className={`bg-white rounded-3xl p-8 relative transition-all duration-300 border-2 border-dashed ${isDragging ? 'border-yellow-400 bg-yellow-50/50' : 'border-transparent shadow-sm'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        {/* Corner Markers */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gray-300"></div>
                        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-300"></div>
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gray-300"></div>
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-300"></div>

                        {previewUrl ? (
                            /* State Preview */
                            <div className="flex flex-col items-center justify-center min-h-[400px]">
                                <div className="relative w-full max-w-md h-64 rounded-2xl overflow-hidden shadow-lg mb-6 group">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setPreviewUrl(null); setSelectedFile(null); }} className="bg-white/20 hover:bg-white/40 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold transition-colors">
                                            Hapus & Ganti Foto
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-1">Foto Berhasil Diunggah!</h3>
                                <p className="text-xs text-gray-500 font-medium">Sistem siap melakukan analisis volumetrik.</p>
                            </div>
                        ) : (
                            /* State Kosong (Upload Form) */
                            <div className="flex flex-col items-center text-center">
                                {/* Kategori Tags */}
                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {['Semen Sak', 'Ubin & Keramik', 'Baja & Besi Beton', 'Bata Ringan', 'Kayu Kaso', 'Cat Dinding'].map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full">{tag}</span>
                                    ))}
                                </div>

                                {/* Placeholder Image */}
                                <div className="relative w-full max-w-md h-48 rounded-2xl overflow-hidden mb-8 bg-gray-100">
                                    <img src="/src/assets/img/semen-placeholder.jpg" alt="Contoh" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left">
                                        <div className="inline-block bg-[#FFCC00] text-gray-900 text-[9px] font-black px-2 py-1 rounded mb-1">Contoh Format Ideal</div>
                                        <p className="text-white text-[11px] font-medium leading-tight">Sudut foto simetris dengan jarak 1.5m memudahkan pemindaian volumetrik AI.</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-gray-900 mb-1">Tarik & lepas foto material ke sini</h3>
                                <p className="text-xs font-medium text-gray-500 mb-6">atau klik tombol di bawah untuk memilih file dari penyimpanan Anda</p>

                                {/* Tombol Aksi */}
                                <div className="flex w-full max-w-md gap-2.5">
                                    <button
                                        onClick={openCamera}
                                        type="button"
                                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#292824] px-4 text-[12px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#171613] active:translate-y-0"
                                    >
                                        <Camera className="h-4 w-4 shrink-0" />
                                        <span>Buka Kamera</span>
                                    </button>

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        type="button"
                                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#E0DDD6] bg-[#F6F5F2] px-4 text-[12px] font-bold text-[#45423C] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm active:translate-y-0"
                                    >
                                        <ImageIcon className="h-4 w-4 shrink-0" />
                                        <span>Galeri / Berkas</span>
                                    </button>
                                </div>

                                {error && <p className="mt-4 text-[10px] font-bold text-red-500">{error}</p>}

                                <p className="text-[10px] font-medium text-gray-400 mt-6 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Mendukung format JPG, PNG, WEBP - Maksimal 15 MB per foto
                                </p>
                            </div>
                        )}

                        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleInputChange} className="hidden" />
                    </div>

                    {!previewUrl && (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#EEE4BF] bg-[#FFFDF5] px-3 py-2">
                            <div className="flex min-w-0 items-center gap-1.5">
                                <Lightbulb className="h-3.5 w-3.5 shrink-0 text-[#B18C00]" />
                                <span className="truncate text-[9px] font-semibold text-[#716B5D]">
                                    Gunakan foto contoh untuk uji coba instan
                                </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                <button onClick={() => handleSimulate('semen')} type="button" className="h-8 rounded-full border border-[#E5E0D5] bg-white px-2 text-[6px] font-bold leading-none text-[#5B574F] transition hover:bg-[#FAF9F4] active:scale-95">
                                    Palet Semen
                                </button>

                                <button onClick={() => handleSimulate('keramik')} type="button" className="h-8 rounded-full border border-[#E5E0D5] bg-white px-2 text-[6px] font-bold leading-none text-[#5B574F] transition hover:bg-[#FAF9F4] active:scale-95">
                                    Tumpukan Keramik
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* KOLOM KANAN (Info & Action) */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Card 1: Tips */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <Camera className="w-4 h-4 text-yellow-700" />
                                </div>
                                Tips Foto Material Optimal
                            </h3>
                            <span className="bg-gray-100 text-gray-600 text-[9px] font-black px-2 py-1 rounded-md">Akurasi 98%</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">1</span>
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-900 mb-0.5">Material Tampak Jelas</h4>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">Pastikan seluruh tumpukan atau unit sisa terlihat tanpa terhalang terpal pekat, plastik gelap, atau puing sampah domestik.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">2</span>
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-900 mb-0.5">Hindari Foto Buram / Gelap</h4>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">Gunakan pencahayaan alami atau nyalakan lampu kerja proyek agar tekstur, ketebalan, dan merk/grade cetakan dapat terbaca oleh model OCR.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">3</span>
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-900 mb-0.5">Sertakan Konteks Sekitar</h4>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">Beri jarak 1-2 meter dengan menyertakan lantai atau palet kayu agar AI Sisain bisa mengukur skala perbandingan volume secara akurat.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Bagus: Sudut 45° melebar
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500">
                                <XCircle className="w-3.5 h-3.5" /> Hindari: Close-up ekstrem
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[22px] border border-[#E7E3DA] bg-[radial-gradient(circle_at_0%_0%,rgba(255,216,55,0.95)_0%,rgba(255,216,55,0.6)_18%,rgba(255,239,157,0.3)_34%,rgba(255,255,255,0)_58%),linear-gradient(145deg,#FFF4B8_0%,#FFFDF8_42%,#FFFFFF_100%)] p-5 shadow-[0_6px_18px_rgba(35,30,20,0.07)]">
                        <div className="relative z-10 mb-4 flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#292824]">
                                <Cpu className="h-4 w-4 text-[#FFCC00]" />
                            </div>

                            <div>
                                <h3 className="text-[15px] font-black leading-tight tracking-[-0.2px] text-[#26241F]">
                                    Bagaimana AI Sisain Membantu?
                                </h3>
                                <p className="mt-0.5 text-[9px] font-medium leading-tight text-[#716D64]">
                                    Otomatisasi pengkatalogan tanpa input formulir manual
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-2.5">
                            <div className="flex items-center gap-2.5 rounded-[14px] bg-white px-2.5 py-2.5 shadow-[0_2px_8px_rgba(35,30,20,0.04)]">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#DFF7EA]">
                                    <Box className="h-4 w-4 text-[#008563]" />
                                </div>

                                <div className="min-w-0">
                                    <h4 className="text-[10px] font-black leading-[1.25] text-[#302E29]">
                                        Estimasi Kilogram & Satuan Otomatis
                                    </h4>
                                    <p className="mt-0.5 text-[9px] font-medium leading-[1.4] text-[#79746B]">
                                        Konversi tumpukan fisik menjadi satuan standar proyek (sak/m²/batang).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 rounded-[14px] bg-white px-2.5 py-2.5 shadow-[0_2px_8px_rgba(35,30,20,0.04)]">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#FFF1B8]">
                                    <MapPin className="h-4 w-4 text-[#A18400]" />
                                </div>

                                <div className="min-w-0">
                                    <h4 className="text-[10px] font-black leading-[1.25] text-[#302E29]">
                                        Rekomendasi Fasum & Warga Terdekat
                                    </h4>
                                    <p className="mt-0.5 text-[9px] font-medium leading-[1.4] text-[#79746B]">
                                        Mencocokkan surplus dengan balai warga, renovasi posyandu, atau bank material.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 rounded-[14px] bg-white px-2.5 py-2.5 shadow-[0_2px_8px_rgba(35,30,20,0.04)]">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#FDE1DE]">
                                    <Leaf className="h-4 w-4 text-[#D45B4D]" />
                                </div>

                                <div className="min-w-0">
                                    <h4 className="text-[10px] font-black leading-[1.25] text-[#302E29]">
                                        Kalkulasi Emisi Karbon Terhindar
                                    </h4>
                                    <p className="mt-0.5 text-[9px] font-medium leading-[1.4] text-[#79746B]">
                                        Sertifikat kontribusi dekarbonisasi otomatis masuk ke profil donatur Anda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Action */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[11px] font-bold text-gray-600">Status Foto Material:</span>
                            {previewUrl ? (
                                <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Siap Dianalisis</span>
                            ) : (
                                <span className="text-[10px] font-bold text-yellow-600 underline cursor-pointer" onClick={() => handleSimulate('semen')}>Simulasikan Foto Terunggah</span>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!previewUrl}
                            className={`w-full py-3.5 rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${previewUrl
                                ? 'bg-[#FFCC00] hover:bg-yellow-400 text-gray-900 shadow-md hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Analisis dengan AI <ArrowRight className="w-4 h-4" />
                        </button>

                        {!previewUrl && (
                            <p className="text-[9px] text-gray-500 font-medium text-center mt-3 flex items-center justify-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Pilih atau ambil foto material terlebih dahulu untuk melanjutkan ke tahap analisis AI.
                            </p>
                        )}

                        <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div>
                                <h4 className="text-[10px] font-black text-gray-900 mb-1">Privasi Terjaga Sepenuhnya</h4>
                                <p className="text-[9px] text-gray-500 leading-relaxed">Foto hanya digunakan oleh AI Sisain untuk validasi kelayakan material dan pencocokan kebutuhan fasum. Koordinat privat hunian Anda tidak akan dipublikasikan secara terbuka.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Stats */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 mt-12 mb-8">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">
                            <Leaf className="w-4 h-4" /> Dampak Nyata
                        </div>
                        <p className="text-[10px] font-medium text-gray-500 leading-relaxed">Sirkulasi material surplus proyek dari seluruh donatur pekan ini.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center shrink-0"><Box className="w-6 h-6 text-yellow-700" /></div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 leading-tight">18.420 kg</h4>
                            <p className="text-[10px] font-semibold text-gray-500">Material Terselamatkan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0"><Truck className="w-6 h-6 text-emerald-700" /></div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 leading-tight">42 Rit Truk</h4>
                            <p className="text-[10px] font-semibold text-gray-500">Limbah Padat Teralihkan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0"><Building2 className="w-6 h-6 text-red-600" /></div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 leading-tight">37 Fasilitas</h4>
                            <p className="text-[10px] font-semibold text-gray-500">Menerima Bantuan Material</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Kamera */}
            {cameraOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    {/* ... (Kode modal kamera tidak ada perubahan) ... */}
                    <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h3 className="text-base font-black text-gray-900">Ambil Foto Material</h3>
                                <p className="text-[10px] text-gray-500 mt-0.5">Posisikan material di tengah bingkai</p>
                            </div>
                            <button onClick={() => { stopCamera(); setCameraOpen(false); }} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="relative aspect-video bg-black flex items-center justify-center">
                            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />

                            {/* Overlay Frame AI */}
                            <div className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-white/40">
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                    <div className="bg-gray-900/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Mode Deteksi AI
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#FFCC00] animate-[spin_10s_linear_infinite] flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full"></div>
                                    </div>
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/60 backdrop-blur text-white text-[9px] font-black px-3 py-1 rounded-full tracking-widest">
                                        FOKUS
                                    </div>
                                </div>
                            </div>

                            {!cameraReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <p className="text-xs font-bold text-white flex items-center gap-2">
                                        <RotateCcw className="w-4 h-4 animate-spin" /> Mengakses kamera...
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-4 px-6 py-5 bg-white">
                            <button onClick={() => { stopCamera(); setCameraOpen(false); }} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50">
                                Batal
                            </button>
                            <button onClick={capturePhoto} disabled={!cameraReady} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#FFCC00] px-4 py-3 text-xs font-black text-gray-900 hover:bg-yellow-400 disabled:opacity-50">
                                <Camera className="h-4 w-4" /> Ambil Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Canvas untuk Capture Camera */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}