import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function PillarDetails({ pillar }) {
    const Icon = pillar.icon;

    return (
        <motion.div
            key={pillar.key}
            initial={{
                opacity: 0,
                x: 15,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50">
                    <Icon className="h-5 w-5 text-yellow-500" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
                    {pillar.tagline}
                </span>
            </div>

            <h3 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl">
                {pillar.title}
            </h3>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
                {pillar.description}
            </p>

            <div className="mt-7 flex items-center gap-3 border-t border-gray-100 pt-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50">
                    <ArrowUpRight className="h-4 w-4 text-yellow-500" />
                </div>

                <span className="text-xs font-bold text-gray-600">
                    Lihat bagaimana ini bekerja
                </span>
            </div>
        </motion.div>
    );
}