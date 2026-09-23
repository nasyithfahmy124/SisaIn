import React from 'react';
import {
    Shield,
    Box,
    Building2,
    ArrowRight,
    Coins,
    MoreHorizontal,
    Download,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileHistory from './ProfileHistory';
import { dummyHistories } from './histori';

export default function ProfileDesktop({
    user = {
        level: 'Level 2',
        message:
            'Terima kasih telah menyalurkan material sisa renovasi untuk perbaikan fasilitas warga sekitar Semarang dan sekitarnya.'
    },
    stats = {
        savedTotal: '185',
        savedUnit: 'Kg+',
        projectCount: 3
    },
    impact = {
        coins: 320,
        popularProject: {
            title: 'Perbaikan Jalan Gang RT 03/RW 05 Pleburan',
            desc: 'Kebutuhan : Semen & pasir jalan, disalurkan lg...',
            progress: 75
        }
    },
    histories = dummyHistories
}) {
    return (
        <div className="mx-auto max-w-[1200px] px-6 py-8">
            <div className="relative mb-10 flex items-center justify-between overflow-hidden rounded-[32px] bg-[#FFBD00] p-8 shadow-sm">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-yellow-400 to-transparent opacity-50" />

                <div className="relative z-10 max-w-[60%]">
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur">
                        <Shield className="h-3.5 w-3.5 text-yellow-600" />
                        <span className="text-[10px] font-bold tracking-wide text-gray-800">
                            PROFIL DONATUR
                        </span>
                    </div>

                    <h1 className="mb-3 text-4xl font-black tracking-tight text-gray-950">
                        Kontribusi Kebaikan Anda
                    </h1>

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400">
                            <span className="text-[10px] text-gray-900">P</span>
                        </span>
                        {user.level}
                    </div>

                    <p className="max-w-lg text-sm font-medium leading-relaxed text-gray-900/80">
                        {user.message}
                    </p>
                </div>

                <div className="relative z-10 flex gap-4">
                    <div className="relative w-[180px] rounded-3xl bg-white p-5 shadow-sm transition-transform hover:-translate-y-1">
                        <div className="absolute -right-0 top-[-12px] rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            ↑ Top 4% Kota
                        </div>

                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-yellow-100 bg-yellow-50">
                            <Box className="h-5 w-5 text-yellow-600" />
                        </div>

                        <h2 className="mb-1 text-2xl font-black text-gray-900">
                            {stats.savedTotal}{' '}
                            <span className="text-lg">{stats.savedUnit}</span>
                        </h2>

                        <p className="text-[11px] font-semibold leading-tight text-gray-500">
                            Material diselamatkan
                        </p>
                    </div>

                    <div className="relative w-[180px] rounded-3xl bg-white p-5 shadow-sm transition-transform hover:-translate-y-1">
                        <div className="absolute -right-0 top-[-12px] rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                            ♥ 3 Bantuan
                        </div>

                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                            <Building2 className="h-5 w-5 text-gray-600" />
                        </div>

                        <h2 className="mb-1 text-2xl font-black text-gray-900">
                            {stats.projectCount} Proyek
                        </h2>

                        <p className="text-[11px] font-semibold leading-tight text-gray-500">
                            Fasum & jalan yang terbantu
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                    <ProfileHistory histories={histories} />
                </div>

                <div className="col-span-4 space-y-6">
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
                                    <Coins className="h-3.5 w-3.5 text-gray-900" />
                                </span>
                                Koin Dampak
                            </h3>

                            <button
                                type="button"
                                className="rounded-lg bg-gray-50 p-1.5 text-gray-400 transition-colors hover:text-gray-600"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="text-4xl font-black leading-none tracking-tight text-gray-900">
                                    {impact.coins}{' '}
                                    <span className="text-sm font-semibold text-gray-500">
                                        Koin
                                    </span>
                                </h2>

                                <p className="mt-2 text-[10px] font-semibold text-gray-400">
                                    +45 koin dari donasi minggu ini
                                </p>
                            </div>

                            <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                                Siap Ditukar!
                            </span>
                        </div>

                        <div className="relative mb-6 overflow-hidden rounded-2xl border border-yellow-200/60 bg-[#FFF9E5] p-4">
                            <div className="absolute -bottom-4 -right-4 opacity-10">
                                <Shield className="h-20 w-20 text-yellow-600" />
                            </div>

                            <h4 className="mb-1 flex items-center gap-1.5 text-xs font-bold text-yellow-800">
                                <Shield className="h-3.5 w-3.5" />
                                Naik Ruang Sirkuler
                            </h4>

                            <p className="text-[10px] font-medium leading-relaxed text-yellow-700/80">
                                Setiap donasi material memberikan Anda suara untuk
                                memprioritaskan alokasi surplus konstruksi ke fasum warga
                                sekitar Semarang.
                            </p>
                        </div>

                        <div className="mb-5 border-t border-gray-100 pt-5">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    USULAN TERPOPULER
                                </span>

                                <span className="text-[10px] font-bold text-emerald-600">
                                    75% Terpenuhi
                                </span>
                            </div>

                            <h4 className="mb-1 text-xs font-black text-gray-900">
                                {impact.popularProject.title}
                            </h4>

                            <p className="mb-3 text-[10px] font-medium text-gray-500">
                                {impact.popularProject.desc}
                            </p>

                            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-2 rounded-full bg-[#FFBD00] transition-all duration-1000"
                                    style={{
                                        width: `${impact.popularProject.progress}%`
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-[11px] font-bold text-gray-800 transition-colors hover:bg-gray-100"
                            >
                                Salurkan Koin untuk Vote
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="flex cursor-pointer items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-3 transition-colors hover:bg-emerald-100/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                                    <Download className="h-4 w-4 text-emerald-600" />
                                </div>

                                <div>
                                    <h5 className="text-[11px] font-bold text-emerald-900">
                                        Sertifikat Jejak Karbon
                                    </h5>

                                    <p className="text-[9px] font-semibold text-emerald-600">
                                        S/T-2026 • Telah diterbitkan
                                    </p>
                                </div>
                            </div>

                            <MoreHorizontal className="h-4 w-4 text-emerald-600" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div>
                            <h4 className="mb-0.5 text-sm font-black text-gray-900">
                                Ada Sisa Material?
                            </h4>

                            <p className="text-[11px] font-medium leading-tight text-gray-500">
                                Salurkan gratis, tim
                                <br />
                                kurir siap menjemput.
                            </p>
                        </div>

                        <Link
                            to="/redistribusi/material/new"
                            className="flex items-center gap-1 rounded-xl bg-[#FFBD00] px-4 py-2.5 text-[11px] font-bold text-gray-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-yellow-400"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Donasi Baru
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
