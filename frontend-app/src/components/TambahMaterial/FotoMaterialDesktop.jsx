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
        <div className="min-h-screen bg-[#FAF9F7] font-sans pb-20">
            {/* Header & Stepper */}
            <div className="pt-8 pb-12 bg-gradient-to-b from-[#F0FDF4]/50 to-transparent">
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

                    {/* Judul Utama */}
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-100/50 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase mb-4 border border-emerald-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Sistem Deteksi Sirkular Pintar V2.4
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Apa material surplus yang ingin kamu sirkulasikan?</h1>
                        <p className="text-sm font-medium text-gray-600 leading-relaxed">
                            Cukup unggah foto material sisa proyekmu. AI Sisain akan mendeteksi jenis material, estimasi volume, dan kelayakan kondisinya secara otomatis.
                        </p>
                    </div>
                </div>
            </div>

            {/* Konten Utama 2 Kolom */}
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
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
                                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                                    <button 
                                        onClick={openCamera}
                                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" /> Buka Kamera Langsung
                                    </button>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors border border-gray-200"
                                    >
                                        <ImageIcon className="w-4 h-4" /> Pilih dari Galeri / Berkas
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

                    {/* Simulasi Instan Bar */}
                    {!previewUrl && (
                        <div className="mt-4 bg-yellow-50/50 border border-yellow-100 rounded-2xl p-3 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-yellow-600"/> Gunakan foto contoh untuk uji coba instan:</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleSimulate('semen')} className="bg-white hover:bg-gray-50 text-[10px] font-bold text-gray-700 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 transition-colors">Palet Semen Sak</button>
                                <button onClick={() => handleSimulate('keramik')} className="bg-white hover:bg-gray-50 text-[10px] font-bold text-gray-700 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 transition-colors">Tumpukan Keramik</button>
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

                    {/* Card 2: AI Info */}
                    <div className="bg-[#FFFAEB] rounded-[24px] p-6 shadow-sm border border-yellow-100">
                        <h3 className="font-black text-gray-900 flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                                <Cpu className="w-4 h-4 text-yellow-400" />
                            </div>
                            Bagaimana AI Sisain Membantu?
                        </h3>
                        <p className="text-[10px] text-gray-600 font-medium mb-5 pl-10">Otomatisasi pengkatalogan tanpa input formulir manual</p>

                        <div className="space-y-3">
                            <div className="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-yellow-50">
                                <div className="w-7 h-7 shrink-0 bg-emerald-50 rounded-lg flex items-center justify-center"><Box className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-900 mb-0.5">Estimasi Kilogram & Satuan Otomatis</h4>
                                    <p className="text-[9px] text-gray-500 leading-relaxed">Konversi tumpukan fisik menjadi satuan standar proyek (sak/m²/batang).</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-yellow-50">
                                <div className="w-7 h-7 shrink-0 bg-yellow-50 rounded-lg flex items-center justify-center"><MapPin className="w-3.5 h-3.5 text-yellow-600" /></div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-900 mb-0.5">Rekomendasi Fasum & Warga Terdekat</h4>
                                    <p className="text-[9px] text-gray-500 leading-relaxed">Mencocokkan surplus dengan balai warga, renovasi posyandu, atau bank material.</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-yellow-50">
                                <div className="w-7 h-7 shrink-0 bg-red-50 rounded-lg flex items-center justify-center"><Leaf className="w-3.5 h-3.5 text-red-500" /></div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-900 mb-0.5">Kalkulasi Emisi Karbon Terhindar</h4>
                                    <p className="text-[9px] text-gray-500 leading-relaxed">Sertifikat kontribusi dekarbonisasi otomatis masuk ke profil donatur Anda.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Action */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[11px] font-bold text-gray-600">Status Foto Material:</span>
                            {previewUrl ? (
                                <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3"/> Siap Dianalisis</span>
                            ) : (
                                <span className="text-[10px] font-bold text-yellow-600 underline cursor-pointer" onClick={() => handleSimulate('semen')}>Simulasikan Foto Terunggah</span>
                            )}
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={!previewUrl}
                            className={`w-full py-3.5 rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                                previewUrl 
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
            <div className="max-w-[1200px] mx-auto px-6 mt-12 mb-8">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">
                            <Leaf className="w-4 h-4" /> Dampak Nyata
                        </div>
                        <p className="text-[10px] font-medium text-gray-500 leading-relaxed">Sirkulasi material surplus proyek dari seluruh donatur pekan ini.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center shrink-0"><Box className="w-6 h-6 text-yellow-700"/></div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 leading-tight">18.420 kg</h4>
                            <p className="text-[10px] font-semibold text-gray-500">Material Terselamatkan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0"><Truck className="w-6 h-6 text-emerald-700"/></div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 leading-tight">42 Rit Truk</h4>
                            <p className="text-[10px] font-semibold text-gray-500">Limbah Padat Teralihkan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0"><Building2 className="w-6 h-6 text-red-600"/></div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 leading-tight">37 Fasilitas</h4>
                            <p className="text-[10px] font-semibold text-gray-500">Menerima Bantuan Material</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Kamera (Menggunakan stream getUserMedia) */}
            {cameraOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
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
                            
                            {/* Overlay Frame AI (Sesuai Desain Mobile) */}
                            <div className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-white/40">
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                    <div className="bg-gray-900/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Mode Deteksi AI
                                    </div>
                                </div>
                                {/* Center Focus Ring */}
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