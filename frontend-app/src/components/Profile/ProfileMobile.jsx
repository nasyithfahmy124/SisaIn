import React, { useState, useMemo } from 'react';
import { 
    Shield, MapPin, CheckCircle2, ArrowRight, 
    Recycle, Building2, Coins, Download, Plus, 
    ExternalLink, Check, Award, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://sisa-in.vercel.app';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
};

export default function ProfileMobile({
    profile,
    donations = [],
    claims = [],
    donationTotal = 0,
    claimTotal = 0
}) {
    const [activeTab, setActiveTab] = useState('semua');

    const userName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || profile?.email || 'Pengguna';
    const userLocation = profile?.alamat || 'Lokasi belum diatur';
    const userAvatar = getImageUrl(profile?.image);
    const userLevel = 'Level 2: Mitra Berdaya';

    const totalWeight = donations.reduce((sum, item) => sum + (Number(item.bobot) || 0), 0);
    const savedTotal = totalWeight > 0 ? totalWeight : donationTotal;
    const savedUnit = totalWeight > 0 ? 'Kg+' : 'Item';

    const impact = {
        coins: 320,
        weeklyBonus: 45,
        popularProject: {
            title: "Perbaikan Jalan Gang RT 03/RW 05 Pleburan",
            desc: "Kebutuhan: Semen & Paving block sisa proyek",
            progress: 78
        }
    };

    const histories = useMemo(() => {
        const donationHistories = donations.map(item => ({
            id: `donasi-${item.id}`,
            type: item.tersedia ? 'active' : 'success',
            title: item.nama_material,
            amount: item.bobot ? `${item.bobot} kg` : '1 Item',
            aiTag: item.kategori,
            status: item.tersedia ? 'Tersedia untuk diklaim' : 'Telah disalurkan',
            image: getImageUrl(item.image),
            statusColor: item.tersedia ? "text-yellow-700" : "text-emerald-700",
            timestamp: new Date(item.created).getTime(),
            bapLink: '#'
        }));

        const claimHistories = claims.map(item => ({
            id: `klaim-${item.id}`,
            type: 'success',
            title: `Diklaim: ${item.nama_penerima}`,
            desc: item.alamat_penerima,
            amount: 'Terklaim',
            image: getImageUrl(item.image),
            timestamp: new Date(item.tanggal_klaim).getTime(),
            bapLink: '#'
        }));

        return [...donationHistories, ...claimHistories].sort((a, b) => b.timestamp - a.timestamp);
    }, [donations, claims]);

    const filteredHistories = histories.filter((item) => {
        if (activeTab === 'semua') return true;
        if (activeTab === 'berjalan') return item.type === 'active' || item.type === 'pending';
        if (activeTab === 'selesai') return item.type === 'success';
        return true;
    });

    const countTab = (tab) => {
        if (tab === 'semua') return histories.length;
        if (tab === 'berjalan') return histories.filter(i => i.type === 'active' || i.type === 'pending').length;
        if (tab === 'selesai') return histories.filter(i => i.type === 'success').length;
    };

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-24 font-sans">
            <div className="bg-[#FFCC00] rounded-b-[40px] px-5 pt-6 pb-8 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                    <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                        <Shield className="w-3.5 h-3.5 text-yellow-600" />
                        <span className="text-[10px] font-black text-gray-800 tracking-wide">PROFIL DONATUR</span>
                    </div>
                    <div className="bg-gray-900 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-[10px] font-bold text-white tracking-wide">{userLevel}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="relative shrink-0">
                        {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-14 h-14 rounded-full border-2 border-white object-cover bg-gray-200" />
                        ) : (
                            <div className="w-14 h-14 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-[#FFCC00]">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl font-black text-gray-900 flex items-center gap-1.5 truncate">
                            {userName} <Award className="w-4 h-4 text-gray-800 shrink-0" fill="currentColor" />
                        </h1>
                        <p className="text-xs font-medium text-gray-700 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{userLocation}</span>
                        </p>
                    </div>
                </div>

                <h2 className="text-lg font-black text-gray-900 mb-1.5">Kontribusi Kebaikan Anda</h2>
                <p className="text-xs font-medium text-gray-800/80 leading-relaxed mb-6">
                    Terima kasih telah menyalurkan sisa material konstruksi untuk renovasi fasilitas warga sekitar.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-3.5 shadow-sm relative">
                        <div className="flex justify-between items-start mb-2">
                            <Recycle className="w-5 h-5 text-yellow-700" />
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-1 rounded-full">
                                Top 4%
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">{savedTotal} <span className="text-lg">{savedUnit}</span></h3>
                        <p className="text-[9px] font-medium text-gray-500 mt-0.5">Material Sisa Tersalurkan</p>
                    </div>

                    <div className="bg-white rounded-2xl p-3.5 shadow-sm relative">
                        <div className="flex justify-between items-start mb-2">
                            <Building2 className="w-5 h-5 text-red-400" />
                            <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-1 rounded-full">
                                Kota Anda
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">{claimTotal} Proyek</h3>
                        <p className="text-[9px] font-medium text-gray-500 mt-0.5">Fasum & Jalan Warga</p>
                    </div>
                </div>
            </div>

            <div className="px-5 mt-6 space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-[17px] font-black text-gray-900">Riwayat & Donasi Aktif</h3>
                        <span className="text-[10px] font-semibold text-gray-500">Update terkini</span>
                    </div>

                    <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
                        {['semua', 'berjalan', 'selesai'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold capitalize transition-colors ${
                                    activeTab === tab 
                                    ? 'bg-gray-900 text-white shadow-sm' 
                                    : 'bg-gray-200/70 text-gray-600'
                                }`}
                            >
                                {tab} ({countTab(tab)})
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {filteredHistories.length === 0 ? (
                            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                                <p className="text-xs font-medium text-gray-500">Belum ada riwayat di kategori ini.</p>
                            </div>
                        ) : (
                            filteredHistories.map((item) => (
                                item.type === 'success' ? (
                                    <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-black text-gray-900 truncate">{item.title}</h4>
                                                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5 truncate">{item.desc || '100% Selesai'}</p>
                                            </div>
                                        </div>
                                        <Link to={item.bapLink} className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200 shrink-0 ml-2">
                                            BAP <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3 items-center">
                                        <div className="w-[72px] h-[72px] rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                                            <img src={item.image || '/default-image.jpg'} alt={item.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-1 left-1 bg-gray-900/80 backdrop-blur text-white px-1.5 py-0.5 rounded text-[8px] font-bold">
                                                {item.amount}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 py-0.5">
                                            <span className="inline-block bg-gray-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">
                                                {item.aiTag}
                                            </span>
                                            <h4 className="text-xs font-black text-gray-900 truncate mb-1">{item.title}</h4>
                                            <p className={`text-[10px] font-bold truncate ${item.statusColor}`}>
                                                ● {item.status}
                                            </p>
                                        </div>

                                        <button className="w-9 h-9 rounded-full bg-[#FFCC00] flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95">
                                            <ArrowRight className="w-4 h-4 text-gray-900" />
                                        </button>
                                    </div>
                                )
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 bg-[#FFCC00] rounded-full flex items-center justify-center shrink-0 border-2 border-yellow-200">
                                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-[#FFCC00] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-black text-gray-900">{impact.coins} Koin Dampak</h3>
                                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">+{impact.weeklyBonus} Koin dari donasi minggu ini</p>
                            </div>
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-1.5 rounded-lg whitespace-nowrap">
                            Saldo Aktif
                        </span>
                    </div>

                    <div className="bg-[#FFF9E5] rounded-xl p-3.5 mb-4 border border-yellow-100">
                        <h4 className="text-[11px] font-bold text-yellow-900 flex items-center gap-1.5 mb-1">
                            <Shield className="w-3.5 h-3.5" /> Hak Suara Sirkular Warga
                        </h4>
                        <p className="text-[10px] text-yellow-800/80 font-medium leading-relaxed">
                            Gunakan koin Anda untuk memprioritaskan alokasi sisa material bagi perbaikan fasilitas lingkungan Semarang.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Sedang Berjalan</span>
                            <span className="text-[9px] font-bold text-gray-500">{impact.popularProject.progress}% Terpenuhi</span>
                        </div>
                        <h4 className="text-xs font-black text-gray-900 mb-1 truncate">{impact.popularProject.title}</h4>
                        <p className="text-[10px] text-gray-500 mb-3 truncate">{impact.popularProject.desc}</p>
                        
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${impact.popularProject.progress}%` }}></div>
                        </div>
                    </div>

                    <button className="w-full bg-[#FFCC00] text-gray-900 text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:bg-yellow-500 transition-colors">
                        Gunakan Koin untuk Vote <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-[#F0FDF4] rounded-2xl p-4 flex items-center justify-between border border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-900">Sertifikat Jejak Karbon Q4 2026</h4>
                            <p className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Terverifikasi Badan Sertifikasi
                            </p>
                        </div>
                    </div>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                        <Download className="w-4 h-4 text-gray-700" />
                    </button>
                </div>

                <div className="bg-[#FFCC00] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-[9px] font-bold text-yellow-900 uppercase tracking-wider mb-0.5">Aksi Cepat</p>
                        <h3 className="text-sm font-black text-gray-900">Punya sisa renovasi?</h3>
                    </div>
                    <Link to="/redistribusi/material/new" className="bg-gray-900 text-white text-[11px] font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shrink-0">
                        <Plus className="w-3.5 h-3.5" /> Donasi Baru
                    </Link>
                </div>
            </div>
        </div>
    );
}