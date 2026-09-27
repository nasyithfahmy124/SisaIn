import React, { useRef, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    ChevronRight,
    Construction,
    ExternalLink,
    MapPin,
    School,
    Sparkles,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import sdnKarangIndah from '../assets/img/sdn-karang-indah.jpg';
import musholaSayyidinaAli from '../assets/img/mushola-sayyidina-ali.jpg';
import jalanDesaKatua from '../assets/img/jalan-desa-katua.jpg';

const STUDI_KASUS = [
    {
        id: 1,
        category: 'Pendidikan',
        categoryIcon: School,
        title: 'SDN Karang Indah 1 Bekasi Rusak',
        location: 'Kabupaten Bekasi',
        year: '20 Agu 2026',
        image: sdnKarangIndah,
        accent: 'yellow',
        highlight: '2 ruang kelas rusak',
        description: 'Murid belajar di ruang kelas yang mengalami kerusakan. Kondisi tersebut menjadi persoalan fasilitas sekolah yang membutuhkan perhatian.',
        stats: [
            { value: '91', label: 'murid' },
            { value: '6', label: 'guru' },
            { value: '2', label: 'ruang rusak' }
        ],
        source: 'Pikiran Rakyat Koran',
        sourceNote: '20 Agustus 2026',
        sourceUrl: 'https://koran.pikiran-rakyat.com/news/pr-30310401794/sdn-karang-indah-1-bekasi-rusak-murid-belajar-di-kelas-yang-mengkhawatirkan'
    },
    {
        id: 2,
        category: 'Tempat Ibadah',
        categoryIcon: Building2,
        title: 'Mushola Sayyidina Ali Butuh Perbaikan',
        location: 'Warudoyong, Sukabumi',
        year: '30 Mar 2022',
        image: musholaSayyidinaAli,
        accent: 'green',
        highlight: '32 tahun belum diperbaiki',
        description: 'Dinding dan tiang kayu dilaporkan retak serta lapuk. Lantai juga mengalami kerusakan dan warga berharap mushola dapat diperbaiki.',
        stats: [
            { value: '4×5', label: 'meter area' },
            { value: '45+', label: 'kepala keluarga' },
            { value: '2 km', label: 'masjid terdekat' }
        ],
        source: 'Okezone Muslim',
        sourceNote: '30 Maret 2022',
        sourceUrl: 'https://muslim.okezone.com/read/2022/03/30/614/2570419/kisah-jamaah-kampung-khusyuk-beribadah-di-mushola-sederhana-terbuat-dari-kayu'
    },
    {
        id: 3,
        category: 'Infrastruktur',
        categoryIcon: Construction,
        title: 'Ketika Jalan Desa Rusak, Siapa yang Harus Bertanggung Jawab?',
        location: 'Desa Katua, Dompu',
        year: '19 Sep 2026',
        image: jalanDesaKatua,
        accent: 'blue',
        highlight: 'Akses publik desa',
        description: 'Kerusakan jalan tani menjadi sorotan karena jalur tersebut digunakan masyarakat untuk aktivitas dan akses sehari-hari.',
        stats: [
            { value: 'Akses', label: 'transportasi warga' },
            { value: 'Tani', label: 'aktivitas ekonomi' },
            { value: 'Perlu', label: 'pemulihan' }
        ],
        source: 'NETRAL',
        sourceNote: '19 September 2026',
        sourceUrl: 'https://netral.co.id/ketika-jalan-desa-rusak-siapa-yang-harus-bertanggung-jawab/'
    }
];

const ACCENT_STYLES = {
    yellow: {
        badge: 'bg-[#FFF4C4] text-yellow-900',
        icon: 'bg-[#FFCC00] text-gray-900',
        soft: 'bg-[#FFF9E6]',
        border: 'border-yellow-100',
        text: 'text-yellow-700',
        button: 'bg-gray-900 hover:bg-gray-800'
    },
    green: {
        badge: 'bg-emerald-100 text-emerald-800',
        icon: 'bg-emerald-700 text-white',
        soft: 'bg-emerald-50',
        border: 'border-emerald-100',
        text: 'text-emerald-700',
        button: 'bg-emerald-700 hover:bg-emerald-800'
    },
    blue: {
        badge: 'bg-blue-100 text-blue-800',
        icon: 'bg-blue-600 text-white',
        soft: 'bg-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700'
    }
};

const getSafeStats = (stats) => {
    if (Array.isArray(stats) && stats.length) {
        return stats.slice(0, 3);
    }

    return [
        { value: '-', label: 'Data belum tersedia' },
        { value: '-', label: 'Data belum tersedia' },
        { value: '-', label: 'Data belum tersedia' }
    ];
};

const getFallbackLabel = (category) => {
    if (category === 'Pendidikan') return 'FASILITAS SEKOLAH';
    if (category === 'Tempat Ibadah') return 'TEMPAT IBADAH';
    return 'INFRASTRUKTUR DESA';
};

const CaseImage = ({ item, styles, CategoryIcon }) => {
    const [hasError, setHasError] = useState(false);

    if (!item?.image || hasError) {
        return (
            <div className={`flex h-full w-full items-end ${styles.soft} p-5`}>
                <div className="flex w-full items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p className={`text-[8px] font-black uppercase tracking-[0.18em] ${styles.text}`}>
                            Studi Kasus
                        </p>

                        <p className="mt-1 text-sm font-black text-gray-900">
                            {getFallbackLabel(item?.category)}
                        </p>
                    </div>

                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}>
                        <CategoryIcon className="h-5 w-5" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <img
            src={item.image}
            alt={item.title || 'Studi kasus'}
            onError={() => setHasError(true)}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
    );
};

const CaseCard = ({ item, active, onOpen }) => {
    const styles = ACCENT_STYLES[item?.accent] || ACCENT_STYLES.yellow;
    const CategoryIcon = item?.categoryIcon || Construction;
    const stats = getSafeStats(item?.stats);

    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-white shadow-sm transition-all ${
                active
                    ? `${styles.border} shadow-[0_16px_45px_rgba(15,23,42,0.08)]`
                    : 'border-gray-100 hover:shadow-[0_12px_35px_rgba(15,23,42,0.06)]'
            }`}
        >
            <div className="relative aspect-[1.45] overflow-hidden bg-gray-100">
                <CaseImage
                    item={item}
                    styles={styles}
                    CategoryIcon={CategoryIcon}
                />

                <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1.5 text-[8px] font-black ${styles.badge}`}>
                        {item?.category || 'Studi Kasus'}
                    </span>

                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-bold text-gray-700 backdrop-blur">
                        {item?.year || '-'}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[17px] font-black leading-tight tracking-tight text-gray-900">
                            {item?.title || 'Kasus Fasilitas'}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-gray-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                                {item?.location || 'Lokasi belum tersedia'}
                            </span>
                        </div>
                    </div>

                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
                        <CategoryIcon className="h-4 w-4" />
                    </div>
                </div>

                <div className={`mb-4 rounded-2xl border ${styles.border} ${styles.soft} px-4 py-3`}>
                    <p className={`text-[8px] font-black uppercase tracking-[0.16em] ${styles.text}`}>
                        Kondisi Utama
                    </p>

                    <p className="mt-1 text-[11px] font-black leading-relaxed text-gray-900">
                        {item?.highlight || 'Informasi kondisi tersedia pada sumber'}
                    </p>
                </div>

                <p className="text-[10px] font-medium leading-relaxed text-gray-500">
                    {item?.description || 'Informasi kasus belum tersedia.'}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                    {stats.map((stat, index) => (
                        <div
                            key={`${item?.id || 'case'}-${index}`}
                            className="min-w-0 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3"
                        >
                            <p className="truncate text-[12px] font-black text-gray-900">
                                {stat?.value ?? '-'}
                            </p>

                            <p className="mt-1 line-clamp-2 text-[7px] font-bold uppercase leading-tight tracking-wide text-gray-400">
                                {stat?.label ?? 'Data'}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-gray-400">
                                Sumber
                            </p>

                            <p className="mt-1 truncate text-[9px] font-black text-gray-800">
                                {item?.source || 'Sumber belum tersedia'}
                            </p>

                            <p className="mt-0.5 text-[7px] font-medium text-gray-400">
                                {item?.sourceNote || ''}
                            </p>
                        </div>

                        <Sparkles className={`h-4 w-4 shrink-0 ${styles.text}`} />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onOpen?.(item)}
                            className={`group flex min-w-0 flex-1 items-center justify-between rounded-2xl px-4 py-3 text-[9px] font-black text-white transition ${styles.button}`}
                        >
                            <span className="truncate">LIHAT KASUS</span>

                            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                        </button>

                        {item?.sourceUrl && (
                            <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Buka sumber ${item.title}`}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default function StudiKasus({ onOpen }) {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToIndex = (index) => {
        const container = scrollRef.current;

        if (!container) return;

        const cards = container.querySelectorAll('[data-case-card]');
        const card = cards[index];

        if (!card) return;

        container.scrollTo({
            left: card.offsetLeft - container.offsetLeft,
            behavior: 'smooth'
        });

        setActiveIndex(index);
    };

    const handleScroll = () => {
        const container = scrollRef.current;

        if (!container) return;

        const cards = [...container.querySelectorAll('[data-case-card]')];

        if (!cards.length) return;

        const current = cards.reduce(
            (closest, card, index) => {
                const distance = Math.abs(
                    card.offsetLeft -
                    container.scrollLeft -
                    container.offsetLeft
                );

                return distance < closest.distance
                    ? { index, distance }
                    : closest;
            },
            { index: 0, distance: Infinity }
        );

        setActiveIndex(current.index);
    };

    const handlePrevious = () => {
        const index = activeIndex <= 0
            ? STUDI_KASUS.length - 1
            : activeIndex - 1;

        scrollToIndex(index);
    };

    const handleNext = () => {
        const index = activeIndex >= STUDI_KASUS.length - 1
            ? 0
            : activeIndex + 1;

        scrollToIndex(index);
    };

    return (
        <section className="relative overflow-hidden bg-[#FCFBF8] py-16 md:py-20">
            <div className="absolute left-0 top-10 h-40 w-40 rounded-full bg-[#FFCC00]/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-emerald-100/30 blur-3xl" />

            <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
                <div className="mb-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-[650px]">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex items-center gap-1.5 rounded-full bg-[#FFF4C4] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-yellow-900">
                                <Star className="h-3 w-3" />
                                Real Case
                            </span>

                            <span className="rounded-full bg-white px-3 py-1.5 text-[8px] font-bold text-gray-500 ring-1 ring-gray-200">
                                Kasus nyata
                            </span>
                        </div>

                        <h2 className="max-w-3xl text-[30px] font-black leading-[1.05] tracking-tight text-gray-900 md:text-[42px]">
                            Masalah kecil di peta,{' '}
                            <span className="text-yellow-500">
                                dampaknya besar.
                            </span>
                        </h2>

                        <p className="mt-4 max-w-2xl text-[11px] font-medium leading-relaxed text-gray-500 md:text-[12px]">
                            Tidak semua fasilitas rusak terlihat besar. Banyak kebutuhan muncul dari ruang kelas, tempat ibadah, dan akses desa yang tetap digunakan setiap hari.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                            aria-label="Kasus sebelumnya"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm transition hover:bg-gray-800"
                            aria-label="Kasus berikutnya"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible"
                >
                    {STUDI_KASUS.map((item, index) => (
                        <div
                            key={item.id}
                            data-case-card
                            className="w-[86%] shrink-0 snap-center sm:w-[62%] md:w-[44%] lg:w-auto"
                        >
                            <CaseCard
                                item={item}
                                active={activeIndex === index}
                                onOpen={onOpen}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-1.5 lg:hidden">
                    {STUDI_KASUS.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => scrollToIndex(index)}
                            aria-label={`Tampilkan kasus ${index + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                                activeIndex === index
                                    ? 'w-7 bg-gray-900'
                                    : 'w-1.5 bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E6] text-yellow-700">
                            <Sparkles className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-[9px] font-black text-gray-900">
                                Kenapa SISAIN dibutuhkan?
                            </p>

                            <p className="mt-1 max-w-2xl text-[8px] font-medium leading-relaxed text-gray-500">
                                Material surplus yang masih layak dapat diarahkan ke kebutuhan nyata agar nilai gunanya tetap berputar di masyarakat.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/maps"
                        className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-[9px] font-black text-gray-900 transition hover:bg-yellow-400"
                    >
                        LIHAT PETA KEBUTUHAN
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}