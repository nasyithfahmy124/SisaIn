import React from "react";
import { CheckCircle2, Monitor, Terminal, Globe, Smartphone, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#FFFBEA] pt-7 pb-5 border-t border-gray-100">

      <div className="absolute top-0 left-0 w-full h-6 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[8%] w-20 h-1 bg-yellow-500 rounded-full" />
        <div className="absolute top-0 left-[8%] translate-x-20 w-11 h-1 bg-yellow-300 rounded-full" />
        <div className="absolute top-0 left-[8%] translate-x-31 w-1.5 h-1 bg-yellow-200 rounded-full" />
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-yellow-200 rounded-tr-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-9">

          <div className="max-w-sm">

            <Link to="/beranda" className="inline-block mb-4 group">
              <img
                src="/src/assets/img/logo1.png"
                alt="SISAIN"
                className="w-72 h-auto object-contain transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <p className="text-xs leading-5 text-gray-500 max-w-xs">
              Menghubungkan sisa yang tidak terpakai dengan
              peluang baru untuk digunakan kembali.
            </p>

            <div className="flex flex-wrap gap-7 mt-5">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">
                  Email
                </p>
                <p className="text-xs font-medium text-gray-900">
                  hello@docjus.com
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">
                  Phone
                </p>
                <p className="text-xs font-medium text-gray-900">
                  +62 (800) 895-3801
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative md:text-right">

            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[.22em] text-yellow-600 font-semibold mb-2.5">
              <span className="w-4 h-px bg-yellow-500" />
              Mulai sekarang
            </span>

            <h3 className="text-xl md:text-2xl font-bold leading-tight text-gray-900 max-w-sm md:ml-auto mb-4">
              Sisa hari ini,
              <span className="text-yellow-500"> manfaat esok hari.</span>
            </h3>

            <div className="flex flex-wrap md:justify-end gap-2">

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white pl-4 pr-1.5 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 hover:-translate-y-0.5"
              >
                Coba SISAIN Gratis

                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20">
                  <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 font-semibold text-xs hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
                Lihat Demo
              </button>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative border-t border-gray-200 pt-4">

          {/* Platform */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

            <div className="flex items-center text-xs text-gray-800 font-semibold">
              <span className="w-6 h-6 mr-2 rounded-full bg-yellow-50 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 stroke-[2.5]" />
              </span>
              Tersedia di semua platform
            </div>

            <div className="flex flex-wrap gap-1.5">
              <PlatformBadge icon={<Monitor />} text="Windows" />
              <PlatformBadge icon={<Monitor />} text="macOS" />
              <PlatformBadge icon={<Terminal />} text="Linux" />
              <PlatformBadge icon={<Globe />} text="Chrome" />
              <PlatformBadge icon={<Smartphone />} text="iOS" />
              <PlatformBadge icon={<Smartphone />} text="Android" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-5 pt-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            © 2026 SISAIN. Semua hak dilindungi.
          </p>

          <div className="flex gap-4 text-[10px] text-gray-400">
            <a href="#" className="hover:text-gray-700 transition-colors">Privasi</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Ketentuan</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Bantuan</a>
          </div>
        </div>

      </div>

      {/* Bottom Signature */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500" />
    </footer>
  );
}

function PlatformBadge({ icon, text }) {
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-semibold text-gray-600 hover:border-yellow-300 hover:text-yellow-600 transition-colors">
      {React.cloneElement(icon, { className: "w-3 h-3" })}
      {text}
    </span>
  );
}