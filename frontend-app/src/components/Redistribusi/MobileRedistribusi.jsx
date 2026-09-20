import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Import UploadCloud dan Activity sudah ditambahkan di sini:
import { ArrowLeft, ArrowRight, User, MapPin, CheckCircle2, ChevronRight, FileText, Leaf, Box, UploadCloud, Activity } from 'lucide-react';
export default function MobileRedistribusi() {
  const [activeTab, setActiveTab] = useState('upload');
  const [distribusiType, setDistribusiType] = useState('fasos');

  return (
    <div className="bg-gray-50 min-h-screen pb-28 relative">
      
      {/* Top App Bar */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <ArrowLeft className="w-6 h-6 text-gray-700 mr-3" />
          <h1 className="text-lg font-bold text-gray-900">Tambah Surplus</h1>
        </div>
        <div className="w-8 h-8 bg-yellow-700 rounded-full flex items-center justify-center text-white">
          <User className="w-5 h-5" />
        </div>
      </div>

      {/* Segmented Control */}
      <div className="px-4 py-4 bg-white">
        <div className="bg-gray-100 rounded-full p-1 flex relative">
          <motion.div 
            layout 
            className={`absolute top-1 bottom-1 w-[49%] bg-yellow-400 rounded-full shadow-sm`}
            animate={{ left: activeTab === 'upload' ? '4px' : '50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-sm font-bold z-10 flex items-center justify-center transition-colors ${activeTab === 'upload' ? 'text-gray-900' : 'text-gray-500'}`}
          >
            <UploadCloud className="w-4 h-4 mr-2" /> Upload Material
          </button>
          <button 
            onClick={() => setActiveTab('kebutuhan')}
            className={`flex-1 py-2 text-sm font-bold z-10 flex items-center justify-center transition-colors ${activeTab === 'kebutuhan' ? 'text-gray-900' : 'text-gray-500'}`}
          >
            <Activity className="w-4 h-4 mr-2" /> Kebutuhan Fasum
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        
        {/* AI Result Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden h-56 shadow-sm"
        >
          <img src="/src/assets/img/semen-placeholder.jpg" alt="Semen" className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 right-3 bg-gray-900/85 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mb-0.5">Hasil AI Sisain</p>
              <p className="text-white text-sm font-bold flex items-center">
                <span className="text-yellow-400 mr-2">✨</span> 4 Sak Semen (Kering & Utuh)
              </p>
            </div>
            <div className="bg-green-500 p-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
            <Leaf className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold">Potensi Reduksi</p>
              <p className="text-lg font-black text-gray-900">160 Kg</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
            <Box className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold">Kondisi Material</p>
              <p className="text-lg font-black text-gray-900">Grade A</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Lokasi Penjemputan</label>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center shadow-sm">
              <MapPin className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <input type="text" defaultValue="Jl. Pandanaran No. 42, Semarang" className="w-full text-sm font-medium text-gray-800 outline-none" />
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Catatan Donatur</label>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start shadow-sm">
              <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
              <textarea rows="2" defaultValue="Semen sisa acian dinding, tersimpan rapi di teras kering." className="w-full text-sm font-medium text-gray-800 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Tujuan Distribusi */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-3">Tujuan Distribusi</label>
          <div className="space-y-3">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => setDistribusiType('fasos')}
              className={`p-4 rounded-2xl border-2 flex items-center transition-colors ${distribusiType === 'fasos' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">Donasi Fasilitas Sosial</h3>
                <p className="text-xs text-gray-500 mt-0.5">Disalurkan untuk fasum, pos ronda, atau jalan warga</p>
              </div>
              {distribusiType === 'fasos' && <CheckCircle2 className="w-6 h-6 text-green-600" />}
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => setDistribusiType('warga')}
              className={`p-4 rounded-2xl border-2 flex items-center transition-colors ${distribusiType === 'warga' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">Klaim Bebas Warga</h3>
                <p className="text-xs text-gray-500 mt-0.5">Siapapun tetangga terdekat boleh mengambil langsung</p>
              </div>
              {distribusiType === 'warga' && <CheckCircle2 className="w-6 h-6 text-green-600" />}
            </motion.div>
          </div>
        </div>

        {/* Urgent Target Card */}
        <div className="bg-[#FACC15] rounded-3xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-300 rounded-full opacity-50 blur-2xl"></div>
          
          <div className="flex justify-between items-center mb-3 relative z-10">
            <span className="bg-white/80 backdrop-blur-sm text-red-600 text-[10px] font-black px-2 py-1 rounded-md flex items-center uppercase">
              <Activity className="w-3 h-3 mr-1" /> Urgent Fasum
            </span>
            <span className="text-yellow-900 text-xs font-bold flex items-center">
              ● Cocok 98%
            </span>
          </div>
          
          <h3 className="text-xl font-black text-gray-900 mb-2 relative z-10">Perbaikan Jalan Gang RT 03</h3>
          <p className="text-xs text-yellow-900 font-medium mb-4 w-5/6 relative z-10">
            Butuh semen & pasir untuk tambal lubang jalan (0.7 km dari lokasimu)
          </p>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex space-x-2">
              <span className="bg-yellow-50 text-yellow-800 text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> 0.7 km
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Terverifikasi RW
              </span>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ArrowRight className="w-4 h-4 text-gray-900" />
            </div>
          </div>
        </div>
        
        {/* Environmental Impact Banner */}
        <div className="bg-green-50 rounded-2xl p-4 flex items-center border border-green-100">
           <div className="bg-green-200 p-2 rounded-full mr-3">
             <Leaf className="w-5 h-5 text-green-700" />
           </div>
           <div>
             <p className="text-xs font-bold text-gray-900">312 kg material diselamatkan minggu ini</p>
             <p className="text-[10px] text-gray-500">Kecamatan Semarang Tengah • 14 Donatur Aktif</p>
           </div>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:hidden z-50">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-full bg-white border-2 border-gray-100 hover:border-yellow-400 text-gray-900 rounded-2xl p-2 flex items-center justify-between transition-colors shadow-sm"
        >
          <div className="text-left pl-2">
            <p className="font-bold text-sm">Lanjutkan Donasi</p>
            <p className="text-[10px] text-gray-500">Gratis penjemputan oleh relawan</p>
          </div>
          <div className="bg-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">
            <ArrowRight className="w-6 h-6 text-gray-900" />
          </div>
        </motion.button>
      </div>
      
    </div>
  );
}