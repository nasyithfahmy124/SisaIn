import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, MapPin, ArrowRight, Activity } from 'lucide-react';

export default function DesktopRedistribusi() {
  const [distribusiType, setDistribusiType] = useState('fasos');

  const cardVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Redistribusi Material</span>
          <span className="mx-2">›</span>
          <span className="text-yellow-600 font-medium">Donasi Baru</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight w-2/3">
          Katalog & Alokasi Sisa Material Konstruksi
        </h1>
        <div className="mt-4 flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Live circular network
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1 text-gray-400" />
            Sistem AI Validasi Batch v4.2 Aktif
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kiri: Form & Upload (Col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Donasikan Sisa Material</h2>
              <p className="text-sm text-gray-500">Unggah foto material sisa proyek untuk deteksi otomatis oleh AI Sisain.</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Langkah 1 dari 2</span>
          </div>

          {/* Upload Zone */}
          <motion.div 
            whileHover={{ borderColor: '#EAB308', backgroundColor: '#FEFCE8' }}
            className="border-2 border-dashed border-yellow-300 bg-yellow-50 rounded-2xl p-8 text-center cursor-pointer mb-6 transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-gray-700 font-medium">
              Tarik & lepas foto material ke sini atau <span className="text-yellow-600 underline">Klik untuk unggah</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">Mendukung format JPG, PNG, atau WEBP hingga 10MB</p>
          </motion.div>

          {/* AI Image Preview Simulation */}
          <div className="relative rounded-2xl overflow-hidden h-64 mb-8 bg-gray-200">
            <img src="/src/assets/img/keramik-placeholder.jpg" alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold rounded-full">
              ● Kondisi Sangat Baik
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-3 flex items-center text-white text-sm font-medium">
                <Activity className="w-5 h-5 text-yellow-400 mr-3" />
                Hasil AI Sisain: Terdeteksi 12 Dus Keramik Putih [Kondisi 90%]
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Material</label>
              <select className="w-full border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-yellow-400 focus:border-yellow-400">
                <option>Keramik & Ubin Lantai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estimasi Volume Sisa</label>
              <div className="relative">
                <input type="text" value="12 Dus (~18.5 m²)" readOnly className="w-full border-gray-200 bg-gray-50 rounded-xl p-3 text-sm" />
                <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">m² / dus</span>
              </div>
            </div>
          </div>

          {/* Jalur Redistribusi */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Pilihan Jalur Redistribusi</label>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                variants={cardVariants} whileHover="hover" whileTap="tap"
                onClick={() => setDistribusiType('fasos')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-colors ${distribusiType === 'fasos' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 flex items-center">
                    <CheckCircle2 className={`w-5 h-5 mr-2 ${distribusiType === 'fasos' ? 'text-yellow-600' : 'text-gray-300'}`} />
                    Donasi Fasilitas Sosial
                  </h3>
                </div>
                <p className="text-xs text-gray-500 pl-7">Prioritas renovasi sarana ibadah, sekolah rakyat, atau balai RW.</p>
              </motion.div>
              
              <motion.div 
                variants={cardVariants} whileHover="hover" whileTap="tap"
                onClick={() => setDistribusiType('warga')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-colors ${distribusiType === 'warga' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-2 ${distribusiType === 'warga' ? 'border-yellow-600' : 'border-gray-300'}`}></div>
                    Klaim Bebas Warga
                  </h3>
                </div>
                <p className="text-xs text-gray-500 pl-7">Terbuka untuk renovasi hunian mandiri warga sekitar.</p>
              </motion.div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-2xl flex items-center justify-between px-6 transition-colors"
          >
            <span>Verifikasi & Terbitkan Material</span>
            <div className="bg-yellow-400 rounded-full p-2">
              <ArrowRight className="w-5 h-5 text-gray-900" />
            </div>
          </motion.button>
        </div>

        {/* Kanan: Rekomendasi (Col-span-1) */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#FACC15] rounded-3xl p-6 shadow-lg shadow-yellow-500/20"
          >
            <div className="inline-flex items-center bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <Activity className="w-3 h-3 mr-2 text-yellow-400" /> Kebutuhan Mendesak Terverifikasi
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 leading-tight mb-8">
              Salurkan langsung ke proyek publik & renovasi fasilitas sekitar.
            </h2>

            <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center text-red-500 text-xs font-bold">
                  <MapPin className="w-3 h-3 mr-1" /> Target Kebutuhan Terdekat
                </span>
                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md">1.2 km dari lokasimu</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Musala Al-Ikhlas</h3>
              <p className="text-xs text-gray-500 mb-4">Renovasi Tempat Wudhu & Dinding Serambi Timur</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                  <span>Status Kebutuhan Material:</span>
                  <span>12 / 16 Sak</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Kurang 4 Sak Semen untuk Plesteran Dinding</p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-3 flex items-start mb-4">
                <span className="text-yellow-600 mr-2">💡</span>
                <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                  Sangat cocok! Sisa material keramik lantai dan semen yang Anda donasikan langsung menutup kekurangan proyek ini.
                </p>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold py-2.5 rounded-xl transition-colors">
                  Hubungi Penanggung Jawab
                </button>
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-colors">
                  Tinjau Kebutuhan
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-green-400 text-xs font-bold flex items-center mb-1">
                  ● Match Speed: Proyek Terverifikasi!
                </p>
                <p className="text-gray-400 text-[10px]">Estimasi pickup kurir 35 menit setelah disetujui</p>
              </div>
              <div className="bg-yellow-400 rounded-full p-2">
                <ArrowRight className="w-4 h-4 text-gray-900" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}