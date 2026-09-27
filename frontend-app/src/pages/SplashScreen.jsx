import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import logo1 from "../assets/img/logo1.png";
import logo2 from "../assets/img/logo2.png";

export default function AdvancedSplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const duration = 3300;

    const updateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const value = Math.min((elapsed / duration) * 100, 100);

      setProgress(Math.round(value));

      if (elapsed < duration) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);

        setTimeout(() => {
          navigate("/beranda", { replace: true });
        }, 300);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.12),transparent_35%)]" />

      <div className="relative z-10 flex w-full max-w-[360px] flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-[220px] w-[220px] items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 rounded-full border border-gray-200"
          />

          <motion.div
            className="absolute inset-[4px] rounded-full border border-[#FFCC00]"
            style={{
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-[150px] w-[150px] items-center justify-center"
          >
            <img
              src={logo2}
              alt="SISAIN"
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-5"
        >
          <img
            src={logo1}
            alt="SISAIN"
            className="mx-auto h-auto w-[190px] object-contain"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-2 text-[12px] font-medium uppercase tracking-[0.45em] text-[#9AA9C1]"
        >
          UBAH SISA, BANGUN MANFAAT
        </motion.p>

        <div className="mt-12 w-full max-w-[240px]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#C7CED8]">
              Loading
            </span>

            <span className="text-[10px] font-bold text-[#E8A900]">
              {progress}%
            </span>
          </div>

          <div className="h-[3px] w-full overflow-hidden bg-[#EEF1F4]">
            <motion.div
              className="h-full bg-[#FFCC00]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-0 right-0 text-center">
        <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-[#8B96A8]">
          © 2024 SISAIN. All rights reserved.
        </p>
      </div>
    </div>
  );
}