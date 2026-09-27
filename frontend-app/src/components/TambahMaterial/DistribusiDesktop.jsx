import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Handshake, HeartHandshake, Info, Leaf, MapPin, Navigation, Network, QrCode, Truck, Zap } from 'lucide-react';

const getMaterialName = (data) => data?.nama_material ?? data?.namaMaterial ?? 'Material Bangunan';

const getCategory = (data) => data?.kategori ?? 'Material';

const getCondition = (data) => data?.kondisi_barang ?? data?.kondisi ?? data?.kelayakan ?? 'Belum ditentukan';

const getAddress = (data) => data?.alamat ?? data?.lokasi ?? 'Lokasi belum ditentukan';

const getQuantity = (data) => {
    const quantity = data?.jumlah ?? data?.quantity;
    const unit = data?.satuan ?? data?.unit ?? 'pcs';
    return quantity ? `${quantity} ${unit}` : 'Belum ditentukan';
};

const getWeight = (data) => {
    const weight = data?.bobot ?? data?.berat;
    return weight !== undefined && weight !== null && weight !== '' ? `±${weight} kg` : 'Belum ditentukan';
};

const OptionIndicator = ({ active }) => (
    active ? (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFCC00]">
            <Check className="h-3.5 w-3.5 text-gray-900" strokeWidth={3} />
        </div>
    ) : (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
            <span className="h-2 w-2 rounded-full bg-transparent" />
        </div>
    )
);

const Feature = ({ icon: Icon, children }) => (
    <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p className="text-[10px] leading-relaxed text-gray-700">{children}</p>
    </div>
);

const DistributionOption = ({ active, onClick, icon: Icon, badge, title, label, description, matchText, features, footerIcon, footerText }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-[24px] border-2 p-6 text-left transition-all duration-300 ${
            active
                ? 'border-[#FFCC00] bg-[#FFFDF5] shadow-[0_8px_30px_rgba(255,204,0,0.12)]'
                : 'border-transparent bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:border-gray-200'
        }`}
    >
        <div className="mb-6 flex items-start justify-between gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-[#FFCC00]' : 'bg-gray-100'}`}>
                <Icon className={`h-6 w-6 ${active ? 'text-gray-900' : 'text-gray-600'}`} />
            </div>

            <div className="flex items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-[9px] font-black ${active ? 'bg-[#FFCC00]/20 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                    {badge}
                </span>
                <OptionIndicator active={active} />
            </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
            <h3 className="text-[17px] font-black text-gray-900">{title}</h3>
            <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${active ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-gray-100 text-gray-600'}`}>
                {label}
            </span>
        </div>

        <p className="mb-5 text-[11px] leading-relaxed text-gray-600">{description}</p>

        <div className="mb-5 flex items-center gap-2 rounded-xl bg-gray-100/80 p-3">
            <Network className="h-4 w-4 shrink-0 text-gray-600" />
            <span className="text-[10px] font-bold text-gray-800">{matchText}</span>
        </div>

        <div className="mb-8 space-y-4">
            {features.map((feature) => (
                <Feature key={feature.id} icon={feature.icon}>
                    {feature.content}
                </Feature>
            ))}
        </div>

        <div className={`flex items-center justify-between border-t pt-4 ${active ? 'border-yellow-200/50' : 'border-gray-100'}`}>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500">
                {footerIcon}
                {footerText}
            </span>

            <span className={`text-[10px] font-bold ${active ? 'text-yellow-700' : 'text-gray-400'}`}>
                {active ? 'Pilihan Aktif' : 'Pilih Opsi Ini'}
            </span>
        </div>
    </button>
);

export default function DistribusiDesktop({ imagePayload, finalData, onBack, onNext }) {
    const [jalur, setJalur] = useState(finalData?.jalur_distribusi ?? finalData?.distribution_mode ?? 'donasi');
    const [imageSrc, setImageSrc] = useState('');

    const materialName = useMemo(() => getMaterialName(finalData), [finalData]);
    const category = useMemo(() => getCategory(finalData), [finalData]);
    const condition = useMemo(() => getCondition(finalData), [finalData]);
    const address = useMemo(() => getAddress(finalData), [finalData]);
    const quantity = useMemo(() => getQuantity(finalData), [finalData]);
    const weight = useMemo(() => getWeight(finalData), [finalData]);

    useEffect(() => {
        const existingUrl = imagePayload?.url ?? imagePayload?.previewUrl;

        if (existingUrl) {
            setImageSrc(existingUrl);
            return undefined;
        }

        const file = imagePayload?.file;

        if (!(file instanceof Blob)) {
            setImageSrc('');
            return undefined;
        }

        const objectUrl = URL.createObjectURL(file);
        setImageSrc(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [imagePayload]);

    const handleSelectJalur = useCallback((value) => {
        setJalur(value);
    }, []);

    const handleNext = useCallback(() => {
        const isDonasi = jalur === 'donasi';

        onNext?.({
            ...(finalData || {}),
            jalur_distribusi: jalur,
            distribution_mode: jalur,
            metode_distribusi: jalur,
            tujuan_distribusi: isDonasi ? 'donasi_proyek' : 'klaim_p2p',
            next_route: isDonasi ? 'ai_match' : 'maps',
            is_p2p: !isDonasi,
            is_donasi: isDonasi
        });
    }, [finalData, jalur, onNext]);

    const donasiFeatures = useMemo(() => [
        {
            id: 'facility',
            icon: CheckCircle2,
            content: (
                <>
                    <strong className="text-gray-900">Prioritas fasilitas umum:</strong>{' '}
                    Akses jalan lingkungan, posyandu, balai RT, dan renovasi sarana ibadah.
                </>
            )
        },
        {
            id: 'truck',
            icon: Truck,
            content: (
                <>
                    <strong className="text-gray-900">Penjemputan armada resmi:</strong>{' '}
                    Diangkut langsung oleh kurir logistik SISAIN tanpa batasan radius ketat.
                </>
            )
        },
        {
            id: 'impact',
            icon: Leaf,
            content: (
                <>
                    <strong className="text-gray-900">Dampak terdata transparan:</strong>{' '}
                    Peroleh sertifikat pengurangan emisi CO2e dan Koin Sirkular.
                </>
            )
        }
    ], []);

    const p2pFeatures = useMemo(() => [
        {
            id: 'radius',
            icon: MapPin,
            content: (
                <>
                    <strong className="text-gray-900">Jangkauan lokal:</strong>{' '}
                    Material ditampilkan kepada penerima di sekitar lokasi Anda melalui peta SISAIN.
                </>
            )
        },
        {
            id: 'pickup',
            icon: Navigation,
            content: (
                <>
                    <strong className="text-gray-900">Pengambilan mandiri:</strong>{' '}
                    Penerima mengambil material langsung pada lokasi yang telah disepakati.
                </>
            )
        },
        {
            id: 'qr',
            icon: QrCode,
            content: (
                <>
                    <strong className="text-gray-900">Verifikasi reservasi:</strong>{' '}
                    Serah terima dilakukan dengan konfirmasi dan kode/QR untuk keamanan kedua pihak.
                </>
            )
        }
    ], []);

    const nextLabel = jalur === 'donasi' ? 'Lanjutkan ke AI Match' : 'Buka Peta P2P Lokal';
    const nextDescription = jalur === 'donasi'
        ? 'Cari proyek sosial yang paling membutuhkan material ini.'
        : 'Cari penerima di sekitar lokasi material melalui peta SISAIN.';

    return (
        <div className="min-h-screen bg-[#FCF9F8] pb-24 font-sans">
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-[#FCF9F8] px-6 py-4">
                <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-xs font-bold">Kembali ke Konfirmasi</span>
                </button>

                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                    <span className="text-emerald-600">Langkah 4</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>Penentuan Jalur Distribusi</span>
                </div>
            </header>

            <main className="mx-auto max-w-[980px] px-6 pt-7">
                <div className="mb-9 flex items-center justify-center gap-3">
                    {[
                        ['01', 'Foto Material'],
                        ['02', 'Analisis AI'],
                        ['03', 'Konfirmasi']
                    ].map(([number, label]) => (
                        <React.Fragment key={number}>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <span className="text-[9px] font-black">{number}</span>
                                <span className="text-[10px] font-bold">{label}</span>
                            </div>

                            <div className="h-px w-4 bg-gray-300" />
                        </React.Fragment>
                    ))}

                    <div className="flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-3.5 py-1.5 shadow-sm">
                        <span className="text-[9px] font-black text-gray-900">04</span>
                        <span className="text-[10px] font-bold text-gray-900">Distribusi</span>
                    </div>
                </div>

                <section className="mb-8 flex items-center justify-between gap-5 rounded-[20px] border border-gray-100 bg-white p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                            {imageSrc ? (
                                <img src={imageSrc} alt={materialName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-gray-400">
                                    FOTO
                                </div>
                            )}

                            <div className="absolute bottom-1 right-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[7px] font-black text-white">
                                {category}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-sm font-black text-gray-900">{materialName}</h3>

                                <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-600">
                                    {quantity} • {weight}
                                </span>
                            </div>

                            <p className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-gray-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {condition}
                                <span className="text-gray-300">•</span>
                                <MapPin className="h-3 w-3" />
                                {address}
                            </p>
                        </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-[#F0FDF4] px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:flex">
                        <CheckCircle2 className="h-4 w-4" />
                        Siap Disalurkan
                    </div>
                </section>

                <section className="mb-6">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-yellow-700">
                        Penentuan Jalur Distribusi
                    </p>

                    <h2 className="mb-3 text-[31px] font-black tracking-tight text-gray-900">
                        Material ini ingin disalurkan ke mana?
                    </h2>

                    <p className="max-w-2xl text-[11px] font-medium leading-relaxed text-gray-500">
                        Pilih jalur penyaluran. SISAIN akan mengarahkan Anda ke proses yang sesuai dengan tujuan material.
                    </p>
                </section>

                <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <DistributionOption
                        active={jalur === 'donasi'}
                        onClick={() => handleSelectJalur('donasi')}
                        icon={HeartHandshake}
                        badge="REKOMENDASI UTAMA"
                        title="Donasi Proyek"
                        label="Berdampak Tinggi"
                        description="Salurkan material ke proyek sosial, sarana ibadah, atau fasilitas publik yang membutuhkan material dan dapat diverifikasi."
                        matchText="Selanjutnya: AI Match kebutuhan proyek"
                        features={donasiFeatures}
                        footerIcon={<Zap className="h-3.5 w-3.5 text-yellow-500" />}
                        footerText="Pencarian proyek berbasis kebutuhan"
                    />

                    <DistributionOption
                        active={jalur === 'p2p'}
                        onClick={() => handleSelectJalur('p2p')}
                        icon={Handshake}
                        badge="PENYALURAN KILAT"
                        title="Klaim P2P Lokal"
                        label="Mandiri"
                        description="Buka akses material kepada warga, tukang, pengrajin, atau pengguna sekitar yang sedang membutuhkan material."
                        matchText="Selanjutnya: Peta P2P Lokal SISAIN"
                        features={p2pFeatures}
                        footerIcon={<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />}
                        footerText="Pencarian berdasarkan lokasi"
                    />
                </div>

                <div className="mb-7 flex items-start gap-3 rounded-2xl bg-[#F9F8F6] p-5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-yellow-700" />

                    <div>
                        <h4 className="mb-1 text-[10px] font-black text-gray-900">
                            Transparansi Penyaluran SISAIN
                        </h4>

                        <p className="text-[10px] leading-relaxed text-gray-600">
                            Jalur Donasi Proyek akan membawa Anda ke pencarian AI untuk menemukan proyek yang membutuhkan material. Jalur Klaim P2P akan membawa Anda langsung ke peta SISAIN untuk melihat penerima dan proyek di sekitar lokasi material.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-[20px] border border-gray-100 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                    <button type="button" onClick={onBack} className="flex items-center gap-2 px-2 text-[10px] font-bold text-gray-600 transition-colors hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        Periksa Kembali Data Material
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-[8px] font-medium text-gray-500">Tahap Selanjutnya</p>
                            <p className="text-[9px] font-black text-gray-900">{nextDescription}</p>
                        </div>

                        <button type="button" onClick={handleNext} className="flex items-center gap-2 rounded-full bg-[#FFCC00] px-6 py-3.5 text-[10px] font-black text-gray-900 shadow-sm transition-all hover:bg-yellow-400 active:scale-[0.98]">
                            {nextLabel}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}