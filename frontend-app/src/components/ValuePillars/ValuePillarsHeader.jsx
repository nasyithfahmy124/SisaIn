import React from "react";
import { motion } from "framer-motion";

const animation = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function ValuePillarsHeader() {
    return (
        <motion.div
            variants={animation}
            className="max-w-2xl"
        >
            <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />

                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-500 sm:text-xs">
                    Mengapa SISAIN
                </span>
            </div>

            <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Bangun lebih baik
                <br />
                <span className="text-yellow-500">
                    dengan SISAIN.
                </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
                Satu ekosistem untuk mengenali material, menemukan
                peluang pemanfaatan kembali, dan mengubah sisa proyek
                menjadi dampak nyata.
            </p>
        </motion.div>
    );
}