import React from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Redistribusi() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Redistribusi Material</h1>
        <p className="text-gray-500 mt-2">Upload material sisa Anda atau cari proyek yang membutuhkan bantuan.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card Upload */}
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:border-yellow-400 transition-colors group cursor-pointer min-h-[300px]">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Upload Material Sisa</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">AI kami akan membantu memperkirakan kondisi dan kategori barang Anda.</p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-yellow-500/20">
            Mulai Upload
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl border border-yellow-100 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cara Kerja Sisain</h3>
          <ul className="space-y-4">
            {['Upload foto material sisa Anda', 'Sistem AI menilai kondisi barang', 'Pilih untuk klaim bebas (lokal) atau donasi proyek', 'Tunggu dijemput dan dapatkan Koin!'].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}