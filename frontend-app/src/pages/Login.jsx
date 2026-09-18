import React, { useState } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth"; // <-- Impor custom hook

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const item = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
  exit: { opacity: 0, y: -12, filter: "blur(3px)", transition: { duration: 0.3, ease } },
};

const image = {
  hidden: { opacity: 0, scale: 0.92, x: -30 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.9, ease } },
  exit: { opacity: 0, scale: 0.96, x: -25, transition: { duration: 0.4, ease } },
};

export default function Login() {
  const { login, isLoading } = useAuth(); // <-- Gunakan fungsi login dari hook

  // Ubah state email menjadi username
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Panggil API Login
      await login(formData);
      // Jika berhasil, useAuth akan otomatis melakukan navigate('/beranda')
    } catch (err) {
      // Tangkap pesan error (misal: "No active account found with the given credentials")
      setErrorMsg(err.message || "Gagal masuk. Periksa kembali username dan kata sandi Anda.");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white flex flex-col md:flex-row w-full h-screen overflow-hidden relative overflow-y-auto"
    >

      {/* Ilustrasi */}
      <motion.div variants={image} className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[500px] flex items-center justify-center p-8 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-400 -translate-x-1/4 -translate-y-1/4 rounded-br-[100%] scale-125 origin-top-left" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-[500px] md:max-w-[700px]"
        >
          <img src="/src/assets/img/ilustrasi.png" alt="Ilustrasi Orang Bekerja" className="w-full h-auto drop-shadow-xl" />
        </motion.div>
      </motion.div>

      {/* Form */}
      <motion.div variants={container} className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white z-10">

        {/* Header */}
        <motion.div variants={item} className="flex flex-col items-center md:items-start mb-10">
          <img src="/src/assets/img/logo1.png" alt="Sisain Logo" className="w-72 h-auto object-contain" />
          <p className="text-gray-500 text-sm font-medium mt-2">Masuk ke akun Anda</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto md:mx-0">

          {/* Pesan Error */}
          {errorMsg && (
            <motion.p variants={item} className="text-red-500 text-sm font-medium mb-4 text-center md:text-left">
              {errorMsg}
            </motion.p>
          )}

          {/* Username (sebelumnya Email) */}
          <motion.div variants={item} className="flex items-center border-b border-gray-300 py-2 mb-6 transition-colors duration-300 focus-within:border-yellow-500">
            <User className="text-gray-400 w-5 h-5 mr-3" strokeWidth={1.5} />
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              placeholder="Username" 
              className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none font-medium" 
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={item} className="flex items-center border-b border-gray-300 py-2 mb-6 transition-colors duration-300 focus-within:border-yellow-500">
            <Lock className="text-gray-400 w-5 h-5 mr-3" strokeWidth={1.5} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Kata Sandi" 
              className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none font-medium" 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-yellow-500 transition-colors ml-2">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>

          {/* Options */}
          <motion.div variants={item} className="flex items-center justify-between mb-10 text-xs md:text-sm">
            <label className="flex items-center text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                className="mr-2 w-4 h-4 accent-yellow-500 rounded border-gray-300" 
              />
              Ingat saya
            </label>

            <a href="#" className="text-yellow-500 hover:text-yellow-600 font-medium hover:underline transition-colors">
              Lupa kata sandi?
            </a>
          </motion.div>

          {/* Button */}
          <motion.button
            variants={item}
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full max-w-[280px] text-white rounded-full py-2 px-2 flex items-center shadow-lg transition-colors duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20'}`}
          >
            <div className={`${isLoading ? 'bg-gray-300' : 'bg-yellow-400/50'} rounded-full p-2 flex items-center justify-center`}>
              <ArrowRight className="w-5 h-5" />
            </div>

            <span className="flex-1 text-center font-semibold tracking-wide pr-8">
              {isLoading ? "MEMPROSES..." : "MASUK"}
            </span>
          </motion.button>

          {/* Register Link */}
          <motion.div variants={item} className="mt-4 text-center md:text-left text-xs text-gray-400">
            Belum punya akun?{" "}
            <Link to="/register" className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors">
              Buat akun baru
            </Link>
          </motion.div>

        </form>
      </motion.div>
    </motion.div>
  );
}