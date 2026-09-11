import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  Factory,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const PARTNER_CARDS = [
  {
    id: "mitra-daur-ulang",
    title: "MITRA DAUR ULANG",
    stat: "50+",
    description:
      "Target pusat daur ulang dan pengepul material tersertifikasi yang akan terintegrasi untuk menjamin pengolahan limbah transparan.",
    icon: Factory,
    logos: [
      { name: "DepoHijau", type: "Certified" },
      { name: "EcoBuild.ID", type: "Verified" },
    ],
  },
  {
    id: "mitra-logistik",
    title: "JARINGAN LOGISTIK",
    stat: "20+",
    description:
      "Proyeksi kolaborasi dengan armada pengangkut khusus material konstruksi untuk memastikan keamanan rantai pasok dari proyek ke pengepul.",
    icon: Truck,
    logos: [
      { name: "TransBuild", type: "Partner" },
      { name: "LajuLogistik", type: "Partner" },
    ],
  },
];

const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },

  left: {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },

  card: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
};

export default function TrustedPartners() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">

      <div className="absolute inset-y-6 left-0 w-full rounded-r-[2.5rem] bg-yellow-500 sm:inset-y-8 sm:rounded-r-[3rem] lg:inset-y-10 lg:w-[88%] lg:rounded-r-[4rem]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <motion.div
          variants={animations.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-12"
        >

          <motion.div
            variants={animations.left}
            className="relative z-10 max-w-lg py-6 text-white sm:py-8 lg:py-12"
          >

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <ShieldCheck
                  className="h-5 w-5 text-white"
                  strokeWidth={1.7}
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[.16em] text-white sm:text-xs">
                Keamanan & Verifikasi
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-[1.05] tracking-[-.035em] sm:text-4xl lg:text-5xl">
              Ekosistem yang{" "}
              <span className="font-light text-white/60">
                Dapat Dipercaya.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              Transparansi adalah fondasi SISAIN. Kami merancang standar
              verifikasi untuk memastikan setiap material sisa berada di
              jalur yang tepat, aman, dan dapat dilacak.
            </p>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#1D4D3A] shadow-md transition-colors duration-300 hover:bg-[#1D4D3A] hover:text-white sm:px-6 sm:py-3.5"
            >
              Standar Verifikasi Kami
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>
          </motion.div>

          <div className="relative z-10 min-w-0">

            <div className="mb-3 flex items-center justify-end gap-1 text-[10px] font-medium text-white/70 lg:hidden">
              Geser untuk melihat
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden] lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:pb-0">

              {PARTNER_CARDS.map((card) => {
                const Icon = card.icon;

                return (
                  <motion.article
                    key={card.id}
                    variants={animations.card}
                    className="group relative min-w-[84vw] snap-center overflow-hidden rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,.12)] transition-transform duration-300 hover:-translate-y-1 sm:min-w-[360px] sm:rounded-[1.75rem] sm:p-6 lg:min-w-0"
                  >
                    <span className="pointer-events-none absolute -right-3 -top-7 text-[100px] font-black leading-none tracking-[-.08em] text-gray-50">
                      {card.stat.replace("+", "")}
                    </span>

                    <div className="relative flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F9F2]">
                          <Icon
                            className="h-4 w-4 text-[#1D4D3A]"
                            strokeWidth={1.7}
                          />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[.14em] text-gray-400 sm:text-[10px]">
                          {card.title}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4A017]" />

                    </div>

                    <div className="relative mt-7 flex items-end gap-2">

                      <span className="text-5xl font-black tracking-[-.06em] text-[#1D4D3A] sm:text-6xl">
                        {card.stat}
                      </span>

                      <span className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        target
                      </span>

                    </div>

                    <p className="relative mt-3 min-h-[78px] max-w-md text-xs font-medium leading-5.5 text-gray-500 sm:text-sm sm:leading-6">
                      {card.description}
                    </p>

                    <div className="mt-5 border-t border-gray-100 pt-5">

                      <p className="mb-3 text-[9px] font-bold uppercase tracking-[.14em] text-gray-400">
                        Blueprint Ekosistem
                      </p>

                      <div className="flex flex-wrap gap-x-6 gap-y-3">

                        {card.logos.map((logo) => (
                          <div key={logo.name}>

                            <p className="text-xs font-bold text-gray-800">
                              {logo.name}
                            </p>

                            <p className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold text-[#4D7C3E]">
                              <ShieldCheck className="h-3 w-3" />
                              {logo.type}
                            </p>

                          </div>
                        ))}

                      </div>

                    </div>

                  </motion.article>
                );
              })}

            </div>

            <div className="mt-1 flex justify-center gap-1.5 lg:hidden">
              <span className="h-1.5 w-5 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  );
}