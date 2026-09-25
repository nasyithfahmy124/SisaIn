import React, { useState } from 'react';
import {
    Plus, Clock, ArrowRight, ShieldCheck, Truck, Lock,
    CheckCircle2, ChevronRight, Camera, BarChart2,
    Building2, Coins, MapPin, Calendar, Recycle, Droplet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { redistribusiData } from '../../data/redistribusiData';

export default function RedistribusiDesktop() {
    const { impact, materials, projects } = redistribusiData;
    const [activeTab, setActiveTab] = useState('Semua');

    return (
        <div className="max-w-[1500px] mx-auto py-8 px-8 bg-[#FAF9F7] min-h-screen">
            <div className="grid grid-cols-12 gap-8">

                {/* KOLOM KIRI (7/12) */}
                <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-8">

                    {/* Hero Banner */}
                    <div
                        className="relative overflow-hidden rounded-[18px] bg-[#FFFDF8] px-8 py-7 shadow-[0_8px_22px_rgba(0,0,0,0.14)]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 88% 8%, rgba(255,221,91,0.48) 0%, rgba(255,221,91,0.24) 21%, rgba(255,221,91,0) 28%), radial-gradient(circle at 58% 82%, rgba(191,239,214,0.42) 0%, rgba(191,239,214,0.20) 20%, rgba(191,239,214,0) 46%)`
                        }}
                    >
                        <div className="relative z-10 mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#FFDC68] px-3.5 py-[5px] text-[10px] font-extrabold uppercase tracking-[0.03em] text-[#171717]">
                            <Recycle className="h-[13px] w-[13px] stroke-[2.5]" />
                            <span>Sirkulasi Material Surplus</span>
                        </div>

                        <h1 className="relative z-10 mb-3 max-w-[750px] text-[30px] font-extrabold leading-[1.15] tracking-[-0.8px] text-[#202020] xl:text-[32px]">
                            Material sisa proyekmu bisa{" "}berguna kembali.
                        </h1>

                        <p className="relative z-10 mb-5 max-w-[700px] text-[14px] font-medium leading-[1.65] tracking-[-0.05px] text-[#625D51]">
                            Sisain menganalisis sisa material konstruksi Anda secara otomatis dan menghubungkannya langsung dengan kebutuhan fasilitas umum atau perbaikan infrastruktur warga yang terverifikasi.
                        </p>

                        <div className="relative z-10 mb-6 flex flex-wrap items-center gap-3">
                            <Link to="/redistribusi/material/new" className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-[12px] text-[14px] font-extrabold text-[#171717] shadow-[0_5px_12px_rgba(255,204,0,0.18)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#FFD21A] active:translate-y-0">
                                <Plus className="h-[17px] w-[17px] stroke-[2.5]" />
                                <span>Tambah Material</span>
                                <ArrowRight className="h-[17px] w-[17px] stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>

                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E4DB] bg-[#F7F7F5]/90 px-6 py-[12px] text-[14px] font-bold text-[#292929] transition-all duration-200 hover:bg-white hover:shadow-sm">
                                <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border-[2px] border-dotted border-[#008F69]">
                                    <span className="h-[3px] w-[3px] rounded-full bg-[#008F69]" />
                                </span>
                                <span>Lihat Aktivitas</span>
                            </button>
                        </div>

                        <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold text-[#28261F]">
                            <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck className="h-[17px] w-[17px] stroke-[2.5] text-[#007B59]" />
                                <span>Terkurasi AI 99.4%</span>
                            </span>

                            <span className="h-1 w-1 rounded-full bg-[#CFC7B4]" />

                            <span className="inline-flex items-center gap-1.5">
                                <Truck className="h-[17px] w-[17px] stroke-[2] text-[#806B00]" />
                                <span>Penjemputan Armada Gratis</span>
                            </span>

                            <span className="h-1 w-1 rounded-full bg-[#CFC7B4]" />

                            <span className="inline-flex items-center gap-1.5">
                                <Lock className="h-[16px] w-[16px] stroke-[2] text-[#007B59]" />
                                <span>100% Transparan</span>
                            </span>
                        </div>
                    </div>
                    {/* Material Saya Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-gray-900">Material Saya</h2>
                                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">3 Aktif</span>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
                                {['Semua', 'Siap Jemput', 'Dikurasi'].map((tab) => (
                                    <button
                                        key={tab} onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${activeTab === tab ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {materials.map((mat) => (
                                mat.isFeatured ? (
                                    /* Featured Material Card */
                                    <div key={mat.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-6 items-center">
                                        <div className="w-[180px] h-[140px] shrink-0 rounded-2xl overflow-hidden relative">
                                            <img src={mat.image} alt={mat.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> {mat.statusBadge}
                                            </div>
                                        </div>
                                        <div className="flex-1 py-1 pr-2">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-black text-gray-400 tracking-wider">{mat.category}</span>
                                                <span className="text-xs font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{mat.amount}</span>
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900 mb-2">{mat.title}</h3>
                                            <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 mb-4">
                                                <ArrowRight className="w-3.5 h-3.5" /> {mat.matchText}
                                            </p>

                                            <div className="mb-3">
                                                <div className="flex justify-between text-[10px] font-bold mb-1.5">
                                                    <span className="text-gray-600">{mat.progressText}</span>
                                                    <span className="text-emerald-600">{mat.progressValue}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${mat.progressValue}%` }}></div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" /> {mat.schedule}
                                                </span>
                                                <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors">
                                                    Detail <ChevronRight className="w-3.5 h-3.5 inline" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Small Material Card */
                                    <div key={mat.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:border-yellow-200 hover:shadow-md cursor-pointer">
                                        <img src={mat.image} alt={mat.title} className="w-16 h-16 rounded-xl object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {mat.aiVerified && <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Terverifikasi AI</span>}
                                                {mat.kurasiTag && <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-1.5 py-0.5 rounded">{mat.kurasiTag}</span>}
                                                <span className="text-[10px] font-semibold text-gray-400">{mat.category}</span>
                                            </div>
                                            <h4 className="text-sm font-black text-gray-900 truncate mb-0.5">{mat.title}</h4>
                                            <p className="text-[10px] text-gray-500 truncate">{mat.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-4 pr-2 shrink-0">
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${mat.statusColor}`}>
                                                <Truck className="w-3.5 h-3.5" /> {mat.status}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Banner Kamera Scan */}
                    <div className="bg-[#FFF8DF] border border-yellow-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#FFCC00] rounded-full flex items-center justify-center shrink-0">
                                <Camera className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-gray-900 mb-0.5">Punya sisa renovasi di sudut rumah?</h3>
                                <p className="text-[11px] font-medium text-gray-700 max-w-sm leading-relaxed">
                                    Cukup potret tumpukan semen, sisa ubin, atau kayu. AI Sisain akan menghitung volume & kualitas secara otomatis.
                                </p>
                            </div>
                        </div>
                        <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-5 py-3 rounded-full flex items-center gap-2 transition-colors shrink-0 shadow-md">
                            <span className="border border-white/40 p-1 rounded-md"><Droplet className="w-3.5 h-3.5" /></span> Buka Kamera Scan
                        </button>
                    </div>

                </div>

                {/* KOLOM KANAN (5/12) */}
                <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">

                    {/* Impact Card */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-gray-900 flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-yellow-500" /> Dampak Sirkular Anda
                            </h3>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-1 rounded-full">{impact.period}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-3">
                            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                                <div>
                                    <h4 className="text-3xl font-black text-gray-900">{impact.totalWeight} <span className="text-sm text-gray-600">Kg+</span></h4>
                                    <p className="text-[10px] font-medium text-gray-500 mt-1">Material Tersirkulasi</p>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1.5 rounded-full">{impact.co2Reduced} Tereduksi</span>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                                <div>
                                    <h4 className="text-3xl font-black text-gray-900">{impact.facilitiesHelped} <span className="text-sm text-gray-600">Fasum</span></h4>
                                    <p className="text-[10px] font-medium text-gray-500 mt-1">Fasilitas Terbantu</p>
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 text-right whitespace-pre-line leading-tight">
                                    {impact.facilityTypes}
                                </p>
                            </div>

                            <div className="bg-[#FFF8DF] rounded-2xl p-4 flex justify-between items-center border border-yellow-200">
                                <div>
                                    <h4 className="text-3xl font-black text-yellow-900 flex items-center gap-1.5">
                                        <Coins className="w-5 h-5 text-yellow-600" /> {impact.coins}
                                    </h4>
                                    <p className="text-[10px] font-medium text-yellow-700 mt-1">Koin Sisain (Non-Tunai)</p>
                                </div>
                                <span className="bg-gray-900 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> Hak Suara Aktif
                                </span>
                            </div>
                        </div>

                        <button className="w-full text-left pt-3 text-[11px] font-bold text-gray-700 hover:text-gray-900 flex items-center justify-between group">
                            Tukar & Salurkan Hak Suara Komunitas <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Proyek yang Saya Bantu */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-gray-900">Proyek yang Saya Bantu</h3>
                            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Live Update
                            </span>
                        </div>

                        <div className="space-y-4">
                            {projects.map((proj) => (
                                proj.isFeatured ? (
                                    <div key={proj.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                                        <div className="h-32 relative">
                                            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                            <div className="absolute top-3 left-3 bg-red-100 text-red-700 text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                                                <Building2 className="w-3 h-3" /> {proj.badge}
                                            </div>
                                            <div className="absolute bottom-3 left-3 text-white">
                                                <p className="text-[9px] font-bold opacity-80 mb-0.5">{proj.location}</p>
                                                <h4 className="text-sm font-black">{proj.title}</h4>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-[10px] font-medium text-gray-600 leading-relaxed mb-4">
                                                {proj.desc}
                                            </p>

                                            <div className="mb-4">
                                                <div className="flex justify-between text-[9px] font-black mb-1.5">
                                                    <span className="text-gray-500">Material Terkumpul</span>
                                                    <span className="text-gray-900">{proj.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div className="bg-[#FFCC00] h-1.5 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2 text-[10px] font-bold text-gray-700 border border-gray-100">
                                                    <Recycle className="w-4 h-4 text-emerald-600" /> {proj.contribution}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 px-1">
                                                    <Calendar className="w-3.5 h-3.5 text-yellow-600" /> {proj.schedule}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={proj.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-1 rounded-lg">{proj.location}</span>
                                            <span className="text-[10px] font-bold text-emerald-600">Progres {proj.progress}%</span>
                                        </div>
                                        <h4 className="text-xs font-black text-gray-900 mb-1 mt-2">{proj.title}</h4>
                                        <p className="text-[10px] text-gray-500 mb-3">{proj.desc}</p>
                                        <button className="text-[10px] font-bold text-yellow-700 hover:text-yellow-800 flex items-center gap-1 group">
                                            Lihat Kebutuhan Fasum <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA Right */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-6">
                        <div className="flex gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                                <Recycle className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-gray-900 mb-1">Ada sisa keramik, kayu, atau cat?</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed">Jangan buang ke TPA. Setiap kilogram sisa material Anda bernilai tinggi bagi renovasi fasilitas warga.</p>
                            </div>
                        </div>
                        <Link to="/redistribusi/material/new" className="w-full bg-[#FFCC00] text-gray-900 text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors shadow-sm">
                            <Camera className="w-4 h-4" /> Scan Foto Sisa Material
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}