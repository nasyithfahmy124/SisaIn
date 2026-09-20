import React from 'react';
import DesktopRedistribusi from '../../components/Redistribusi/DesktopRedistribusi';
import MobileRedistribusi from '../../components/Redistribusi/MobileRedistribusi';

export default function Redistribusi() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Tampilan Desktop (Sembunyi di layar kecil) */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DesktopRedistribusi />
      </div>

      {/* Tampilan Mobile (Sembunyi di layar besar) */}
      <div className="block md:hidden">
        <MobileRedistribusi />
      </div>
    </div>
  );
}