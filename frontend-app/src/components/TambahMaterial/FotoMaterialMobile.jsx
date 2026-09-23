import React, { useState, useRef, useEffect } from 'react';
import { 
    ArrowLeft, Camera, Image as ImageIcon, Zap, RefreshCw, 
    Lightbulb, ShieldCheck, ArrowRight, Zap as Lightning,
    Package
} from 'lucide-react';

export default function FotoMaterialMobile({ onNextStep }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const galleryInputRef = useRef(null);
    const streamRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' = kamera belakang
    const [cameraError, setCameraError] = useState(false);

    // Menghidupkan kamera saat komponen dimuat
    useEffect(() => {
        if (!selectedImage) {
            startCamera();
        }
        return () => stopCamera();
    }, [facingMode, selectedImage]);

    const startCamera = async () => {
        setCameraError(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setCameraReady(true);
            }
        } catch (err) {
            console.error("Gagal mengakses kamera:", err);
            setCameraError(true);
            setCameraReady(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraReady(false);
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
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
            processFile(file);
            stopCamera();
        }, 'image/jpeg', 0.92);
    };

    const handleGalleryChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
            stopCamera();
        }
    };

    const processFile = (file) => {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage({ file, url: imageUrl });
    };

    const handleReset = () => {
        if (selectedImage?.url) URL.revokeObjectURL(selectedImage.url);
        setSelectedImage(null);
        // Kamera akan otomatis menyala lagi karena useEffect mendeteksi !selectedImage
    };

    const handleSubmit = () => {
        if (!selectedImage) return;
        if (onNextStep) onNextStep(selectedImage);
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] font-sans pb-32">
            
            {/* Top Bar Header */}
            <div className="flex items-center gap-3 px-4 pt-6 pb-4">
                <ArrowLeft className="w-5 h-5 text-gray-900" />
                <h1 className="text-base font-bold text-gray-900">Tambah Material</h1>
            </div>

            {/* Stepper */}
            <div className="px-4 mb-6">
                <div className="flex items-center gap-2 bg-white rounded-full py-1.5 px-1.5 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar">
                    <div className="flex shrink-0 items-center gap-1.5 bg-[#FFCC00] px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                        <span className="text-[11px] font-black text-gray-900">01 Foto</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-gray-400 px-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[11px] font-semibold">02 Analisis</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-gray-400 px-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[11px] font-semibold">03 Konfirm</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-gray-400 px-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[11px] font-semibold">04 Kirim</span>
                    </div>
                </div>
            </div>

            {/* Title Section */}
            <div className="px-4 mb-5">
                <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight tracking-tight">
                    Apa material sisa yang ingin disirkulasikan?
                </h2>
                <p className="text-[11px] font-medium text-gray-600 leading-relaxed">
                    Foto tumpukan materialmu. AI Sisain akan otomatis menghitung estimasi volume, berat, dan mencocokkan ke fasum terdekat.
                </p>
            </div>

            <div className="px-4 space-y-5">
                
                {/* Live Camera Viewfinder */}
                <div className="relative w-full aspect-[4/5] bg-gray-900 rounded-[28px] overflow-hidden shadow-lg">
                    
                    {/* Media Layer */}
                    {selectedImage ? (
                        <img src={selectedImage.url} alt="Hasil Foto" className="w-full h-full object-cover" />
                    ) : (
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className={`w-full h-full object-cover transition-opacity duration-300 ${cameraReady ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                    
                    {/* Dark Overlay untuk Kamera Berjalan */}
                    {!selectedImage && <div className="absolute inset-0 bg-black/20"></div>}

                    {/* Viewfinder Corners */}
                    {!selectedImage && (
                        <>
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-[3px] border-l-[3px] border-[#FFCC00] rounded-tl-lg"></div>
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-[3px] border-r-[3px] border-[#FFCC00] rounded-tr-lg"></div>
                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-[3px] border-l-[3px] border-[#FFCC00] rounded-bl-lg"></div>
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-[3px] border-r-[3px] border-[#FFCC00] rounded-br-lg"></div>
                        </>
                    )}

                    {/* Top Controls Overlay */}
                    {!selectedImage && (
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                            <div className="bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                Mode Deteksi AI Aktif
                            </div>
                            <button className="w-8 h-8 bg-gray-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                <Zap className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Categories Pills Overlay */}
                    {!selectedImage && (
                        <div className="absolute top-14 left-0 w-full overflow-x-auto hide-scrollbar px-4 py-2 z-10 flex gap-2">
                            {['Semen', 'Kayu Balok', 'Keramik', 'Bata Ringan', 'Baja'].map((cat, idx) => (
                                <span key={idx} className="shrink-0 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* FOKUS AI Center Target */}
                    {!selectedImage && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FFCC00] flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                <div className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full"></div>
                            </div>
                            <span className="bg-gray-900/60 backdrop-blur-md text-white text-[9px] font-black tracking-wider px-3 py-1 rounded-full mt-3">
                                FOKUS AI
                            </span>
                        </div>
                    )}

                    {/* Pesan Error Kamera (Fallback) */}
                    {cameraError && !selectedImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 px-6 text-center">
                            <p className="text-white text-xs font-medium">Akses kamera ditolak. Silakan pilih foto dari galeri.</p>
                        </div>
                    )}

                    {/* Bottom Camera Controls */}
                    {!selectedImage && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-between items-center px-8 z-10">
                            <button 
                                onClick={() => galleryInputRef.current.click()}
                                className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-md text-white text-[10px] font-semibold px-4 py-2.5 rounded-full transition-transform active:scale-95"
                            >
                                <ImageIcon className="w-4 h-4" /> Galeri
                            </button>

                            <button 
                                onClick={capturePhoto}
                                disabled={!cameraReady}
                                className="w-16 h-16 rounded-full border-2 border-[#FFCC00] p-1 flex items-center justify-center transition-transform active:scale-90 disabled:opacity-50"
                            >
                                <div className="w-full h-full bg-[#FFCC00] rounded-full flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-gray-900" />
                                </div>
                            </button>

                            <button onClick={toggleCamera} className="w-10 h-10 bg-gray-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform active:scale-95">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Result Card (Muncul setelah ambil/pilih foto) */}
                {selectedImage && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 animate-in slide-in-from-bottom-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <h3 className="text-sm font-black text-gray-900 truncate pr-2">Tersedia 1 Palet Semen</h3>
                                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-md shrink-0">98% Cocok</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium truncate">Est. ~400 kg • Layak Pakai Konstruksi</p>
                        </div>
                        <button onClick={handleReset} className="text-[11px] font-bold text-red-500 hover:text-red-600 shrink-0">
                            Ganti
                        </button>
                    </div>
                )}

                {/* Tips Akurasi AI */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[11px] font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4 text-[#FFCC00]" /> Tips Akurasi AI
                        </h3>
                        <span className="text-[9px] text-gray-400 font-medium">Geser untuk cek</span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                        <div className="shrink-0 w-[200px] bg-gray-50 rounded-2xl p-3.5 flex gap-3 border border-gray-100">
                            <span className="w-5 h-5 bg-[#FFCC00] text-gray-900 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                            <div>
                                <h4 className="text-[11px] font-black text-gray-900 mb-0.5">Tampak Penuh</h4>
                                <p className="text-[9px] text-gray-500 leading-tight">Seluruh batas tumpukan terlihat</p>
                            </div>
                        </div>
                        <div className="shrink-0 w-[200px] bg-gray-50 rounded-2xl p-3.5 flex gap-3 border border-gray-100">
                            <span className="w-5 h-5 bg-[#FFCC00] text-gray-900 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                            <div>
                                <h4 className="text-[11px] font-black text-gray-900 mb-0.5">Cahaya Cukup</h4>
                                <p className="text-[9px] text-gray-500 leading-tight">Hindari bayangan gelap</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Warning */}
                <div className="bg-white px-1">
                    <div className="flex gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-gray-600 leading-relaxed">
                            <strong className="text-gray-900">Privasi Terjaga:</strong> Foto lokasi proyek hanya dipakai untuk kalkulasi kurasi material surplus & penugasan logistik relawan Sisain.
                        </p>
                    </div>
                </div>

            </div>

            {/* Bottom Action Bar (Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white pt-3 pb-6 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40">
                <button 
                    onClick={handleSubmit}
                    disabled={!selectedImage}
                    className={`w-full py-4 rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all ${
                        selectedImage 
                        ? 'bg-[#FFCC00] active:scale-95 text-gray-900 shadow-md' 
                        : 'bg-gray-100 text-gray-400 opacity-80'
                    }`}
                >
                    Analisis dengan AI <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <div className="flex items-center justify-center gap-1 mt-3">
                    <Lightning className="w-3 h-3 text-emerald-500" />
                    <p className="text-[9px] font-semibold text-gray-500">Waktu estimasi kalkulasi ~2.4 detik</p>
                </div>
            </div>

            {/* Hidden Input for Gallery */}
            <input type="file" ref={galleryInputRef} onChange={handleGalleryChange} className="hidden" accept="image/*" />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}