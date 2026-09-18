import React from 'react';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Maps() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-80px)] flex flex-col md:flex-row">
      {/* Sidebar List Barang */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10 relative">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Material Terdekat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari keramik, semen, dll..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
            />
          </div>
          <div className="flex items-center gap-2 mt-4 overflow-x-auto hide-scrollbar pb-1">
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">Radius 5 km</span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">Klaim Bebas</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {/* Contoh Item List */}
           <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-yellow-400 cursor-pointer transition-colors">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Keramik Sisa 4 Kotak</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> 2.1 km dari Anda</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Area Peta (Placeholder) */}
      <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        <div className="z-10 text-center">
          <MapPin className="w-12 h-12 text-yellow-500 mx-auto mb-3 animate-bounce" />
          <h3 className="text-lg font-semibold text-gray-700">Peta Sedang Dimuat...</h3>
          <p className="text-sm text-gray-500">Integrasi Leaflet.js akan ditampilkan di sini.</p>
        </div>
      </div>
    </motion.div>
  );
}