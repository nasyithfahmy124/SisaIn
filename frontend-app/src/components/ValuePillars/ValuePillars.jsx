import React, { useState } from "react";
import { motion } from "framer-motion";
import ValuePillarsHeader from "./ValuePillarsHeader";
import ValuePillarsDesktop from "./ValuePillarsDesktop";
import ValuePillarsMobile from "./ValuePillarsMobile";
import { PILLARS } from "./valuePillars.data";

const sectionAnimation = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function ValuePillars() {
    const [activeIndex, setActiveIndex] = useState(0);

    const activePillar = PILLARS[activeIndex];

    return (
        <section
            id="value-pillars"
            className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
        >
            <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-yellow-100/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-yellow-50 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <motion.div
                    variants={sectionAnimation}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        margin: "-100px",
                    }}
                >
                    <ValuePillarsHeader />

                    <div className="mt-12 lg:mt-20">
                        <div className="hidden lg:block">
                            <ValuePillarsDesktop
                                pillars={PILLARS}
                                activeIndex={activeIndex}
                                activePillar={activePillar}
                                onChange={setActiveIndex}
                            />
                        </div>

                        <div className="lg:hidden">
                            <ValuePillarsMobile
                                pillars={PILLARS}
                                activeIndex={activeIndex}
                                activePillar={activePillar}
                                onChange={setActiveIndex}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}