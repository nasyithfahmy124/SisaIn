import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ArrowRight,
    Check,
    CircleAlert,
    CircleCheck,
    Loader2,
    MapPin,
    RotateCcw,
    Sparkles,
    Target,
    Truck,
    Weight
} from 'lucide-react';
import { useAiRedistribusi } from '../../hooks/useAiRedistribusi';

const STEPS = [
    { id: 'photo', number: '01', label: 'Foto Material' },
    { id: 'analysis', number: '02', label: 'Analisis AI' },
    { id: 'confirmation', number: '03', label: 'Konfirmasi' },
    { id: 'distribution', number: '04', label: 'Distribusi' }
];

const ANALYSIS_STEPS = [
    { id: 'material', label: 'Mengenali jenis material', icon: Sparkles },
    { id: 'condition', label: 'Memeriksa kondisi fisik', icon: CircleCheck },
    { id: 'weight', label: 'Mengestimasi jumlah & bobot', icon: Weight },
    { id: 'matching', label: 'Menganalisis potensi fasum terdekat', icon: Target }
];

const parseResult = (result) => {
    if (!result) return {};
    if (typeof result === 'object') return result;

    try {
        return JSON.parse(result);
    } catch {
        return {};
    }
};

const normalizeResult = (result) => {
    const data = parseResult(result);

    return {
        nama_material: data.nama_material || data.namaMaterial || data.material || 'Material Terdeteksi',
        kategori: data.kategori || data.category || 'Material',
        kondisi_barang: data.kondisi_barang || data.kondisi || data.condition || 'Layak Pakai',
        bobot: data.bobot ?? data.berat ?? data.weight ?? 0,
        deskripsi: data.deskripsi || data.description || '',
        jumlah: data.jumlah ?? data.quantity ?? null,
        satuan: data.satuan || data.unit || '',
        confidence: data.confidence ?? data.accuracy ?? null,
        kelayakan: data.kelayakan || data.grade || 'Layak Pakai'
    };
};

const getImageUrl = (payload) => payload?.url || payload?.preview || payload?.previewUrl || null;

const formatWeight = (value) => {
    if (value === null || value === undefined || value === '') return '-';

    const number = Number(value);
    return Number.isNaN(number) ? `${value}` : `${number.toLocaleString('id-ID')} kg`;
};

const formatConfidence = (value) => {
    if (value === null || value === undefined) return null;

    const number = Number(value);
    if (Number.isNaN(number)) return null;

    return `${number > 1 ? number.toFixed(0) : (number * 100).toFixed(0)}%`;
};

const getShortName = (value, length = 30) => {
    if (!value) return 'Material';

    return value.length > length ? `${value.slice(0, length)}...` : value;
};

export default function AnalisisAIDesktop({ imagePayload, onBack, onNext }) {
    const { analyzeImage } = useAiRedistribusi();

    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [scanPosition, setScanPosition] = useState(10);
    const [scanDirection, setScanDirection] = useState(1);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const imageUrl = useMemo(() => getImageUrl(imagePayload), [imagePayload]);
    const isProcessing = status === 'processing';
    const isSuccess = status === 'success';
    const isError = status === 'error';

    const runAnalysis = useCallback(async () => {
        if (!imagePayload?.file) {
            setStatus('error');
            setError('Foto material tidak ditemukan. Silakan unggah foto terlebih dahulu.');
            return;
        }

        setStatus('processing');
        setProgress(0);
        setAnalysis(null);
        setError('');
        setScanPosition(10);
        setScanDirection(1);

        try {
            const response = await analyzeImage(imagePayload);
            const result = normalizeResult(response);

            if (!result.nama_material && !result.kategori) {
                throw new Error('Hasil analisis AI tidak tersedia.');
            }

            setAnalysis(result);
            setProgress(100);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setProgress(0);
            setError(err?.message || 'Gagal memproses analisis AI.');
        }
    }, [analyzeImage, imagePayload]);

    useEffect(() => {
        runAnalysis();
    }, [runAnalysis]);

    useEffect(() => {
        if (!isProcessing) return undefined;

        const interval = window.setInterval(() => {
            setProgress((current) => current >= 92 ? current : Math.min(current + 2, 92));
        }, 100);

        return () => window.clearInterval(interval);
    }, [isProcessing]);

    useEffect(() => {
        if (!isProcessing) return undefined;

        const interval = window.setInterval(() => {
            setScanPosition((current) => {
                const next = current + scanDirection * 1.8;

                if (next >= 88) {
                    setScanDirection(-1);
                    return 88;
                }

                if (next <= 8) {
                    setScanDirection(1);
                    return 8;
                }

                return next;
            });
        }, 30);

        return () => window.clearInterval(interval);
    }, [isProcessing, scanDirection]);

    const analysisStates = useMemo(() => {
        const thresholds = [25, 50, 75, 100];

        return ANALYSIS_STEPS.map((step, index) => ({
            ...step,
            completed: isSuccess || progress >= thresholds[index],
            active: isProcessing && progress >= thresholds[index] - 25
        }));
    }, [isProcessing, isSuccess, progress]);

    const handleNext = useCallback(() => {
        if (!isSuccess || !analysis) return;

        onNext?.({
            ...imagePayload,
            aiData: analysis,
            analysis,
            finalData: analysis
        });
    }, [analysis, imagePayload, isSuccess, onNext]);

    return (
        <main className="min-h-screen bg-[#FCFAF8] pb-24 text-gray-900">
            <div className="mx-auto w-full max-w-[1180px] px-7 pb-10 pt-6">
                <Breadcrumb />
                <StepNavigation />

                <div className="mt-8 grid grid-cols-[1.48fr_1fr] items-start gap-5">
                    <section className="min-w-0">
                        <MaterialPreview
                            imageUrl={imageUrl}
                            analysis={analysis}
                            isProcessing={isProcessing}
                            isSuccess={isSuccess}
                            isError={isError}
                            error={error}
                            scanPosition={scanPosition}
                            onRetry={runAnalysis}
                        />

                        <MaterialStats analysis={analysis} />
                    </section>

                    <section className="min-w-0 space-y-4">
                        <AiProcessCard
                            progress={progress}
                            isProcessing={isProcessing}
                            isSuccess={isSuccess}
                            analysis={analysis}
                            states={analysisStates}
                        />

                        <DetectionCard analysis={analysis} isSuccess={isSuccess} />

                        <TransparencyCard />
                    </section>
                </div>
            </div>

            <BottomActions
                isProcessing={isProcessing}
                isSuccess={isSuccess}
                onBack={onBack}
                onNext={handleNext}
            />
        </main>
    );
}

function Breadcrumb() {
    return (
        <div className="text-[10px] font-medium text-gray-400">
            <span>Beranda</span>
            <span className="mx-1.5">›</span>
            <span>Tambah Material</span>
            <span className="mx-1.5">›</span>
            <span className="font-semibold text-gray-600">Analisis AI</span>
        </div>
    );
}

function StepNavigation() {
    return (
        <div className="mt-5 flex justify-center">
            <div className="flex items-center rounded-full bg-[#F0EEEC] p-1">
                {STEPS.map((step, index) => {
                    const active = step.id === 'analysis';
                    const completed = step.id === 'photo';

                    return (
                        <React.Fragment key={step.id}>
                            <div className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${active ? 'bg-[#FFCC00] text-gray-900 shadow-sm' : 'text-gray-400'}`}>
                                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black ${active ? 'bg-white/50' : ''}`}>
                                    {completed ? <Check className="h-3 w-3" /> : step.number}
                                </span>

                                <span className={`text-[10px] ${active ? 'font-black' : 'font-semibold'}`}>
                                    {step.label}
                                </span>
                            </div>

                            {index < STEPS.length - 1 && <span className="mx-1 text-[9px] text-gray-300">›</span>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

function MaterialPreview({ imageUrl, analysis, isProcessing, isSuccess, isError, error, scanPosition, onRetry }) {
    return (
        <div className="rounded-[20px] border border-[#EEEAE6] bg-white p-3 shadow-[0_5px_22px_rgba(30,30,30,0.04)]">
            <div className="relative aspect-[1.55/1] overflow-hidden rounded-[15px] bg-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Material"
                        className={`h-full w-full object-cover transition-all duration-700 ${isProcessing ? 'scale-[1.015]' : 'scale-100'}`}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Foto tidak tersedia
                    </div>
                )}

                <ImageCorners />

                {isProcessing && (
                    <>
                        <div
                            className="absolute left-0 right-0 z-20 h-1 bg-[#FFCC00] shadow-[0_0_15px_rgba(255,204,0,0.95)]"
                            style={{ top: `${scanPosition}%` }}
                        />

                        <div
                            className="absolute left-0 right-0 z-10 h-20 bg-gradient-to-b from-transparent via-[#FFCC00]/10 to-transparent"
                            style={{ top: `calc(${scanPosition}% - 40px)` }}
                        />

                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                            <div className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[11px] font-bold text-white backdrop-blur-md">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#FFCC00]" />
                                Menganalisis foto...
                            </div>
                        </div>
                    </>
                )}

                {isSuccess && analysis && (
                    <>
                        <ImageBadge position="left-5 top-5" variant="white" icon={<Check />}>
                            Material: {getShortName(analysis.nama_material)}
                        </ImageBadge>

                        <ImageBadge position="right-5 top-5" variant="white" icon={<CircleCheck />}>
                            Kondisi: {analysis.kondisi_barang}
                        </ImageBadge>

                        <ImageBadge position="bottom-5 left-5" variant="yellow" icon={<Weight />}>
                            Estimasi ~{formatWeight(analysis.bobot)}
                        </ImageBadge>

                        <ImageBadge position="bottom-5 right-5" variant="green" icon={<Target />}>
                            Potensi Redistribusi Tinggi
                        </ImageBadge>
                    </>
                )}

                {isError && (
                    <ErrorOverlay error={error} onRetry={onRetry} />
                )}
            </div>

            <div className="flex items-center justify-between px-2 pt-3">
                <div className="flex items-center gap-1.5 text-[9px] font-medium text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    Foto lokasi aktif
                </div>

                <div className="flex items-center gap-2 text-[9px] text-gray-400">
                    <span>Kamera Depan</span>
                    <span>•</span>
                    <span>Estimasi AI</span>
                </div>
            </div>
        </div>
    );
}

function ImageCorners() {
    const corners = [
        'left-4 top-4 border-l-2 border-t-2 rounded-tl-md',
        'right-4 top-4 border-r-2 border-t-2 rounded-tr-md',
        'bottom-4 left-4 border-b-2 border-l-2 rounded-bl-md',
        'bottom-4 right-4 border-b-2 border-r-2 rounded-br-md'
    ];

    return (
        <div className="pointer-events-none absolute inset-0 z-10">
            {corners.map((corner) => (
                <span key={corner} className={`absolute h-6 w-6 border-[#FFCC00] ${corner}`} />
            ))}
        </div>
    );
}

function ImageBadge({ position, variant, icon, children }) {
    const variants = {
        white: 'bg-white/95 text-gray-900',
        yellow: 'border border-[#E8BA00] bg-[#FFCC00]/95 text-gray-900',
        green: 'border border-emerald-300 bg-emerald-100/95 text-emerald-800'
    };

    return (
        <div className={`absolute ${position} z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black shadow-sm backdrop-blur ${variants[variant]}`}>
            {React.cloneElement(icon, { className: 'h-3 w-3' })}
            <span>{children}</span>
        </div>
    );
}

function ErrorOverlay({ error, onRetry }) {
    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-8 backdrop-blur-[2px]">
            <div className="w-full max-w-[290px] rounded-[18px] bg-white p-6 text-center shadow-2xl">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                    <CircleAlert className="h-5 w-5 text-red-500" />
                </div>

                <h3 className="mt-3 text-sm font-black text-gray-900">
                    Analisis gagal
                </h3>

                <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                    {error || 'AI tidak dapat memproses foto material.'}
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-5 py-2.5 text-[10px] font-black text-gray-900 transition hover:bg-[#F2BF00]"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Coba Lagi
                </button>
            </div>
        </div>
    );
}

function MaterialStats({ analysis }) {
    const confidence = formatConfidence(analysis?.confidence);

    return (
        <div className="mt-3 grid grid-cols-3 gap-3">
            <StatCard
                label="Brand Terdeteksi"
                value={analysis?.nama_material || 'Cemex PCC'}
                detail={analysis?.kategori || 'Semen PCC'}
            />

            <StatCard
                label="Keadaan Fisik"
                value={analysis?.kondisi_barang || 'Layak Kertas Kraft'}
                detail="Kondisi material terdeteksi"
            />

            <StatCard
                label="Tingkat Kelayakan"
                value={analysis?.kelayakan || 'Layak Pakai 100%'}
                detail={confidence ? `Confidence ${confidence}` : 'Bebas digunakan'}
                positive
            />
        </div>
    );
}

function StatCard({ label, value, detail, positive }) {
    return (
        <div className="min-w-0 rounded-[13px] border border-[#EEEAE6] bg-white px-4 py-3">
            <p className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <p className={`mt-1.5 truncate text-[12px] font-black ${positive ? 'text-emerald-600' : 'text-gray-800'}`}>
                {value}
            </p>

            <p className="mt-1 truncate text-[8px] font-medium text-gray-400">
                {detail}
            </p>
        </div>
    );
}

function AiProcessCard({ progress, isSuccess, analysis, states }) {
    return (
        <div className="rounded-[17px] border border-[#EEEAE6] bg-white p-5 shadow-[0_4px_18px_rgba(30,30,30,0.03)]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#FFF6C9] px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-[#876900]">
                            AI Computer Vision Aktif
                        </span>

                        <span className="text-[8px] font-medium text-gray-400">
                            {isSuccess ? 'Analisis selesai' : 'Tahap 2 dari 4'}
                        </span>
                    </div>

                    <h2 className="mt-2.5 text-[17px] font-black leading-tight text-gray-900">
                        AI Sedang menganalisis foto materialmu...
                    </h2>

                    <p className="mt-2 text-[9px] leading-[1.6] text-gray-500">
                        Sistem computer vision kami mengidentifikasi spesifikasi sisa konstruksi untuk mencocokkannya ke proyek perbaikan fasilitas warga terdekat.
                    </p>
                </div>
            </div>

            <ProgressBar progress={progress} />

            <div className="mt-4 space-y-2">
                {states.map((item) => (
                    <AnalysisStep key={item.id} item={item} analysis={analysis} />
                ))}
            </div>
        </div>
    );
}

function ProgressBar({ progress }) {
    return (
        <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-[#E5B900] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-1.5 flex justify-between text-[8px]">
                <span className="text-gray-400">Pemindaian visual awal</span>
                <span className="font-bold text-gray-600">{progress}% Selesai</span>
            </div>
        </div>
    );
}

function AnalysisStep({ item, analysis }) {
    const Icon = item.icon;

    const descriptions = {
        material: analysis?.nama_material
            ? `${analysis.nama_material} teridentifikasi secara akurat`
            : 'Mengenali jenis material dari foto',

        condition: analysis?.kondisi_barang
            ? `Kondisi ${analysis.kondisi_barang.toLowerCase()} teridentifikasi`
            : 'Memeriksa kondisi fisik material',

        weight: analysis?.bobot
            ? `Estimasi ${formatWeight(analysis.bobot)}`
            : 'Mengestimasi jumlah & bobot',

        matching: analysis
            ? 'Menganalisis potensi distribusi material'
            : 'Menganalisis potensi fasum terdekat'
    };

    return (
        <div className={`rounded-[9px] px-3 py-2.5 ${item.completed ? 'bg-[#F1FAF5]' : item.active ? 'border border-[#FFDB45] bg-[#FFF9DE]' : 'bg-[#FAFAFA]'}`}>
            <div className="flex items-center gap-2.5">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.completed ? 'bg-emerald-100 text-emerald-600' : item.active ? 'bg-[#FFCC00] text-gray-900' : 'bg-gray-100 text-gray-400'}`}>
                    {item.completed ? (
                        <Check className="h-3.5 w-3.5" />
                    ) : item.active ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Icon className="h-3.5 w-3.5" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className={`text-[9px] font-black ${item.completed || item.active ? 'text-gray-800' : 'text-gray-400'}`}>
                        {item.label}
                    </p>

                    <p className={`mt-0.5 truncate text-[8px] ${item.completed ? 'text-emerald-700' : 'text-gray-500'}`}>
                        {descriptions[item.id]}
                    </p>
                </div>
            </div>
        </div>
    );
}

function DetectionCard({ analysis, isSuccess }) {
    return (
        <div className="rounded-[17px] border border-[#EEEAE6] bg-white p-5 shadow-[0_4px_18px_rgba(30,30,30,0.03)]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#D5A900]" />

                    <h3 className="text-[12px] font-black text-gray-900">
                        Pratinjau Hasil Deteksi
                    </h3>
                </div>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[7px] font-bold text-gray-500">
                    Draft Otomatis
                </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
                <MiniResult
                    label="Kategori"
                    value={analysis?.kategori || 'Semen & Perekat'}
                />

                <MiniResult
                    label="Estimasi Bobot"
                    value={isSuccess ? formatWeight(analysis?.bobot) : '~160 Kg'}
                />
            </div>

            <div className="mt-3 rounded-[9px] bg-[#EAF8F1] p-3">
                <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700">
                        <Target className="h-3.5 w-3.5 text-white" />
                    </div>

                    <div>
                        <p className="text-[8px] font-black text-emerald-800">
                            Rekomendasi Sirkular
                        </p>

                        <p className="mt-1 text-[8px] leading-relaxed text-emerald-700">
                            {isSuccess
                                ? `Material ${analysis?.nama_material || 'ini'} berpotensi disalurkan untuk proyek perbaikan fasilitas warga.`
                                : 'Rekomendasi akan tersedia setelah analisis selesai.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                    Potensi Penerima Terdekat
                </p>

                <div className="mt-2 space-y-2">
                    <LocationRow text="Perbaikan Jalan Gang RT 03" distance="2.4 km" />
                    <LocationRow text="Renovasi Tempat Wudhu" distance="2.4 km" />
                </div>
            </div>
        </div>
    );
}

function MiniResult({ label, value }) {
    return (
        <div className="rounded-[8px] bg-[#FAFAFA] px-3 py-2.5">
            <p className="text-[8px] font-medium text-gray-400">
                {label}
            </p>

            <p className="mt-1 truncate text-[9px] font-black text-gray-800">
                {value}
            </p>
        </div>
    );
}

function LocationRow({ text, distance }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <MapPin className="h-3 w-3 text-gray-500" />
            </div>

            <span className="min-w-0 flex-1 truncate text-[8px] font-medium text-gray-600">
                {text}
            </span>

            <span className="text-[8px] font-bold text-gray-400">
                {distance}
            </span>
        </div>
    );
}

function TransparencyCard() {
    return (
        <div className="rounded-[13px] border border-[#E7E2D9] bg-[#FFFDF7] px-4 py-3.5">
            <div className="flex items-start gap-2.5">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

                <p className="text-[8px] leading-[1.6] text-gray-500">
                    <strong className="font-black text-gray-700">
                        Catatan Transparansi:
                    </strong>{' '}
                    Hasil analisis ini merupakan estimasi awal berbasis citra visual AI, bukan kajian teknis profesional struktural. Kamu tetap dapat memperbaiki jumlah, satuan, dan detail spesifikasi pada langkah berikutnya.
                </p>
            </div>
        </div>
    );
}

function BottomActions({ isProcessing, isSuccess, onBack, onNext }) {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#EDE9E5] bg-white/95 px-7 py-4 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-5">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 rounded-full bg-[#F0EFED] px-5 py-3 text-[9px] font-black text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Ulang Foto
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isSuccess}
                    className={`inline-flex min-w-[210px] items-center justify-center gap-3 rounded-full px-6 py-3 text-[9px] font-black transition ${isSuccess ? 'bg-[#FFCC00] text-gray-900 shadow-[0_5px_15px_rgba(255,204,0,0.25)] hover:bg-[#F4C000]' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}
                >
                    <span className="text-center leading-[1.35]">
                        Lanjut ke Konfirmasi
                        <br />
                        Data (Hasil AI)
                    </span>

                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </footer>
    );
}