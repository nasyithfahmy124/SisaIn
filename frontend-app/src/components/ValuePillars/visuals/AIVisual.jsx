import React from "react";
import { motion } from "framer-motion";
import {
    ScanSearch,
    Check,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";

export default function AIVisual({ mobile = false }) {
    return (
        <div
            className={`relative flex w-full items-center justify-center ${
                mobile ? "h-[340px]" : "h-[500px]"
            }`}
        >
            <div className="absolute h-72 w-72 rounded-full bg-yellow-200/40 blur-[90px]" />

            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={`relative overflow-hidden rounded-[2.5rem] bg-yellow-500 shadow-[0_30px_80px_rgba(234,179,8,0.25)] ${
                    mobile
                        ? "h-[285px] w-[220px]"
                        : "h-[430px] w-[330px]"
                }`}
            >
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                            backgroundSize: "26px 26px",
                        }}
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600" />

                <div className="relative z-10 flex h-full flex-col justify-between p-6">

                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                            <ScanSearch className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />

                            <span className="text-[8px] font-bold tracking-[0.15em] text-white">
                                SCANNING
                            </span>
                        </div>
                    </div>

                    <div className="relative flex flex-1 items-center justify-center">

                        <div className="relative h-36 w-36 sm:h-44 sm:w-44">

                            <div className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-white" />
                            <div className="absolute right-0 top-0 h-7 w-7 border-r-2 border-t-2 border-white" />
                            <div className="absolute bottom-0 left-0 h-7 w-7 border-b-2 border-l-2 border-white" />
                            <div className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-white" />

                            <motion.div
                                animate={{
                                    top: ["5%", "90%", "5%"],
                                }}
                                transition={{
                                    duration: 2.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute left-2 right-2 h-px bg-white shadow-[0_0_14px_rgba(255,255,255,1)]"
                            />

                            <div className="absolute inset-6 flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                                <div className="text-center">
                                    <Sparkles className="mx-auto h-7 w-7 text-white/80" />

                                    <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-white/70">
                                        Detecting
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-yellow-100">
                            Material detected
                        </p>

                        <div className="mt-1 flex items-end justify-between">
                            <div>
                                <p className="text-4xl font-black tracking-tight text-white">
                                    45
                                </p>

                                <p className="text-xs font-medium text-yellow-50">
                                    Ton+ saved
                                </p>
                            </div>

                            <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-md">
                                <p className="text-[8px] text-yellow-100">
                                    CONFIDENCE
                                </p>

                                <p className="text-sm font-black text-white">
                                    98.7%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <FloatingCard
                icon={Check}
                title="AI Result"
                value="Keramik • Grade A"
                position="right"
            />

            <FloatingCard
                icon={ArrowUpRight}
                title="Estimated Value"
                value="Rp 2.450.000"
                position="left"
            />
        </div>
    );
}

function FloatingCard({
    icon: Icon,
    title,
    value,
    position,
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: position === "right" ? 15 : -15,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                delay: 0.25,
                duration: 0.45,
            }}
            className={`absolute z-20 ${
                position === "right"
                    ? "right-0 sm:-right-4"
                    : "left-0 sm:-left-4"
            } ${
                position === "right"
                    ? "top-[18%]"
                    : "bottom-[18%]"
            } rounded-2xl border border-gray-100 bg-white p-3 shadow-xl`}
        >
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-50">
                    <Icon className="h-4 w-4 text-yellow-600" />
                </div>

                <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                        {title}
                    </p>

                    <p className="mt-0.5 whitespace-nowrap text-[10px] font-bold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}