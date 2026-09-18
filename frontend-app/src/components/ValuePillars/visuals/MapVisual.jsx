import React from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    MapPinned,
    Recycle,
    Navigation,
} from "lucide-react";

const MARKERS = [
    {
        top: "24%",
        left: "26%",
        delay: 0,
    },
    {
        top: "32%",
        left: "73%",
        delay: 0.5,
    },
    {
        top: "68%",
        left: "70%",
        delay: 0.8,
    },
    {
        top: "72%",
        left: "28%",
        delay: 0.3,
    },
];

export default function MapVisual({ mobile = false }) {
    return (
        <div
            className={`relative flex w-full items-center justify-center ${
                mobile ? "h-[340px]" : "h-[500px]"
            }`}
        >
            <div className="absolute h-72 w-72 rounded-full bg-yellow-100/70 blur-[90px]" />

            <div
                className={`relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-[#eef2e8] shadow-[0_30px_80px_rgba(15,23,42,0.12)] ${
                    mobile
                        ? "h-[285px] w-[280px]"
                        : "h-[420px] w-[390px]"
                }`}
            >
                <MapBackground />

                {/* Radius */}
                <motion.div
                    animate={{
                        scale: [0.9, 1.05, 0.9],
                        opacity: [0.45, 0.2, 0.45],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400 bg-yellow-400/10"
                />

                {/* User location */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-full bg-yellow-400/30"
                    />

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-yellow-500 text-white shadow-xl">
                        <Navigation className="h-5 w-5 fill-current" />
                    </div>
                </div>

                {/* Partner markers */}
                {MARKERS.map((marker, index) => (
                    <PartnerMarker
                        key={index}
                        {...marker}
                    />
                ))}

                {/* Top status */}
                <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <div className="rounded-full border border-white/70 bg-white/90 px-3 py-2 shadow-md backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

                            <span className="text-[8px] font-bold uppercase tracking-wider text-gray-600">
                                Live matching
                            </span>
                        </div>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-md">
                        <MapPinned className="h-4 w-4 text-gray-700" />
                    </div>
                </div>

                {/* Bottom information */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                Nearby partners
                            </p>

                            <p className="mt-1 text-sm font-extrabold text-gray-900">
                                24 partner aktif
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">
                            <Recycle className="h-4 w-4 text-yellow-600" />
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-[9px] font-medium text-gray-400">
                            Radius pencarian
                        </span>

                        <span className="text-[10px] font-bold text-gray-900">
                            5.0 km
                        </span>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    x: 15,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                }}
                transition={{
                    delay: 0.3,
                }}
                className="absolute right-0 top-[18%] z-20 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl sm:-right-4"
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50">
                        <MapPin className="h-4 w-4 text-green-600" />
                    </div>

                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                            Nearest Partner
                        </p>

                        <p className="text-[10px] font-bold text-gray-900">
                            1.2 km dari lokasi
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function PartnerMarker({
    top,
    left,
    delay,
}) {
    return (
        <motion.div
            style={{
                top,
                left,
            }}
            animate={{
                y: [0, -5, 0],
            }}
            transition={{
                duration: 2.4,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="absolute z-10"
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-950 text-white shadow-lg">
                <Recycle className="h-3.5 w-3.5" />
            </div>
        </motion.div>
    );
}

function MapBackground() {
    return (
        <div className="absolute inset-0 opacity-70">

            <div className="absolute left-[5%] top-[20%] h-px w-[90%] rotate-[17deg] bg-gray-300" />

            <div className="absolute left-[-5%] top-[48%] h-px w-[110%] -rotate-[11deg] bg-gray-300" />

            <div className="absolute left-[10%] top-[75%] h-px w-[90%] rotate-[28deg] bg-gray-300" />

            <div className="absolute left-[28%] top-[-10%] h-[120%] w-px rotate-[14deg] bg-gray-300" />

            <div className="absolute left-[63%] top-[-10%] h-[120%] w-px -rotate-[19deg] bg-gray-300" />

            <div className="absolute left-[82%] top-[-10%] h-[120%] w-px rotate-[8deg] bg-gray-300" />

            <div className="absolute left-[15%] top-[30%] h-20 w-32 rounded-full bg-green-200/40 blur-xl" />

            <div className="absolute bottom-[25%] right-[10%] h-28 w-36 rounded-full bg-green-200/40 blur-xl" />
        </div>
    );
}