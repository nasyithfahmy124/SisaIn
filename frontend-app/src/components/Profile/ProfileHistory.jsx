import React, { useMemo, useState } from 'react';
import { Sparkles, Clock, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

const TAB_CONFIG = [
    { key: 'semua', label: 'Semua' },
    { key: 'berjalan', label: 'Berjalan' },
    { key: 'selesai', label: 'Selesai' }
];

const STATUS_STYLES = {
    active: 'bg-blue-50 text-blue-700 border-blue-100',
    pending: 'bg-gray-100 text-gray-600 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100'
};

const getFilteredHistories = (histories, activeTab) => {
    if (activeTab === 'semua') return histories;
    if (activeTab === 'berjalan') return histories.filter(({ type }) => type === 'active' || type === 'pending');
    return histories.filter(({ type }) => type === 'success');
};

const getTabCount = (histories, tab) => {
    if (tab === 'semua') return histories.length;
    if (tab === 'berjalan') return histories.filter(({ type }) => type === 'active' || type === 'pending').length;
    return histories.filter(({ type }) => type === 'success').length;
};

export default function ProfileHistory({ histories = [] }) {
    const [activeTab, setActiveTab] = useState('semua');

    const filteredHistories = useMemo(() => getFilteredHistories(histories, activeTab), [histories, activeTab]);

    return (
        <section className="w-full">
            <header className="mb-5 flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-1.5 whitespace-nowrap text-xl font-black tracking-tight text-gray-900">
                    Riwayat & Donasi Aktif
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                </h3>

                <div className="flex shrink-0 items-center rounded-full border border-gray-200/70 bg-gray-100/80 p-0.5">
                    {TAB_CONFIG.map(({ key, label }) => {
                        const isActive = activeTab === key;
                        const count = getTabCount(histories, key);

                        return (
                            <button key={key} type="button" onClick={() => setActiveTab(key)} className={`rounded-full px-3 py-1.5 text-[9px] font-bold transition-all duration-200 ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className="space-y-3.5">
                {filteredHistories.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-10 text-center shadow-sm">
                        <p className="text-xs font-medium text-gray-500">Belum ada riwayat di kategori ini.</p>
                    </div>
                ) : (
                    filteredHistories.map((item) => {
                        const isSuccess = item.type === 'success';

                        return (
                            <article key={item.id} className={`group relative overflow-hidden rounded-2xl border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] ${isSuccess ? 'border-gray-100' : 'border-gray-100 hover:border-yellow-200'}`}>
                                {isSuccess ? (
                                    <div className="flex min-h-[72px] items-center gap-3.5 px-4 py-3.5">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <h4 className="truncate text-[11px] font-black leading-tight text-gray-900 sm:text-[12px]">{item.title}</h4>

                                                <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[7px] font-bold text-white sm:text-[8px]">
                                                    100% Tersalurkan
                                                </span>
                                            </div>

                                            <p className="mt-1 truncate text-[8px] font-medium leading-relaxed text-gray-500 sm:text-[9px]">{item.desc}</p>

                                            <span className="mt-1 block text-[7px] font-medium text-gray-400 sm:text-[8px]">{item.time}</span>
                                        </div>

                                        {item.actionType === 'link' && (
                                            <button type="button" className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[8px] font-bold text-yellow-600 transition-colors hover:text-yellow-700 sm:text-[9px]">
                                                Buka Berita Acara
                                                <ArrowRight className="h-2.5 w-2.5" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-[112px_minmax(0,1fr)_auto] items-center gap-3 p-3 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:gap-3.5 sm:p-4">
                                        <div className="relative h-[72px] w-[112px] overflow-hidden rounded-xl bg-gray-100 sm:h-[82px] sm:w-[140px]">
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                                            <span className="absolute left-1.5 top-1.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[7px] font-bold text-gray-800 shadow-sm backdrop-blur sm:text-[8px]">
                                                {item.amount || 'Item'}
                                            </span>
                                        </div>

                                        <div className="min-w-0 py-0.5">
                                            <div className="mb-1.5 flex min-w-0 items-center gap-1.5">
                                                <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[7px] font-bold sm:px-2 sm:text-[8px] ${STATUS_STYLES[item.type] || STATUS_STYLES.pending}`}>
                                                    {item.status}
                                                </span>

                                                <span className="flex min-w-0 items-center gap-1 truncate text-[7px] font-medium text-gray-400 sm:text-[8px]">
                                                    <Clock className="h-2.5 w-2.5 shrink-0" />
                                                    {item.time}
                                                </span>
                                            </div>

                                            <h4 className="truncate text-[11px] font-black leading-tight text-gray-900 sm:text-[13px]">{item.title}</h4>

                                            <p className="mt-1 truncate text-[8px] font-medium leading-relaxed text-gray-500 sm:text-[9px]">{item.desc}</p>

                                            <div className="mt-1.5 flex min-w-0 items-center gap-1.5 overflow-hidden">
                                                {item.location && (
                                                    <span className="inline-flex max-w-[52%] shrink-0 items-center gap-1 truncate rounded-md border border-gray-100 bg-gray-50 px-1.5 py-1 text-[7px] font-bold text-gray-600 sm:px-2 sm:text-[8px]">
                                                        <MapPin className="h-2.5 w-2.5 shrink-0 text-gray-400" />
                                                        <span className="truncate">{item.location}</span>
                                                    </span>
                                                )}

                                                {item.tags?.map((tag, index) => (
                                                    <span key={`${tag}-${index}`} className="inline-flex max-w-[45%] shrink-0 items-center gap-1 truncate rounded-md border border-yellow-100 bg-yellow-50 px-1.5 py-1 text-[7px] font-bold text-yellow-700 sm:px-2 sm:text-[8px]">
                                                        <span className="shrink-0 text-[6px]">●</span>
                                                        <span className="truncate">{tag}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center justify-end">
                                            {item.actionType === 'arrow' && (
                                                <button type="button" aria-label="Lihat donasi" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFBD00] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-yellow-400 hover:shadow-md sm:h-9 sm:w-9">
                                                    <ArrowRight className="h-3.5 w-3.5 text-gray-900 sm:h-4 sm:w-4" />
                                                </button>
                                            )}

                                            {item.actionType === 'button' && (
                                                <button type="button" className="whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[7px] font-bold text-gray-700 transition-colors hover:bg-gray-100 sm:px-3 sm:py-2 sm:text-[8px]">
                                                    Lihat Detail
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}