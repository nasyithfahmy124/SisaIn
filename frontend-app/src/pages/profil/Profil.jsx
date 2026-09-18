import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Coins, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profil() {
  const [activeTab, setActiveTab] = useState('donasi'); // donasi, klaim, dompet

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Header Profil */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-2xl font-bold">
          U
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Sisain</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full font-medium shadow-sm">
              <Award className="w-4 h-4" /> Gold Tier
            </span>
            <span className="text-gray-500 font-medium">1,250 Koin</span>
          </div>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        {['donasi', 'klaim', 'dompet'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-sm font-semibold capitalize whitespace-nowrap transition-colors relative ${
              activeTab === tab ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'donasi' ? 'Donasi Saya' : tab === 'klaim' ? 'Klaim Saya' : 'Dompet & Koin'}
            {activeTab === tab && (
              <motion.div layoutId="profil-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Konten Tab */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
        {activeTab === 'donasi' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800 mb-4">Status Donasi Material</h2>
            {/* Contoh Item */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-yellow-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><Package className="text-gray-400" /></div>
                <div>
                  <h3 className="font-semibold text-gray-800">10 Sak Semen (Sisa Proyek)</h3>
                  <p className="text-xs text-yellow-600 font-medium flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Menunggu Verifikasi AI</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-yellow-600 font-medium">Detail</button>
            </div>
          </div>
        )}
        
        {activeTab === 'klaim' && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Package className="w-12 h-12 mb-3 text-gray-300" />
            <p>Belum ada material yang Anda klaim.</p>
          </div>
        )}

        {activeTab === 'dompet' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-gray-300 mb-2"><Coins className="w-5 h-5" /> Saldo Koin</div>
              <div className="text-4xl font-bold text-yellow-400">1,250</div>
              <p className="text-xs mt-2 text-gray-400">Kumpulkan 250 koin lagi untuk menukar voucher gratis ongkir.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}