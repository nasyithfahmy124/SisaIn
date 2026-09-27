import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Truck, CheckCircle2, Circle, Check, Package, ShieldCheck, Clock, ArrowRight, MapPin } from 'lucide-react';

const CHECKLIST_ITEMS = [
    {
        id: 'kondisi',
        title: 'Kondisi Kering & Terlindung Cuaca',
        desc: 'Semen portland tertutup rapi & terlindung dari basah/hujan.'
    },
    {
        id: 'akses',
        title: 'Aksesibilitas Jalur Armada Siap',
        desc: 'Akses jalan masuk siap & dapat dilalui kurir roda tiga SISAIN.'
    },
    {
        id: 'pic',
        title: 'Keberadaan PIC di Lokasi',
        desc: 'Donatur / PIC aktif dan dapat dihubungi saat kurir tiba.'
    }
];

export default function KonfirmasiPengirimanMobile({ onBack, onNext }) {
    const navigate = useNavigate();
    const [metode, setMetode] = useState('dijemput');
    const [checklist, setChecklist] = useState({
        kondisi: true,
        akses: true,
        pic: true
    });

    const toggleChecklist = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isAllChecked = checklist.kondisi && checklist.akses && checklist.pic;

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    const handleConfirm = () => {
        if (onNext) onNext({ metode, checklist });
        else {
            alert('Pengiriman berhasil dikonfirmasi! Kurir SISAIN akan segera menjemput.');
            navigate('/redistribusi');
        }
    };

    return (
        <div className="bg-[#FAF9F7] min-h-screen pb-32 font-sans text-gray-900">
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <button onClick={handleBack} className="flex items-center gap-1 text-sm font-bold text-gray-800 hover:text-gray-900">
                    <ChevronLeft className="w-5 h-5" /> Kembali
                </button>
                <h2 className="text-xs font-black text-gray-900">Konfirmasi Pickup / Kirim</h2>
                <div className="w-6"></div>
            </div>

            <div className="px-4 pt-4 space-y-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Konfirmasi Logistik</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2.5 py-1 rounded-full">Siap Salurkan</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="h-1.5 bg-[#FFCC00] rounded-full"></div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-4 relative overflow-hidden">
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start gap-3 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">📍</div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Dari (Lokasi Material)</p>
                            <h4 className="text-xs font-black text-gray-900">Jl. Pandanaran No. 42</h4>
                            <p className="text-[10px] text-gray-500">Kec. Semarang Tengah • Titik Penjemputan</p>
                            <span className="inline-block mt-1 bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-md">
                                ⇄ 0.7 km • ±4 mnt perjalanan
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-[#FFCC00] text-gray-950 flex items-center justify-center text-[10px] font-bold shrink-0">🎯</div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Ke (Tujuan Proyek)</p>
                            <h4 className="text-xs font-black text-gray-900">Perbaikan Jalan Gang RT 03</h4>
                            <p className="text-[10px] text-gray-500">Kel. Candisari • Dikelola Komunitas Warga</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-gray-900">Semen Portland PCC</span>
                            <span className="bg-white px-2 py-0.5 rounded-lg text-[10px] font-black border border-gray-200">±160 kg (4 Sak)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="bg-white rounded-xl p-2 border border-gray-100">
                                <p className="text-[9px] text-gray-400 font-bold">Target Proyek:</p>
                                <p className="text-[11px] font-black text-gray-900">120 kg (3 Sak)</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                                <p className="text-[9px] text-emerald-700 font-bold">Buffer Cadangan:</p>
                                <p className="text-[11px] font-black text-emerald-900">40 kg (Fasum Sekitar)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-black text-gray-900">Metode Penyaluran</h3>
                        <span className="text-[10px] font-bold text-gray-400">Pilih 1 opsi</span>
                    </div>

                    <div className="space-y-3">
                        <div 
                            onClick={() => setMetode('dijemput')}
                            className={`rounded-3xl p-4 border-2 transition-all cursor-pointer ${
                                metode === 'dijemput' 
                                ? 'bg-[#FFFDF5] border-[#FFCC00] shadow-sm' 
                                : 'bg-white border-gray-100'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span onClick={() => setMetode('dijemput')} className="cursor-pointer">
                                        {metode === 'dijemput' ? <Check className="w-4 h-4 text-yellow-700 stroke-[3]" /> : <Circle className="w-4 h-4 text-gray-300" />}
                                    </span>
                                    <span className="text-xs font-black text-gray-900">Dijemput</span>
                                    <span className="bg-yellow-200 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full">REKOMENDASI</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-600 mb-3 pl-6">SISAIN & mitra penjemputan mengambil material langsung dari lokasi kamu.</p>

                            <div className="bg-white rounded-2xl p-3 space-y-1.5 border border-gray-100 text-[10px] font-medium text-gray-700 ml-6">
                                <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-yellow-600"/> <span className="font-bold">Estimasi Pickup:</span> Hari Ini, 14:00 – 16:00 WIB</p>
                                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400"/> <span className="font-bold">Alamat Pickup:</span> Jl. Pandanaran No. 42</p>
                                <p className="flex items-center gap-2">📞 <span className="font-bold">Kontak PIC:</span> Budi Santoso (0812-3456-7890)</p>
                                <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-yellow-600"/> <span className="font-bold">Armada:</span> Motor Roda Tiga SISAIN • Mas Heru</p>
                                <div className="pt-2 flex items-center justify-between border-t border-gray-100 mt-2">
                                    <span className="text-[9px] text-gray-400 font-bold">Status Logistik</span>
                                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span> Siap Dijadwalakn
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div 
                            onClick={() => setMetode('kirim_sendiri')}
                            className={`rounded-3xl p-4 border-2 transition-all cursor-pointer ${
                                metode === 'kirim_sendiri' 
                                ? 'bg-[#FFFDF5] border-[#FFCC00] shadow-sm' 
                                : 'bg-white border-gray-100'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span onClick={() => setMetode('kirim_sendiri')} className="cursor-pointer">
                                    {metode === 'kirim_sendiri' ? <Check className="w-4 h-4 text-yellow-700 stroke-[3]" /> : <Circle className="w-4 h-4 text-gray-300" />}
                                </span>
                                <span className="text-xs font-black text-gray-900">Kirim Sendiri</span>
                                <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-full">Mandiri</span>
                            </div>
                            <p className="text-[10px] text-gray-600 pl-6">Kamu mengantarkan material secara swadaya ke titik lokasi tujuan proyek.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-xs font-black text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pastikan material siap diserahkan
                    </h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Sebelum menyetujui, pastikan tiga kondisi lapangan berikut terpenuhi:</p>

                    <div className="space-y-3">
                        {CHECKLIST_ITEMS.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => toggleChecklist(item.id)}
                                role="checkbox"
                                aria-checked={checklist[item.id]}
                                tabIndex={0}
                                className="bg-gray-50 rounded-xl p-3 flex gap-3 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100"
                            >
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checklist[item.id] ? 'bg-[#FFCC00]' : 'bg-white border-2 border-gray-300'}`}>
                                    {checklist[item.id] && <Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3}/>}
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-900 mb-0.5">{item.title}</h4>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#E6F4EA] rounded-xl p-3 flex items-start gap-2.5 border border-emerald-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[10px] font-black text-emerald-900 mb-0.5">Jaminan Logistik Sirkular SISAIN</h4>
                            <p className="text-[9px] text-emerald-800 leading-relaxed font-medium">
                                Pengangkutan dilindungi asuransi keselamatan material konstruksi surplus dan tercatat dalam audit transparansi emisi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={handleConfirm}
                    disabled={!isAllChecked}
                    className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-black transition-all shadow-md active:scale-95 mb-2 ${
                        isAllChecked ? 'bg-[#FFCC00] hover:bg-yellow-400 text-gray-950' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <span>Konfirmasi Pengiriman</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                    onClick={handleBack}
                    className="w-full text-center text-[10px] font-bold text-gray-500 hover:text-gray-800 py-1"
                >
                    Kembali ke Detail Kebutuhan
                </button>
            </div>
        </div>
    );
}