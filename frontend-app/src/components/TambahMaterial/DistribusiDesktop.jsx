import React, { useState } from 'react';
import { 
    ArrowLeft, Check, HeartHandshake, Handshake, 
    Network, Navigation, MapPin, Truck, Leaf, 
    QrCode, Info, CheckCircle2, Zap, Circle
} from 'lucide-react';

export default function DistribusiDesktop({ imagePayload, finalData, onBack, onNext }) {
    // State untuk jalur yang dipilih. Default 'donasi' sesuai desain
    const [jalur, setJalur] = useState('donasi');

    // Helper data dari Langkah 3 (fallback jika data kosong agar tetap aman saat render)
    const jenisMaterial = finalData?.jenis || 'Semen Portland PCC';
    const kuantitas = finalData?.jumlah ? `${finalData.jumlah} Sak` : '4 Sak';
    const bobot = finalData?.jumlah ? `±${finalData.jumlah * 40} kg` : '±160 kg';
    const kondisi = finalData?.kondisi ? `Grade A ${finalData.kondisi.replace('Grade A', '').trim()}` : 'Grade A Kering & Utuh';
    
    // Ekstrak nama kecamatan dari lokasi panjang
    const lokasiSplit = finalData?.lokasi?.split(',') || ['Kec. Candisari', 'Semarang'];
    const lokasiSingkat = lokasiSplit.length > 1 ? `${lokasiSplit[lokasiSplit.length-2].trim()}, Sem.` : 'Kec. Candisari, Sem.';

    return (
        <div className="min-h-screen bg-[#FCF9F8] font-sans pb-24">
            
            {/* Top Navigation Bar */}
            <div className="bg-[#FCF9F8] border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 z-40">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold">Kembali ke Konfirmasi</span>
                </button>
                <div className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                    <span className="text-emerald-600">Langkah 4 dari 4</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Penentuan Jalur Distribusi</span>
                </div>
            </div>

            <div className="max-w-[900px] mx-auto px-6 mt-8">
                
                {/* Stepper (Sesuai Desain: 01, 02, 03 gray, 04 yellow) */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="flex items-center gap-1.5 text-gray-400 px-3 py-1.5 rounded-full border border-gray-200 bg-white">
                        <span className="text-[9px] font-black">01</span>
                        <span className="text-[10px] font-bold">Foto Material</span>
                    </div>
                    <div className="w-4 h-[1px] bg-gray-300"></div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <span className="text-[9px] font-black">02</span>
                        <span className="text-[10px] font-bold">Analisis AI</span>
                    </div>
                    <div className="w-4 h-[1px] bg-gray-300"></div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <span className="text-[9px] font-black">03</span>
                        <span className="text-[10px] font-bold">Konfirmasi</span>
                    </div>
                    <div className="w-4 h-[1px] bg-gray-300"></div>
                    <div className="flex items-center gap-1.5 bg-[#FFCC00] px-3.5 py-1.5 rounded-full shadow-sm">
                        <span className="text-[9px] font-black text-gray-900">04</span>
                        <span className="text-[10px] font-bold text-gray-900">Distribusi</span>
                    </div>
                </div>

                {/* Material Terkonfirmasi Card */}
                <div className="bg-white rounded-[20px] p-4 flex justify-between items-center shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                            <img src={imagePayload?.url || "https://images.unsplash.com/photo-1503387762-592deb58ef4e"} alt="Material" className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm border border-emerald-500">PCC</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-black text-gray-900">{jenisMaterial}</h3>
                                <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-md">{kuantitas} • {bobot}</span>
                            </div>
                            <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {kondisi}
                                <span className="text-gray-300">•</span>
                                <MapPin className="w-3 h-3" /> {lokasiSingkat}
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#F0FDF4] border border-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Terkonfirmasi Siap Disalurkan
                    </div>
                </div>

                {/* Section Title */}
                <div className="mb-6">
                    <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-widest mb-2">Penentuan Jalur Distribusi</p>
                    <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Material ini ingin disalurkan ke mana?</h2>
                    <p className="text-xs font-medium text-gray-500 max-w-xl">Pilih tujuan agar SISAIN dapat mengarahkan material ke proyek sosial terverifikasi atau warga terdekat secara presisi.</p>
                </div>

                {/* Pilihan Jalur Distribusi Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    {/* Opsi 1: Donasi Proyek (Rekomendasi Utama) */}
                    <div 
                        onClick={() => setJalur('donasi')}
                        className={`cursor-pointer rounded-[24px] p-6 transition-all duration-300 ${
                            jalur === 'donasi' 
                            ? 'bg-[#FFFDF5] border-2 border-[#FFCC00] shadow-[0_8px_30px_rgba(255,204,0,0.12)]' 
                            : 'bg-white border-2 border-transparent shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center shadow-sm">
                                <HeartHandshake className="w-6 h-6 text-gray-900" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-[#FFCC00]/20 text-yellow-800 text-[9px] font-black px-2.5 py-1 rounded-md">REKOMENDASI UTAMA</span>
                                {jalur === 'donasi' ? (
                                    <div className="w-6 h-6 bg-[#FFCC00] rounded-full flex items-center justify-center shadow-sm"><Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3}/></div>
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-[17px] font-black text-gray-900">Donasi Proyek</h3>
                            <span className="bg-[#E6F4EA] text-[#137333] text-[9px] font-bold px-2 py-0.5 rounded-md">Berdampak Tinggi</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed mb-5">
                            Salurkan material ke proyek sosial, sarana ibadah, atau infrastruktur pemukiman rakyat yang telah diverifikasi kelayakannya oleh tim SISAIN.
                        </p>

                        <div className="bg-gray-100/80 rounded-xl p-3 flex items-center gap-2 mb-5">
                            <Network className="w-4 h-4 text-gray-600 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-800">Matching berdasarkan kebutuhan spesifik proyek</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed text-gray-700"><strong className="text-gray-900">Prioritas fasilitas umum:</strong> Akses jalan lingkungan, posyandu, balai RT, dan renovasi sarana ibadah.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed text-gray-700"><strong className="text-gray-900">Penjemputan armada resmi:</strong> Diangkut langsung oleh kurir logistik SISAIN tanpa batasan radius ketat.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed text-gray-700"><strong className="text-gray-900">Dampak terdata transparan:</strong> Peroleh Sertifikat Pengurangan Emisi CO2e & 160 Koin Sirkular.</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-yellow-200/50">
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500"><Zap className="w-3.5 h-3.5 text-yellow-500"/> Estimasi kurasi sistem: &lt; 5 detik</span>
                            <span className={`text-[10px] font-bold ${jalur === 'donasi' ? 'text-yellow-700' : 'text-gray-400'}`}>{jalur === 'donasi' ? 'Pilihan Aktif' : 'Pilih Opsi Ini'}</span>
                        </div>
                    </div>

                    {/* Opsi 2: Klaim P2P Lokal */}
                    <div 
                        onClick={() => setJalur('p2p')}
                        className={`cursor-pointer rounded-[24px] p-6 transition-all duration-300 ${
                            jalur === 'p2p' 
                            ? 'bg-[#FFFDF5] border-2 border-[#FFCC00] shadow-[0_8px_30px_rgba(255,204,0,0.12)]' 
                            : 'bg-white border-2 border-transparent shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${jalur === 'p2p' ? 'bg-[#FFCC00]' : 'bg-gray-100'}`}>
                                <Handshake className={`w-6 h-6 ${jalur === 'p2p' ? 'text-gray-900' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2.5 py-1 rounded-md">Penyaluran Kilat</span>
                                {jalur === 'p2p' ? (
                                    <div className="w-6 h-6 bg-[#FFCC00] rounded-full flex items-center justify-center shadow-sm"><Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3}/></div>
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-[17px] font-black text-gray-900">Klaim P2P Lokal</h3>
                            <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-md">Mandiri</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed mb-5">
                            Buka akses material untuk tukang, pengrajin daur ulang, atau tetangga sekitar yang sedang merenovasi rumah dan membutuhkan material tambahan.
                        </p>

                        <div className="bg-gray-100/80 rounded-xl p-3 flex items-center gap-2 mb-5">
                            <Navigation className="w-4 h-4 text-gray-600 shrink-0 transform rotate-45" />
                            <span className="text-[10px] font-bold text-gray-800">Matching berdasarkan radius lokasi geografis</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed text-gray-700"><strong className="text-gray-900">Jangkauan lokal ketat:</strong> Hanya terlihat oleh pengguna dalam radius 1 - 3 km dari lokasi material.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed text-gray-700"><strong className="text-gray-900">Pengambilan mandiri (Self-pickup):</strong> Penerima mengambil langsung ke titik lokasi tanpa perlu pengaturan armada.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <QrCode className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed text-gray-700"><strong className="text-gray-900">Verifikasi instan via QR:</strong> Sistem first-come first-served dengan konfirmasi reservasi berkode unik.</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Siaga di sekitarmu: 14 renovator aktif</span>
                            <span className={`text-[10px] font-bold ${jalur === 'p2p' ? 'text-yellow-700' : 'text-gray-400'}`}>{jalur === 'p2p' ? 'Pilihan Aktif' : 'Pilih Opsi Ini'}</span>
                        </div>
                    </div>

                </div>

                {/* Box Transparansi & Keamanan */}
                <div className="bg-[#F9F8F6] rounded-2xl p-5 flex gap-3 items-start mb-8">
                    <Info className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-gray-900 mb-0.5">Transparansi Penyaluran SISAIN</h4>
                        <p className="text-[10px] text-gray-600 leading-relaxed">
                            Apapun jalur yang Anda pilih, identitas serta nomor kontak pribadi tetap terlindungi melalui enkripsi sistem. Serah terima material wajib menggunakan validasi kode QR demi keamanan bersama.
                        </p>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-white rounded-[20px] p-4 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
                    <button 
                        onClick={onBack}
                        className="text-[11px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-2 px-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Periksa Kembali Data Material
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 font-medium">Tahap Selanjutnya</p>
                            <p className="text-[10px] font-black text-gray-900">
                                {jalur === 'donasi' ? 'Kurasi Proyek Sosial Terverifikasi' : 'Buka Akses Reservasi Warga'}
                            </p>
                        </div>
                        <button 
                            onClick={() => onNext(jalur)}
                            className="bg-[#FFCC00] hover:bg-yellow-400 text-gray-900 text-xs font-black px-6 py-3.5 rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
                        >
                            Lanjutkan ke Pencarian <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}