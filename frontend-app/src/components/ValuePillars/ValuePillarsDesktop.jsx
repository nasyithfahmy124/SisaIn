import React from "react";
import { motion } from "framer-motion";
import PillarVisual from "./PillarVisual";
import PillarDetails from "./PillarDetails";

const itemAnimation = {
    hidden: {
        opacity: 0,
        x: -20,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function ValuePillarsDesktop({
    pillars,
    activeIndex,
    activePillar,
    onChange,
}) {
    return (
        <div className="grid grid-cols-[220px_minmax(360px,1fr)_280px] items-center gap-12">

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
                className="flex flex-col"
            >
                {pillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    const active = activeIndex === index;

                    return (
                        <motion.button
                            key={pillar.key}
                            variants={itemAnimation}
                            onClick={() => onChange(index)}
                            className={`group relative flex items-center gap-4 border-l-2 py-5 pl-5 text-left transition-all duration-300 ${
                                active
                                    ? "border-yellow-500"
                                    : "border-gray-100 hover:border-gray-300"
                            }`}
                        >
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                    active
                                        ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20"
                                        : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>

                            <div>
                                <span
                                    className={`text-[9px] font-black tracking-[0.18em] ${
                                        active
                                            ? "text-yellow-500"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {pillar.id}
                                </span>

                                <p
                                    className={`mt-1 text-sm font-bold ${
                                        active
                                            ? "text-gray-950"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {pillar.title}
                                </p>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>

            <div className="relative flex min-h-[500px] items-center justify-center">
                <PillarVisual pillar={activePillar} />
            </div>

            <div>
                <PillarDetails pillar={activePillar} />
            </div>

        </div>
    );
}