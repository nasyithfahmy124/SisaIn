import React from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Sparkles,
    ArrowUpRight,
    Recycle,
    Leaf,
} from "lucide-react";

export default function RewardVisual({ mobile = false }) {
    return (
        <div
            className={`relative flex w-full items-center justify-center ${
                mobile ? "h-[340px]" : "h-[500px]"
            }`}
        >
            <div className="absolute h-72 w-72 rounded-full bg-yellow-200/25 blur-[100px]" />

            <motion.div
                animate={{
                    y: [0, -7, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={`relative overflow-hidden rounded-[2.5rem] bg-gray-950 shadow-[0_30px_80px_rgba(15,23,42,0.25)] ${
                    mobile
                        ? "h-[285px] w-[220px]"
                        : "h-[430px] w-[330px]"
                }`}
            >
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-500/20 blur-3xl" />

                <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-yellow-500/10 blur-3xl" />

                <div className="relative z-10 flex h-full flex-col justify-between p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                SISAIN REWARD
                            </p>

                            <p className="mt-1 text-sm font-bold text-white">
                                Impact Wallet
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500">
                            <Trophy className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    {/* Points */}
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                            Your impact
                        </p>

                        <div className="mt-1 flex items-end gap-2">
                            <span className="text-5xl font-black tracking-tight text-white">
                                1,280
                            </span>

                            <span className="mb-2 text-[10px] font-bold text-yellow-500">
                                PTS
                            </span>
                        </div>

                        {/* Progress */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-[8px] font-bold text-gray-500">
                                <span>SILVER</span>
                                <span>GOLD</span>
                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-800">
                                <motion.div
                                    initial={{
                                        width: 0,
                                    }}
                                    animate={{
                                        width: "72%",
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.2,
                                        ease: "easeOut",
                                    }}
                                    className="h-full rounded-full bg-yellow-500"
                                />
                            </div>

                            <div className="mt-2 flex justify-between">
                                <span className="text-[8px] text-gray-600">
                                    1,000
                                </span>

                                <span className="text-[8px] font-bold text-gray-400">
                                    1,500 pts
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10">
                                <Recycle className="h-4 w-4 text-yellow-400" />
                            </div>

                            <div className="flex-1">
                                <p className="text-[8px] uppercase tracking-wider text-gray-500">
                                    Latest impact
                                </p>

                                <p className="mt-0.5 text-[10px] font-bold text-white">
                                    120 kg material saved
                                </p>
                            </div>

                            <span className="text-[9px] font-bold text-yellow-400">
                                +120
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tier badge */}
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.9,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    delay: 0.25,
                }}
                className="absolute left-0 top-[15%] z-20 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl sm:-left-4"
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-50">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </div>

                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                            Current Tier
                        </p>

                        <p className="text-[10px] font-bold text-gray-900">
                            Gold Member
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Floating impact */}
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
                    delay: 0.4,
                }}
                className="absolute bottom-[16%] right-0 z-20 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl sm:-right-4"
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50">
                        <Leaf className="h-4 w-4 text-green-600" />
                    </div>

                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                            Impact
                        </p>

                        <p className="text-[10px] font-bold text-gray-900">
                            +120 kg saved
                        </p>
                    </div>

                    <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                </div>
            </motion.div>

            {/* Spark */}
            <motion.div
                animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
                className="absolute right-[8%] top-[8%] hidden sm:block"
            >
                <Sparkles className="h-5 w-5 text-yellow-400" />
            </motion.div>
        </div>
    );
}