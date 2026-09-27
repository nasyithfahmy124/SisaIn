import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Image as ImageIcon, Lightbulb, Loader2, Package, RefreshCw, ShieldCheck } from 'lucide-react';

export default function FotoMaterialMobile({ onNextStep, onBack, isAILoading = false }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const galleryInputRef = useRef(null);
    const streamRef = useRef(null);
    const objectUrlRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [facingMode, setFacingMode] = useState('environment');

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
        }

        setCameraReady(false);
    }, []);

    const startCamera = useCallback(async () => {
        stopCamera();

        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraError('Browser tidak mendukung akses kamera. Silakan pilih foto dari galeri.');
            return;
        }

        setCameraError('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false
            });

            streamRef.current = stream;

            if (!videoRef.current) {
                stopCamera();
                return;
            }

            videoRef.current.srcObject = stream;
            videoRef.current.muted = true;
            videoRef.current.playsInline = true;
            await videoRef.current.play();
            setCameraReady(true);
        } catch (error) {
            console.error('Camera error:', error);
            setCameraReady(false);

            const messages = {
                NotAllowedError: 'Akses kamera ditolak. Izinkan kamera di browser atau pilih foto dari galeri.',
                NotFoundError: 'Kamera tidak ditemukan. Silakan pilih foto dari galeri.',
                NotReadableError: 'Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.',
                OverconstrainedError: 'Kamera tidak mendukung konfigurasi yang diminta. Silakan pilih foto dari galeri.'
            };

            setCameraError(messages[error?.name] || 'Kamera tidak dapat digunakan. Silakan pilih foto dari galeri.');
        }
    }, [facingMode, stopCamera]);

    useEffect(() => {
        if (!selectedImage && !isAILoading) startCamera();
        return () => stopCamera();
    }, [selectedImage, isAILoading, startCamera, stopCamera]);

    useEffect(() => {
        return () => {
            stopCamera();

            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [stopCamera]);

    const processFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setCameraError('File yang dipilih harus berupa gambar.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setCameraError('Ukuran foto maksimal 10 MB.');
            return;
        }

        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

        const imageUrl = URL.createObjectURL(file);
        objectUrlRef.current = imageUrl;

        setCameraError('');
        setSelectedImage({ file, url: imageUrl });
        stopCamera();
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !cameraReady) return;

        if (!video.videoWidth || !video.videoHeight) {
            setCameraError('Kamera belum siap. Tunggu sebentar lalu coba lagi.');
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');

        if (!context) {
            setCameraError('Gagal memproses foto kamera.');
            return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) {
                setCameraError('Gagal mengambil foto. Silakan coba lagi.');
                return;
            }

            processFile(new File([blob], `material-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.92);
    };

    const handleGalleryChange = (event) => {
        processFile(event.target.files?.[0]);
        event.target.value = '';
    };

    const openGallery = () => {
        if (!isAILoading) galleryInputRef.current?.click();
    };

    const toggleCamera = () => {
        if (isAILoading || selectedImage || !cameraReady) return;
        setFacingMode((currentMode) => currentMode === 'environment' ? 'user' : 'environment');
    };

    const handleReset = () => {
        if (isAILoading) return;

        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }

        setSelectedImage(null);
        setCameraError('');
    };

    const handleSubmit = () => {
        if (!selectedImage || isAILoading) return;

        onNextStep?.({
            file: selectedImage.file,
            preview: selectedImage.url
        });
    };

    const handleBack = () => {
        if (!isAILoading) onBack?.();
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans pb-32">
            <div className="flex items-center gap-3 px-4 pt-6 pb-4">
                <button type="button" onClick={handleBack} disabled={isAILoading} aria-label="Kembali" className="flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-50">
                    <ArrowLeft className="h-5 w-5 text-gray-900" />
                </button>
                <h1 className="text-base font-bold text-gray-900">Tambah Material</h1>
            </div>

            <div className="mb-6 px-4">
                <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto rounded-full border border-gray-100 bg-white px-1.5 py-1.5 shadow-sm">
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#FFCC00] px-4 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                        <span className="text-[11px] font-black text-gray-900">01 Foto</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 px-2 text-gray-400">
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-[11px] font-semibold">02 Analisis</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 px-2 text-gray-400">
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-[11px] font-semibold">03 Konfirm</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 px-2 text-gray-400">
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-[11px] font-semibold">04 Kirim</span>
                    </div>
                </div>
            </div>

            <div className="mb-5 px-4">
                <h2 className="mb-2 text-2xl font-black leading-tight tracking-tight text-gray-900">Apa material sisa yang ingin disirkulasikan?</h2>
                <p className="text-[11px] font-medium leading-relaxed text-gray-600">Foto tumpukan materialmu. AI Sisain akan otomatis menghitung estimasi volume, berat, dan mencocokkan ke fasum terdekat.</p>
            </div>

            <div className="space-y-5 px-4">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-gray-900 shadow-lg">
                    {selectedImage ? (
                        <img src={selectedImage.url} alt="Material yang dipilih" className="h-full w-full object-cover" />
                    ) : (
                        <video ref={videoRef} autoPlay playsInline muted aria-label="Kamera untuk mengambil foto material" className={`h-full w-full object-cover transition-opacity duration-300 ${cameraReady ? 'opacity-100' : 'opacity-0'}`} />
                    )}

                    {!selectedImage && <div className="absolute inset-0 bg-black/20" />}

                    {!selectedImage && (
                        <>
                            <div className="absolute left-4 top-4 h-6 w-6 rounded-tl-lg border-l-[3px] border-t-[3px] border-[#FFCC00]" />
                            <div className="absolute right-4 top-4 h-6 w-6 rounded-tr-lg border-r-[3px] border-t-[3px] border-[#FFCC00]" />
                            <div className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-lg border-b-[3px] border-l-[3px] border-[#FFCC00]" />
                            <div className="absolute bottom-4 right-4 h-6 w-6 rounded-br-lg border-b-[3px] border-r-[3px] border-[#FFCC00]" />
                        </>
                    )}

                    {!selectedImage && (
                        <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between">
                            <div className="flex items-center gap-1.5 rounded-full bg-gray-900/80 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                Mode Deteksi AI Aktif
                            </div>
                        </div>
                    )}

                    {!selectedImage && !cameraError && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
                            <div className="flex h-20 w-20 animate-[spin_10s_linear_infinite] items-center justify-center rounded-full border-2 border-dashed border-[#FFCC00]">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#FFCC00]" />
                            </div>
                            <span className="mt-3 rounded-full bg-gray-900/60 px-3 py-1 text-[9px] font-black tracking-wider text-white backdrop-blur-md">FOKUS AI</span>
                        </div>
                    )}

                    {cameraError && !selectedImage && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900 px-6 text-center">
                            <div>
                                <Camera className="mx-auto mb-3 h-8 w-8 text-[#FFCC00]" />
                                <p className="text-xs font-medium leading-relaxed text-white">{cameraError}</p>
                                <button type="button" onClick={startCamera} className="mt-4 rounded-full bg-[#FFCC00] px-4 py-2 text-[10px] font-black text-gray-900 transition-transform active:scale-95">Coba Lagi</button>
                            </div>
                        </div>
                    )}

                    {!selectedImage && (
                        <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-between px-8">
                            <button type="button" onClick={openGallery} disabled={isAILoading} className="flex items-center gap-2 rounded-full bg-gray-900/60 px-4 py-2.5 text-[10px] font-semibold text-white backdrop-blur-md transition-transform active:scale-95 disabled:opacity-50">
                                <ImageIcon className="h-4 w-4" />
                                Galeri
                            </button>

                            <button type="button" onClick={capturePhoto} disabled={!cameraReady || isAILoading} aria-label="Ambil foto" className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FFCC00] p-1 transition-transform active:scale-90 disabled:opacity-50">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FFCC00]">
                                    <Camera className="h-6 w-6 text-gray-900" />
                                </div>
                            </button>

                            <button type="button" onClick={toggleCamera} disabled={!cameraReady || isAILoading} aria-label="Ganti kamera" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/60 text-white backdrop-blur-md transition-transform active:scale-95 disabled:opacity-50">
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {selectedImage && (
                    <div className="flex animate-in slide-in-from-bottom-4 items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                            <Package className="h-6 w-6 text-emerald-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-0.5 flex items-start justify-between">
                                <h3 className="truncate pr-2 text-sm font-black text-gray-900">Foto Dipilih</h3>
                                <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">Siap Proses</span>
                            </div>
                            <p className="truncate text-[10px] font-medium text-gray-500">Menunggu dianalisis sistem</p>
                        </div>

                        <button type="button" onClick={handleReset} disabled={isAILoading} className="shrink-0 text-[11px] font-bold text-red-500 hover:text-red-600 disabled:opacity-50">Ganti</button>
                    </div>
                )}

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-900">
                            <Lightbulb className="h-4 w-4 text-[#FFCC00]" />
                            Tips Akurasi AI
                        </h3>
                        <span className="text-[9px] font-medium text-gray-400">Geser untuk cek</span>
                    </div>

                    <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
                        <div className="flex w-[200px] shrink-0 gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFCC00] text-[10px] font-black text-gray-900">1</span>
                            <div>
                                <h4 className="mb-0.5 text-[11px] font-black text-gray-900">Tampak Penuh</h4>
                                <p className="text-[9px] leading-tight text-gray-500">Seluruh batas tumpukan terlihat</p>
                            </div>
                        </div>

                        <div className="flex w-[200px] shrink-0 gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFCC00] text-[10px] font-black text-gray-900">2</span>
                            <div>
                                <h4 className="mb-0.5 text-[11px] font-black text-gray-900">Cahaya Cukup</h4>
                                <p className="text-[9px] leading-tight text-gray-500">Hindari bayangan gelap</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white px-1">
                    <div className="flex gap-2.5">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="text-[10px] leading-relaxed text-gray-600">
                            <strong className="text-gray-900">Privasi Terjaga:</strong> Foto lokasi proyek hanya dipakai untuk kalkulasi kurasi material surplus & penugasan logistik relawan Sisain.
                        </p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white px-4 pb-6 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
                <button type="button" onClick={handleSubmit} disabled={!selectedImage || isAILoading} className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-black transition-all ${selectedImage && !isAILoading ? 'bg-[#FFCC00] text-gray-900 shadow-md active:scale-95' : 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-80'}`}>
                    {isAILoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Memproses AI...
                        </>
                    ) : (
                        <>
                            Analisis dengan AI
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </>
                    )}
                </button>
            </div>

            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleGalleryChange} className="hidden" />
            <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </div>
    );
}
