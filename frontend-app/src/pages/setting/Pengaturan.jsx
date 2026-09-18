import React from 'react';
import { User, MapPin, Bell, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pengaturan() {
  const settingOptions = [
    { icon: User, title: 'Informasi Akun', desc: 'Ubah nama, email, dan foto profil' },
    { icon: MapPin, title: 'Alamat & Radius', desc: 'Atur titik lokasi utama Anda untuk maps' },
    { icon: Bell, title: 'Notifikasi', desc: 'Atur push notification untuk barang baru' },
    { icon: Shield, title: 'Keamanan', desc: 'Ubah kata sandi dan proteksi akun' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Akun</h1>
      
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {settingOptions.map((opt, idx) => (
          <div 
            key={idx} 
            className={`flex items-center p-4 md:p-6 cursor-pointer hover:bg-yellow-50 transition-colors group ${
              idx !== settingOptions.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
              <opt.icon className="w-5 h-5" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-800">{opt.title}</h3>
              <p className="text-sm text-gray-500">{opt.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}