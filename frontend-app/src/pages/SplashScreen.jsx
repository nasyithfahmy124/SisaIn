import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/img/logo1.png';
import logo2 from '../assets/img/logo2.png';

export default function AdvancedSplashScreen() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [exit, setExit] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setVisible(true);
        }, 100);

        const loadingTimer = setInterval(() => {
            setProgress((prev) => Math.min(prev + 1, 100));
        }, 28);

        const finishTimer = setTimeout(() => {
            setExit(true);

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 650);
        }, 3300);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(finishTimer);
            clearInterval(loadingTimer);
        };
    }, [navigate]);

    return (
        <main
            className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white transition-all duration-700 ${
                exit
                    ? 'scale-[1.03] opacity-0'
                    : 'scale-100 opacity-100'
            }`}
        >
            <div
                className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[100px] transition-all duration-[1600ms] ${
                    visible
                        ? 'scale-100 opacity-100'
                        : 'scale-50 opacity-0'
                }`}
            />

            <section className="relative z-10 flex flex-col items-center">
                <div className="relative flex h-44 w-44 items-center justify-center">
                    <div
                        className={`absolute inset-0 rounded-full border border-gray-200 transition-all duration-[1200ms] ${
                            visible
                                ? 'scale-100 opacity-100'
                                : 'scale-75 opacity-0'
                        }`}
                    />

                    <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
                        <span className="absolute left-1/2 top-[-2px] h-1 w-1 -translate-x-1/2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,.7)]" />
                    </div>

                    <svg
                        className="absolute inset-0 h-full w-full -rotate-90"
                        viewBox="0 0 176 176"
                    >
                        <circle
                            cx="88"
                            cy="88"
                            r="83"
                            fill="none"
                            stroke="#f1f1f1"
                            strokeWidth="1"
                        />

                        <circle
                            cx="88"
                            cy="88"
                            r="83"
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray={`${progress * 5.215} 521.5`}
                            className="transition-all duration-100"
                        />
                    </svg>

                    <div
                        className={`relative flex h-[125px] w-[125px] items-center justify-center transition-all duration-[1200ms] delay-300 ${
                            visible
                                ? 'rotate-0 scale-100 opacity-100'
                                : '-rotate-12 scale-50 opacity-0'
                        }`}
                    >
                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                            <div className="absolute left-[-100%] top-0 h-full w-[40%] -skew-x-[-20deg] animate-[shine_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                        </div>

                        <img
                            src={logo2}
                            alt="SISAIN"
                            className="relative z-10 w-[105px] object-contain drop-shadow-[0_8px_20px_rgba(234,179,8,.25)]"
                        />
                    </div>
                </div>

                <div
                    className={`mt-8 text-center transition-all duration-[900ms] delay-300 ease-out ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-3 opacity-0'
                    }`}
                >
                    <img
                        src={logo1}
                        alt="SISAIN"
                        className="mx-auto h-auto w-72 object-contain"
                    />

                    <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-gray-400">
                        Ubah Sisa, Bangun Manfaat
                    </p>
                </div>

                <div
                    className={`mt-9 w-48 transition-all duration-700 delay-500 ${
                        visible ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[8px] uppercase tracking-[0.25em] text-gray-300">
                            Loading
                        </span>

                        <span className="text-[8px] tracking-wider text-yellow-600">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-[2px] overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full bg-yellow-500 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </section>

            <span
                className={`absolute bottom-6 text-[8px] tracking-[0.35em] text-gray-600 transition-opacity duration-700 ${
                    visible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                © 2024 SISAIN. All rights reserved.
            </span>
        </main>
    );
}