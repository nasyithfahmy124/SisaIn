import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

import logo1 from "../assets/img/logo1.png";
import ilustrasi from "../assets/img/ilustrasi.png";

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(3px)",
    transition: {
      duration: 0.3,
      ease,
    },
  },
};

const image = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    x: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    x: 25,
    transition: {
      duration: 0.4,
      ease,
    },
  },
};

export default function Register() {
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const username = formData.username.trim();
    const email = formData.email.trim();

    if (!username) {
      setErrorMsg("Username wajib diisi.");
      return;
    }

    if (!email) {
      setErrorMsg("Email wajib diisi.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter!");
      return;
    }

    try {
      await register({
        username,
        email,
        password: formData.password,
      });
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message ||
            "Terjadi kesalahan saat mendaftar. Username mungkin sudah terpakai.";

      setErrorMsg(errorMessage);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white md:flex-row-reverse"
    >
      <motion.div
        variants={image}
        className="relative flex min-h-[30vh] w-full shrink-0 items-center justify-center overflow-hidden bg-white p-8 md:min-h-screen md:w-1/2 lg:w-[55%]"
      >
        <div className="absolute right-0 top-0 h-full w-full translate-x-1/4 -translate-y-1/4 scale-125 origin-top-right rounded-bl-[100%] bg-[#FFCC00]" />

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 w-full max-w-[400px] md:max-w-[600px]"
        >
          <img
            src={ilustrasi}
            alt="Ilustrasi Mendaftar Sisain"
            className="h-auto w-full drop-shadow-xl"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        className="relative z-10 flex w-full flex-col items-center justify-center bg-white p-8 md:w-1/2 md:p-12 lg:w-[45%] lg:p-16"
      >
        <div className="flex w-full max-w-[360px] flex-col">
          <motion.div
            variants={item}
            className="mb-10 flex flex-col items-center text-center"
          >
            <img
              src={logo1}
              alt="Sisain Logo"
              className="mb-2 h-auto w-64 object-contain md:w-72"
            />

            <p className="text-sm font-medium text-gray-500">
              Daftar akun baru Sisain
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col">
            {errorMsg && (
              <motion.div
                variants={item}
                className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-center text-[13px] font-medium text-red-600"
              >
                {errorMsg}
              </motion.div>
            )}

            <motion.div
              variants={item}
              className="mb-5 flex items-center border-b-2 border-gray-200 py-2.5 transition-colors duration-300 focus-within:border-[#FFCC00]"
            >
              <User
                className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                strokeWidth={2}
              />

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Username"
                className="w-full appearance-none border-none bg-transparent px-1 py-1 leading-tight text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400 focus:outline-none"
              />
            </motion.div>

            <motion.div
              variants={item}
              className="mb-5 flex items-center border-b-2 border-gray-200 py-2.5 transition-colors duration-300 focus-within:border-[#FFCC00]"
            >
              <Mail
                className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                strokeWidth={2}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Email"
                className="w-full appearance-none border-none bg-transparent px-1 py-1 leading-tight text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400 focus:outline-none"
              />
            </motion.div>

            <motion.div
              variants={item}
              className="mb-5 flex items-center border-b-2 border-gray-200 py-2.5 transition-colors duration-300 focus-within:border-[#FFCC00]"
            >
              <Lock
                className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                strokeWidth={2}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Kata Sandi"
                className="w-full appearance-none border-none bg-transparent px-1 py-1 leading-tight text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 rounded-md p-1 text-gray-400 outline-none transition-colors hover:text-[#FFCC00] focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </motion.div>

            <motion.div
              variants={item}
              className="mb-8 flex items-center border-b-2 border-gray-200 py-2.5 transition-colors duration-300 focus-within:border-[#FFCC00]"
            >
              <Lock
                className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                strokeWidth={2}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Ulangi Kata Sandi"
                className="w-full appearance-none border-none bg-transparent px-1 py-1 leading-tight text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 rounded-md p-1 text-gray-400 outline-none transition-colors hover:text-[#FFCC00] focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label={
                  showPassword
                    ? "Sembunyikan konfirmasi kata sandi"
                    : "Tampilkan konfirmasi kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </motion.div>

            <motion.div
              variants={item}
              className="flex w-full justify-center"
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{
                  scale: isLoading ? 1 : 1.02,
                }}
                whileTap={{
                  scale: isLoading ? 1 : 0.98,
                }}
                className={`flex w-full max-w-[280px] items-center justify-center rounded-full px-2 py-2 outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                  isLoading
                    ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 shadow-inner"
                    : "border-b-4 border-yellow-500 bg-[#FFCC00] text-gray-900 shadow-[0_6px_20px_rgba(255,204,0,0.3)] hover:border-yellow-500 hover:bg-yellow-400 active:border-b-0 active:border-t-4"
                }`}
              >
                {isLoading ? (
                  <div className="flex w-full items-center justify-center gap-2 py-1.5">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />

                    <span className="text-sm font-black tracking-wider">
                      MEMPROSES
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex shrink-0 items-center justify-center rounded-full bg-white/30 p-2">
                      <ArrowRight
                        className="h-4 w-4 text-gray-900"
                        strokeWidth={3}
                      />
                    </div>

                    <span className="flex-1 pr-8 text-center text-sm font-black tracking-widest">
                      DAFTAR
                    </span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-8 text-center text-[13px] font-medium text-gray-500"
            >
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="rounded font-black text-[#FFCC00] outline-none transition-colors hover:text-yellow-600 hover:underline focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                Masuk di sini
              </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}