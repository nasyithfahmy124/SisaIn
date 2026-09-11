import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdvancedSplashScreen() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [exit, setExit] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 100);

    const loading = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 28);

    const finish = setTimeout(() => {
      setExit(true);

      setTimeout(() => {
        navigate("/login");
      }, 650);
    }, 3300);

    return () => {
      clearTimeout(show);
      clearTimeout(finish);
      clearInterval(loading);
    };
  }, [navigate]);

  return (
    <main className={`fixed inset-0 flex items-center justify-center bg-white overflow-hidden transition-all duration-700 ${exit ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"}`}>

      {/* Ambient Light */}
      <div className={`absolute left-1/2 top-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[100px] transition-all duration-[1600ms] ${visible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />

      {/* Content */}
      <section className="relative z-10 flex flex-col items-center">

        {/* Logo */}
        <div className="relative flex items-center justify-center w-44 h-44">

          {/* Static Circle */}
          <div className={`absolute inset-0 rounded-full border border-gray-200 transition-all duration-[1200ms] ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} />

          {/* Moving Accent */}
          <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
            <span className="absolute top-[-2px] left-1/2 w-1 h-1 -translate-x-1/2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,.7)]" />
          </div>

          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 176 176">
            <circle cx="88" cy="88" r="83" fill="none" stroke="#f1f1f1" strokeWidth="1" />
            <circle cx="88" cy="88" r="83" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={`${progress * 5.215} 521.5`} className="transition-all duration-100" />
          </svg>

          {/* Logo */}
          <div className={`relative w-[125px] h-[125px] flex items-center justify-center transition-all duration-[1200ms] delay-300 ${visible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-12"}`}>
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute top-0 -left-full w-[40%] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] animate-[shine_2.8s_ease-in-out_infinite]" />
            </div>

            <img src="/src/assets/img/logo2.png" alt="Docjus" className="relative z-10 w-[105px] object-contain drop-shadow-[0_8px_20px_rgba(234,179,8,.25)]" />
          </div>
        </div>

        {/* Brand */}
        <div className={`mt-8 text-center transition-all duration-[900ms] delay-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <img src="/src/assets/img/logo1.png" alt="Docjus" className="w-72 h-auto object-contain mx-auto" />

          <p className="mt-3 text-[11px] tracking-[0.28em] uppercase text-gray-400">
            Ubah Sisa, Bangun Manfaat
          </p>
        </div>

        {/* Loading */}
        <div className={`mt-9 w-48 transition-all duration-700 delay-500 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] uppercase tracking-[0.25em] text-gray-300">
              Loading
            </span>

            <span className="text-[8px] tracking-wider text-yellow-600">
              {progress}%
            </span>
          </div>

          <div className="h-[2px] overflow-hidden rounded-full bg-gray-100">
            <div className="h-full bg-yellow-500 transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <span className={`absolute bottom-6 text-[8px] tracking-[0.35em] text-gray-600 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
        © 2024 SISAIN. All rights reserved.
      </span>
    </main>
  );
}