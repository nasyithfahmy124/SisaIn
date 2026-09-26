
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Leaf, MapPin, RefreshCw, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import { useAiRedistribusi } from '../../hooks/useAiRedistribusi';

const getValue = (value, fallback = 'Tidak tersedia') => value ?? fallback;
const formatText = (value) => value ? String(value).replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Tidak tersedia';
const formatWeight = (value) => {
    if (value === null || value === undefined || value === '') return 'Tidak tersedia';
    const number = Number(value);
    return Number.isNaN(number) ? String(value) : `~${number.toLocaleString('id-ID')} kg`;
};
const getWeight = (result) => result?.bobot ?? result?.berat ?? result?.jumlah_bobot ?? result?.estimasi_bobot ?? result?.weight;
const getCondition = (result) => result?.kondisi_barang ?? result?.kondisi ?? result?.status_kondisi;
const getMaterial = (result) => result?.nama_material ?? result?.namaMaterial ?? result?.material;
const getCategory = (result) => result?.kategori ?? result?.category;
const getAccuracy = (result) => result?.akurasi ?? result?.accuracy ?? result?.confidence;
const getIntegrity = (result) => result?.integritas ?? result?.persentase_kondisi ?? result?.persentase_keutuhan;
const getImpact = (result) => result?.dampak_lingkungan ?? result?.impact;
const getRecommendations = (result) => {
    const items = result?.rekomendasi ?? result?.recommendations ?? result?.potensi_penerima ?? result?.penerima_terdekat ?? [];
    return Array.isArray(items) ? items : [];
};
const getRecommendationName = (item) => item?.nama ?? item?.nama_proyek ?? item?.nama_penerima ?? item?.title ?? 'Penerima material';
const getRecommendationDistance = (item) => item?.jarak ?? item?.distance ?? item?.distance_km;
const getImageUrl = (payload) => payload?.url || payload?.preview || (payload?.file ? URL.createObjectURL(payload.file) : null);

function MobileHeader({ progress, onBack }) {
    return (
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white px-4 pb-4 pt-5">
            <button type="button" onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-900">
                <ArrowLeft className="h-5 w-5" /><span className="text-sm font-bold">Kembali</span>
            </button>
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-black tracking-tight text-gray-900">Analisis Material Ai</h1>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200"><motion.div className="h-full rounded-full bg-[#FFCC00]" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} /></div>
            </div>
        </header>
    );
}

function Stepper() {
    const steps = [{ label: '01 Foto', done: true }, { label: '02 Analisis', active: true }, { label: '03 Konfirm' }, { label: '04 Kirim' }];

    return (
        <div className="overflow-hidden rounded-full border border-gray-100 bg-white px-1.5 py-1.5 shadow-sm">
            <div className="flex min-w-max items-center gap-1.5">
                {steps.map((step) => (
                    <div key={step.label} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 ${step.active ? 'bg-[#FFCC00]' : 'text-gray-400'}`}>
                        {step.done ? <Check className="h-3 w-3" /> : <span className={`h-1.5 w-1.5 rounded-full ${step.active ? 'bg-gray-900' : 'bg-gray-300'}`} />}
                        <span className={`text-[10px] ${step.active ? 'font-black text-gray-900' : 'font-bold'}`}>{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Scanner({ loading, position }) {
    return <AnimatePresence>{loading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 z-10 h-10 border-b-[3px] border-[#FFCC00] bg-gradient-to-b from-transparent to-[#FFCC00]/50" style={{ top: `${position}%` }} />}</AnimatePresence>;
}

function OverlayTag({ className, visible, children }) {
    return <AnimatePresence>{visible && <motion.div initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.35 }} className={`absolute ${className}`}>{children}</motion.div>}</AnimatePresence>;
}

function ImageAnalysis({ imagePayload, result, loading, failed, scanPosition, progress }) {
    const imageUrl = getImageUrl(imagePayload);
    const material = getMaterial(result);
    const condition = getCondition(result);
    const weight = getWeight(result);
    const integrity = getIntegrity(result);

    return (
        <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-sm">
                {imageUrl ? <img src={imageUrl} alt="Material yang dianalisis" className={`h-full w-full object-cover transition-all duration-700 ${loading ? 'scale-105 opacity-90' : 'scale-100 opacity-100'}`} /> : <div className="flex h-full items-center justify-center text-xs text-gray-400">Foto material tidak tersedia</div>}

                <Scanner loading={loading} position={scanPosition} />

                <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-[3px] border-t-[3px] border-[#FFCC00]" />
                <div className="pointer-events-none absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-[3px] border-t-[3px] border-[#FFCC00]" />
                <div className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-[3px] border-l-[3px] border-[#FFCC00]" />
                <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-[3px] border-r-[3px] border-[#FFCC00]" />

                <OverlayTag visible={progress >= 25 || Boolean(result)} className="left-5 top-5">
                    <div className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-gray-900 shadow-sm backdrop-blur"><Check className="h-3 w-3 text-emerald-600" />{getValue(material, 'Material terdeteksi')}</div>
                </OverlayTag>

                <OverlayTag visible={progress >= 50 || Boolean(result)} className="right-5 top-5">
                    <div className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-gray-900 shadow-sm backdrop-blur"><Check className="h-3 w-3 text-emerald-600" />{integrity ? `${integrity}%` : formatText(condition)}</div>
                </OverlayTag>

                <OverlayTag visible={progress >= 75 || Boolean(result)} className="bottom-5 left-5">
                    <div className="flex items-center gap-1 rounded-full border border-yellow-400 bg-[#FFCC00]/95 px-2 py-1 text-[9px] font-black text-gray-900 shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-gray-900" />{formatWeight(weight)}</div>
                </OverlayTag>

                <OverlayTag visible={Boolean(result) && !failed} className="bottom-5 right-5">
                    <div className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100/95 px-2 py-1 text-[9px] font-black text-emerald-800 shadow-sm"><Zap className="h-3 w-3 text-emerald-600" />Prioritas Tinggi</div>
                </OverlayTag>

                {failed && (
                    <div className="absolute inset-x-4 bottom-4 rounded-xl border border-red-200 bg-white/95 p-3 shadow-lg backdrop-blur">
                        <div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><div><p className="text-[9px] font-black text-red-700">Analisis gagal</p><p className="mt-0.5 text-[8px] leading-relaxed text-gray-600">Gambar tidak berhasil diproses oleh AI.</p></div></div>
                    </div>
                )}
            </div>

            <div className="mt-2 flex items-center justify-between px-1">
                <p className="flex items-center gap-1 text-[8px] font-bold text-gray-500"><ShieldCheck className="h-3 w-3 text-[#FFCC00]" />AI Vision • Analisis Material</p>
                <span className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-[8px] font-bold text-gray-600">{result ? 'Analisis selesai' : loading ? 'Memproses' : 'Menunggu'}</span>
            </div>
        </div>
    );
}

function StatusIcon({ state }) {
    if (state === 'complete') return <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-3 w-3" /></div>;
    if (state === 'active') return <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600"><RefreshCw className="h-3 w-3 animate-spin" /></div>;
    return <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-200"><span className="h-1.5 w-1.5 rounded-full bg-gray-300" /></div>;
}

function InspectionItem({ title, detail, state, badge }) {
    return (
        <div className={`flex gap-3 rounded-xl p-2 transition-colors ${state === 'active' ? 'bg-[#FFFAEB]' : ''}`}>
            <StatusIcon state={state} />
            <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-center gap-2"><h4 className={`text-[11px] font-black ${state === 'idle' ? 'text-gray-400' : 'text-gray-900'}`}>{title}</h4>{badge && <span className={`rounded px-1.5 py-0.5 text-[8px] font-black ${state === 'active' ? 'bg-[#FFCC00] text-gray-900' : 'text-emerald-600'}`}>{badge}</span>}</div>
                <p className={`text-[9px] leading-[1.5] ${state === 'idle' ? 'text-gray-400' : 'text-gray-500'}`}>{detail}</p>
            </div>
        </div>
    );
}

function Inspection({ result, loading }) {
    const material = getMaterial(result);
    const condition = getCondition(result);
    const weight = getWeight(result);
    const success = Boolean(result);

    const items = [
        { title: 'Mengenali Jenis Material', detail: success ? `${material} berhasil teridentifikasi dari gambar material.` : 'Menganalisis bentuk, kemasan, dan karakteristik material.', state: success || loading ? 'complete' : 'idle', badge: success ? 'Selesai' : null },
        { title: 'Memeriksa Kondisi Fisik', detail: success ? `Kondisi material: ${formatText(condition)}.` : 'Memeriksa kondisi visual dan indikasi kerusakan material.', state: success || loading ? 'complete' : 'idle', badge: success ? formatText(condition) : null },
        { title: 'Kalkulasi Volume & Bobot', detail: success ? `Estimasi bobot material ${formatWeight(weight)} berdasarkan hasil AI.` : 'Mengestimasi jumlah, volume, dan bobot material.', state: success ? 'complete' : loading ? 'active' : 'idle', badge: loading && !success ? 'Sedang Dihitung' : null },
        { title: 'Pencocokan Fasum Terdekat', detail: success ? 'Menghubungkan hasil analisis dengan rekomendasi penerima dari API.' : 'Menunggu hasil kalkulasi material.', state: success ? 'complete' : 'idle' },
    ];

    return (
        <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-base font-black text-gray-900">Pemeriksaan Material</h3><span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black ${success ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-600'}`}>{!success && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />}{success ? 'Selesai' : 'Aktif'}</span></div>
            <div className="space-y-2">{items.map((item) => <InspectionItem key={item.title} {...item} />)}</div>
        </section>
    );
}

function DetectionSummary({ result }) {
    const category = getCategory(result);
    const weight = getWeight(result);
    const accuracy = getAccuracy(result);
    const impact = getImpact(result);
    const recommendations = getRecommendations(result);

    return (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: result ? 1 : 0.45, y: 0 }} className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-end justify-between"><span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Ringkasan Deteksi</span>{accuracy && <span className="text-[9px] font-bold text-yellow-600">Akurasi Visual: {accuracy}%</span>}</div>

            <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3"><p className="mb-0.5 text-[9px] text-gray-500">Kategori Utama</p><p className="text-[12px] font-black text-gray-900">{getValue(category)}</p></div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3"><p className="mb-0.5 text-[9px] text-gray-500">Estimasi Muatan</p><p className="text-[12px] font-black text-gray-900">{formatWeight(weight)}</p></div>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F0FDF4] p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100"><Leaf className="h-3.5 w-3.5 text-emerald-600" /></div>
                <div><h4 className="text-[9px] font-black text-emerald-800">Dampak Lingkungan Potensial</h4><p className="mt-0.5 text-[9px] leading-tight text-emerald-700">{getValue(impact, 'Dampak lingkungan akan dihitung berdasarkan hasil analisis material.')}</p></div>
            </div>

            <div>
                <p className="mb-2 text-[9px] font-bold text-gray-500">Rekomendasi Penyaluran Cepat:</p>
                <div className="space-y-1.5">
                    {recommendations.length ? recommendations.map((item, index) => (
                        <div key={item?.id ?? index} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <span className="flex min-w-0 items-center gap-1.5 truncate text-[9px] font-semibold text-gray-700"><MapPin className="h-3 w-3 shrink-0 text-yellow-600" />{getRecommendationName(item)}</span>
                            {getRecommendationDistance(item) && <span className="shrink-0 text-[9px] text-gray-500">{getRecommendationDistance(item)}</span>}
                        </div>
                    )) : <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-[9px] text-gray-400">Belum ada rekomendasi penerima dari API.</div>}
                </div>
            </div>
        </motion.section>
    );
}

function TransparencyNote() {
    return (
        <div className="px-1">
            <div className="flex gap-2.5"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" /><p className="text-[9px] leading-relaxed text-gray-500"><strong className="text-gray-800">Catatan Transparansi:</strong> Hasil analisis merupakan estimasi visual awal berbasis AI, bukan uji laboratorium. Kamu tetap memegang kendali penuh untuk menyunting bobot dan kondisi fisik di tahap konfirmasi.</p></div>
        </div>
    );
}

function ErrorState({ error, onRetry }) {
    return (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50"><AlertCircle className="h-4 w-4 text-red-500" /></div><div><h3 className="text-sm font-black text-gray-900">Analisis gagal</h3><p className="mt-1 text-[9px] leading-relaxed text-gray-500">{error || 'Material tidak berhasil dianalisis oleh AI.'}</p></div></div>
            <button type="button" onClick={onRetry} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] py-3 text-[10px] font-black text-gray-900 shadow-sm transition hover:bg-yellow-400 active:scale-[0.98]"><RefreshCw className="h-3.5 w-3.5" />Coba Lagi</button>
        </motion.section>
    );
}

function BottomActions({ loading, failed, success, onBack, onRetry, onNext, result }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 bg-white px-4 pb-6 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            <button type="button" onClick={failed ? onRetry : onBack} className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gray-100 px-5 py-3.5 text-[11px] font-bold text-gray-800 transition-transform active:scale-95">{failed ? <RefreshCw className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}{failed ? 'Coba Lagi' : 'Ulang'}</button>
            <button type="button" onClick={() => onNext?.(result)} disabled={!success || loading} className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-[11px] font-black transition-all ${success && !loading ? 'bg-[#FFCC00] text-gray-900 shadow-sm active:scale-95' : 'bg-gray-100 text-gray-400 opacity-80'}`}>Lanjut ke Konfirmasi<ArrowRight className="h-4 w-4" /></button>
        </div>
    );
}

export default function AnalisisAIMobile({ imagePayload, onBack, onNext }) {
    const { analyzeImage, isLoading, error: hookError } = useAiRedistribusi();
    const analyzeRef = useRef(analyzeImage);
    const analyzedFileRef = useRef(null);
    const [result, setResult] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [scanPosition, setScanPosition] = useState(5);
    const [scanDirection, setScanDirection] = useState(1);

    const loading = Boolean(isLoading);
    const error = localError || hookError;
    const failed = Boolean(error);
    const success = Boolean(result) && !loading && !failed;
    const progress = failed ? 0 : success ? 100 : loading ? 78 : 0;

    analyzeRef.current = analyzeImage;

    const runAnalysis = useCallback(() => {
        if (!imagePayload?.file) {
            setLocalError('Foto material tidak ditemukan.');
            return;
        }

        setResult(null);
        setLocalError(null);
        analyzeRef.current(imagePayload).then(setResult).catch((err) => setLocalError(err?.message || 'Gagal menganalisis gambar melalui AI.'));
    }, [imagePayload]);

    useEffect(() => {
        if (!imagePayload?.file || analyzedFileRef.current === imagePayload.file) return;
        analyzedFileRef.current = imagePayload.file;
        runAnalysis();
    }, [imagePayload?.file, runAnalysis]);

    useEffect(() => {
        if (!loading) return undefined;

        const interval = setInterval(() => {
            setScanPosition((current) => {
                const next = current + scanDirection * 1.5;
                if (next >= 88) { setScanDirection(-1); return 88; }
                if (next <= 5) { setScanDirection(1); return 5; }
                return next;
            });
        }, 35);

        return () => clearInterval(interval);
    }, [loading, scanDirection]);

    return (
        <main className="min-h-screen bg-[#FAF9F7] pb-32 font-sans">
            <MobileHeader progress={progress} onBack={onBack} />

            <div className="px-4 py-4">
                <Stepper />
            </div>

            <div className="space-y-4 px-4">
                <ImageAnalysis imagePayload={imagePayload} result={result} loading={loading} failed={failed} scanPosition={scanPosition} progress={progress} />

                {failed ? (
                    <ErrorState error={error} onRetry={runAnalysis} />
                ) : (
                    <>
                        <Inspection result={result} loading={loading} />
                        <DetectionSummary result={result} />
                        <TransparencyNote />
                    </>
                )}
            </div>

            <BottomActions loading={loading} failed={failed} success={success} result={result} onBack={onBack} onRetry={runAnalysis} onNext={onNext} />
        </main>
    );
}
