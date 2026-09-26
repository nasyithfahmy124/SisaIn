import React, { useEffect, useRef, useState } from 'react';
import { Camera, Image as ImageIcon, CheckCircle2, XCircle, Cpu, ArrowRight, Lightbulb, Check, AlertCircle, Box, ShieldCheck, X, RotateCcw, Loader2, UploadCloud } from 'lucide-react';
import { useAiRedistribusi } from '../../hooks/useAiRedistribusi';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const MATERIAL_TAGS = ['Semen Sak', 'Ubin & Keramik', 'Baja & Besi Beton', 'Bata Ringan', 'Kayu Kaso', 'Cat Dinding'];

const createPreview = (file) => URL.createObjectURL(file);

const formatFileSize = (size = 0) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FotoMaterialDesktop({ onNextStep, isAILoading: externalLoading = false }) {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const previewRef = useRef(null);

    const { analyzeImage, isLoading: aiLoading, error: aiError } = useAiRedistribusi();

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState('');

    const isAILoading = externalLoading || aiLoading;

    const revokePreview = () => {
        if (previewRef.current) {
            URL.revokeObjectURL(previewRef.current);
            previewRef.current = null;
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setCameraReady(false);
    };

    const closeCamera = () => {
        stopCamera();
        setCameraOpen(false);
    };

    const setFilePreview = (file) => {
        revokePreview();

        const url = createPreview(file);
        previewRef.current = url;

        setSelectedFile(file);
        setPreviewUrl(url);
    };

    const validateFile = (file) => {
        if (!file) return 'Foto material belum dipilih.';
        if (!ACCEPTED_TYPES.includes(file.type)) return 'Format foto harus JPG, PNG, atau WEBP.';
        if (file.size > MAX_FILE_SIZE) return 'Ukuran foto maksimal 15 MB.';
        return '';
    };

    const handleFileSelect = (file) => {
        const validationError = validateFile(file);

        setError(validationError);
        if (validationError) return;

        setFilePreview(file);
    };

    const handleInputChange = (event) => {
        handleFileSelect(event.target.files?.[0]);
        event.target.value = '';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelect(event.dataTransfer.files?.[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const openFilePicker = () => fileInputRef.current?.click();

    const openCamera = async () => {
        setError('');
        setCameraOpen(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });

            streamRef.current = stream;

            if (!videoRef.current) return;

            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setCameraReady(true);
        } catch (cameraError) {
            setCameraOpen(false);
            setCameraReady(false);

            if (cameraError?.name === 'NotAllowedError') {
                setError('Akses kamera ditolak. Izinkan kamera melalui pengaturan browser.');
            } else if (cameraError?.name === 'NotFoundError') {
                setError('Kamera tidak ditemukan pada perangkat ini.');
            } else {
                setError('Kamera tidak dapat digunakan. Silakan gunakan upload foto.');
            }
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !cameraReady) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) {
                setError('Foto dari kamera gagal diproses.');
                return;
            }

            const file = new File([blob], `material-${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFileSelect(file);
            closeCamera();
        }, 'image/jpeg', 0.92);
    };

    const removePhoto = () => {
        revokePreview();
        setSelectedFile(null);
        setPreviewUrl(null);
        setError('');
    };

    const handleSubmit = async () => {
        if (!selectedFile || isAILoading) {
            if (!selectedFile) setError('Pilih atau ambil foto material terlebih dahulu.');
            return;
        }

        setError('');

        try {
            const aiData = await analyzeImage({ file: selectedFile });

            onNextStep?.({
                file: selectedFile,
                preview: previewUrl,
                url: previewUrl,
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                aiData,
                isSimulated: false
            });
        } catch (submitError) {
            setError(submitError?.message || aiError || 'Gagal menghubungkan foto dengan AI.');
        }
    };

    const handleExampleImage = async () => {
        try {
            setError('');

            const response = await fetch('/src/assets/img/semen_test_sisain.jpg');

            if (!response.ok) throw new Error('Foto contoh tidak dapat dimuat.');

            const blob = await response.blob();
            const file = new File([blob], 'contoh-semen-sisain.jpg', { type: blob.type || 'image/jpeg' });

            handleFileSelect(file);
        } catch (exampleError) {
            setError(exampleError.message || 'Foto contoh tidak dapat digunakan.');
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
            revokePreview();
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#FCF9F8] pb-20 font-sans">
            <div className="pointer-events-none absolute left-1/2 top-[10%] z-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#FFCC00]/15 blur-[120px]" />
            <div className="pointer-events-none absolute right-[5%] top-[13%] z-0 h-[250px] w-[250px] rounded-full bg-emerald-300/20 blur-[30px]" />

            <div className="relative z-10 pb-12 pt-8">
                <div className="mx-auto max-w-[1200px] px-6">
                    <p className="mb-6 text-[11px] font-bold text-gray-500">Beranda &gt; <span className="text-gray-900">Tambah Material</span></p>

                    <div className="mb-12 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 rounded-full bg-[#FFCC00] px-5 py-2 shadow-sm"><span className="text-[10px] font-black">01</span><span className="text-[11px] font-bold">Foto Material</span></div>
                        <div className="h-px w-8 bg-gray-300" />
                        <div className="flex items-center gap-2 text-gray-400"><span className="text-[10px] font-black">02</span><span className="text-[11px] font-bold">Analisis AI</span></div>
                        <div className="h-px w-8 bg-gray-300" />
                        <div className="flex items-center gap-2 text-gray-400"><span className="text-[10px] font-black">03</span><span className="text-[11px] font-bold">Konfirmasi</span></div>
                        <div className="h-px w-8 bg-gray-300" />
                        <div className="flex items-center gap-2 text-gray-400"><span className="text-[10px] font-black">04</span><span className="text-[11px] font-bold">Distribusi</span></div>
                    </div>

                    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-100/50 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Sistem Deteksi Sirkular Pintar V2.4</div>
                        <h1 className="mb-3 text-3xl font-black tracking-tight text-gray-900">Apa material surplus yang ingin kamu sirkulasikan?</h1>
                        <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-600">Cukup unggah foto material sisa proyekmu. AI Sisain akan mendeteksi jenis material, estimasi volume, dan kelayakan kondisinya secara otomatis.</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <div className={`relative rounded-3xl border-2 border-dashed bg-white p-8 transition-all duration-300 ${isDragging ? 'border-yellow-400 bg-yellow-50/50' : 'border-transparent shadow-sm'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <div className="absolute left-4 top-4 h-4 w-4 border-l-2 border-t-2 border-gray-300" />
                        <div className="absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-gray-300" />
                        <div className="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-gray-300" />
                        <div className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-gray-300" />

                        {previewUrl ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center">
                                <div className="group relative mb-6 h-64 w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
                                    <img src={previewUrl} alt="Preview material" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button type="button" onClick={removePhoto} className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur transition-colors hover:bg-white/40">Hapus & Ganti Foto</button>
                                    </div>
                                </div>

                                <h3 className="mb-1 text-lg font-black text-gray-900">Foto Berhasil Diunggah!</h3>
                                <p className="text-xs font-medium text-gray-500">{selectedFile?.name} • {formatFileSize(selectedFile?.size)}</p>

                                <div className="mt-3 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold text-emerald-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />File siap dikirim ke AI
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-8 flex flex-wrap justify-center gap-2">
                                    {MATERIAL_TAGS.map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-600">{tag}</span>)}
                                </div>

                                <div className="relative mb-8 h-48 w-full max-w-md overflow-hidden rounded-2xl bg-gray-100">
                                    <img src="/src/assets/img/semen_test_sisain.jpg" alt="Contoh material" className="h-full w-full object-cover opacity-80" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left">
                                        <div className="mb-1 inline-block rounded bg-[#FFCC00] px-2 py-1 text-[9px] font-black text-gray-900">Contoh Format Ideal</div>
                                        <p className="text-[11px] font-medium leading-tight text-white">Sudut foto simetris dengan jarak 1.5m memudahkan pemindaian volumetrik AI.</p>
                                    </div>
                                </div>

                                <div className="mb-1 flex items-center gap-2 text-lg font-black text-gray-900"><UploadCloud className="h-5 w-5 text-emerald-600" />Tarik & lepas foto material ke sini</div>
                                <p className="mb-6 text-xs font-medium text-gray-500">atau klik tombol di bawah untuk memilih file dari penyimpanan Anda</p>

                                <div className="flex w-full max-w-md gap-2.5">
                                    <button type="button" onClick={openCamera} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#292824] px-4 text-[12px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#171613] active:translate-y-0"><Camera className="h-4 w-4 shrink-0" />Buka Kamera</button>
                                    <button type="button" onClick={openFilePicker} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#E0DDD6] bg-[#F6F5F2] px-4 text-[12px] font-bold text-[#45423C] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm active:translate-y-0"><ImageIcon className="h-4 w-4 shrink-0" />Galeri / Berkas</button>
                                </div>

                                {error && <p className="mt-4 text-[10px] font-bold text-red-500">{error}</p>}

                                <p className="mt-6 flex items-center gap-1.5 text-[10px] font-medium text-gray-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Mendukung format JPG, PNG, WEBP - Maksimal 15 MB per foto</p>
                            </div>
                        )}

                        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleInputChange} className="hidden" />
                    </div>

                    {!previewUrl && (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#EEE4BF] bg-[#FFFDF5] px-3 py-2">
                            <div className="flex min-w-0 items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5 shrink-0 text-[#B18C00]" /><span className="truncate text-[9px] font-semibold text-[#716B5D]">Gunakan foto contoh untuk uji coba instan</span></div>
                            <button type="button" onClick={handleExampleImage} className="flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[#E5E0D5] bg-white px-3 text-[7px] font-bold text-[#5B574F] transition hover:bg-[#FAF9F4] active:scale-95"><ImageIcon className="h-3 w-3" />Gunakan Contoh</button>
                        </div>
                    )}
                </div>

                <div className="space-y-6 lg:col-span-5">
                    <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-black text-gray-900"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100"><Camera className="h-4 w-4 text-yellow-700" /></div>Tips Foto Material Optimal</h3>
                            <span className="rounded-md bg-gray-100 px-2 py-1 text-[9px] font-black text-gray-600">Akurasi 98%</span>
                        </div>

                        <div className="space-y-4">
                            <Tip number="1" title="Material Tampak Jelas">Pastikan seluruh tumpukan atau unit sisa terlihat tanpa terhalang terpal pekat, plastik gelap, atau puing sampah domestik.</Tip>
                            <Tip number="2" title="Hindari Foto Buram / Gelap">Gunakan pencahayaan alami atau nyalakan lampu kerja proyek agar tekstur, ketebalan, dan merk/grade cetakan dapat terbaca oleh model OCR.</Tip>
                            <Tip number="3" title="Sertakan Konteks Sekitar">Beri jarak 1-2 meter dengan menyertakan lantai atau palet kayu agar AI Sisain bisa mengukur skala perbandingan volume secara akurat.</Tip>
                        </div>

                        <div className="mt-5 flex gap-4 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" />Bagus: Sudut 45° melebar</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500"><XCircle className="h-3.5 w-3.5" />Hindari: Close-up ekstrem</div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[22px] border border-[#E7E3DA] bg-[radial-gradient(circle_at_0%_0%,rgba(255,216,55,0.95)_0%,rgba(255,216,55,0.6)_18%,rgba(255,239,157,0.3)_34%,rgba(255,255,255,0)_58%),linear-gradient(145deg,#FFF4B8_0%,#FFFDF8_42%,#FFFFFF_100%)] p-5 shadow-[0_6px_18px_rgba(35,30,20,0.07)]">
                        <div className="relative z-10 mb-4 flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#292824]"><Cpu className="h-4 w-4 text-[#FFCC00]" /></div>
                            <div><h3 className="text-[15px] font-black leading-tight tracking-[-0.2px] text-[#26241F]">Bagaimana AI Sisain Membantu?</h3><p className="mt-0.5 text-[9px] font-medium leading-tight text-[#716D64]">Otomatisasi pengkatalogan tanpa input formulir manual</p></div>
                        </div>

                        <div className="relative z-10 space-y-2.5">
                            <div className="flex items-center gap-2.5 rounded-[14px] bg-white px-2.5 py-2.5 shadow-[0_2px_8px_rgba(35,30,20,0.04)]">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#DFF7EA]"><Box className="h-4 w-4 text-[#008563]" /></div>
                                <div className="min-w-0"><h4 className="text-[10px] font-black leading-[1.25] text-[#302E29]">Estimasi Kilogram & Satuan Otomatis</h4><p className="mt-0.5 text-[9px] font-medium leading-[1.4] text-[#79746B]">Konversi tumpukan fisik menjadi satuan standar proyek.</p></div>
                            </div>

                            <div className="flex items-center gap-2.5 rounded-[14px] bg-white px-2.5 py-2.5 shadow-[0_2px_8px_rgba(35,30,20,0.04)]">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E8F4FF]"><Cpu className="h-4 w-4 text-[#1671B8]" /></div>
                                <div className="min-w-0"><h4 className="text-[10px] font-black leading-[1.25] text-[#302E29]">Deteksi Jenis & Kondisi</h4><p className="mt-0.5 text-[9px] font-medium leading-[1.4] text-[#79746B]">AI membaca material dan menilai kondisi fisiknya.</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-600">Status Foto Material:</span>
                            {previewUrl ? (
                                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600"><Check className="h-3 w-3" />Siap Dianalisis</span>
                            ) : (
                                <span className="text-[10px] font-bold text-yellow-600">Menunggu Foto</span>
                            )}
                        </div>

                        <button type="button" onClick={handleSubmit} disabled={!selectedFile || isAILoading} className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black transition-all duration-300 ${selectedFile && !isAILoading ? 'bg-[#FFCC00] text-gray-900 shadow-md hover:-translate-y-0.5 hover:bg-yellow-400' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}>
                            {isAILoading ? <><Loader2 className="h-4 w-4 animate-spin" />Menganalisis Foto...</> : <>Analisis dengan AI <ArrowRight className="h-4 w-4" /></>}
                        </button>

                        {error && selectedFile && <p className="mt-3 text-center text-[9px] font-bold text-red-500">{error}</p>}

                        {!selectedFile && <p className="mt-3 flex items-center justify-center gap-1 text-center text-[9px] font-medium text-gray-500"><AlertCircle className="h-3 w-3" />Pilih atau ambil foto material terlebih dahulu untuk melanjutkan.</p>}
                    </div>
                </div>
            </div>

            {cameraOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div><h3 className="text-base font-black text-gray-900">Ambil Foto Material</h3><p className="mt-0.5 text-[10px] text-gray-500">Posisikan material di tengah bingkai</p></div>
                            <button type="button" onClick={closeCamera} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"><X className="h-5 w-5" /></button>
                        </div>

                        <div className="relative flex aspect-video items-center justify-center bg-black">
                            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />

                            <div className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-white/40">
                                <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                                    <div className="flex items-center gap-1.5 rounded-full bg-gray-900/80 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Mode Deteksi AI</div>
                                </div>
                            </div>

                            {!cameraReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <p className="flex items-center gap-2 text-xs font-bold text-white"><RotateCcw className="h-4 w-4 animate-spin" />Mengakses kamera...</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-4 bg-white px-6 py-5">
                            <button type="button" onClick={closeCamera} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50">Batal</button>
                            <button type="button" onClick={capturePhoto} disabled={!cameraReady} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFCC00] px-4 py-3 text-xs font-black text-gray-900 hover:bg-yellow-400 disabled:opacity-50"><Camera className="h-4 w-4" />Ambil Foto</button>
                        </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}

function Tip({ number, title, children }) {
    return (
        <div className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700">{number}</span>
            <div><h4 className="mb-0.5 text-[11px] font-black text-gray-900">{title}</h4><p className="text-[10px] leading-relaxed text-gray-500">{children}</p></div>
        </div>
    );
}