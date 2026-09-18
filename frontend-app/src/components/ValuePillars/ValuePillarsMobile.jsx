import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import PillarVisual from "./PillarVisual";
import PillarDetails from "./PillarDetails";

const contentAnimation = {
    initial: {
        opacity: 0,
        y: 15,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2,
        },
    },
};

export default function ValuePillarsMobile({
    pillars,
    activeIndex,
    activePillar,
    onChange,
}) {
    return (
        <div className="relative">

            <div className="-mx-5 overflow-x-auto px-5 scrollbar-none">
                <div className="flex min-w-max gap-2">
                    {pillars.map((pillar, index) => {
                        const Icon = pillar.icon;
                        const active = activeIndex === index;

                        return (
                            <button
                                key={pillar.key}
                                onClick={() => onChange(index)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                                    active
                                        ? "bg-gray-950 text-white shadow-lg"
                                        : "border border-gray-200 bg-white text-gray-500"
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{pillar.id}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activePillar.key}
                    variants={contentAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <div className="relative mt-8 flex justify-center">
                        <PillarVisual
                            pillar={activePillar}
                            mobile
                        />
                    </div>

                    <div className="mt-10">
                        <PillarDetails pillar={activePillar} />
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                        animate={{
                            width: `${((activeIndex + 1) / pillars.length) * 100}%`,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-yellow-500"
                    />
                </div>

                <span className="text-[10px] font-bold text-gray-400">
                    {activePillar.id} / {pillars.length}
                </span>
            </div>

        </div>
    );
}