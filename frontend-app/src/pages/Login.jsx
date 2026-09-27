import React, { useState } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth"; 
import { GoogleLogin } from '@react-oauth/google';

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
  const { login, loginWithGoogle, isLoading } = useAuth(); 

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await login(formData);
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk. Periksa kembali username dan kata sandi Anda.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg("");
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setErrorMsg(err.message || "Gagal memverifikasi akun Google.");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white flex flex-col md:flex-row w-full min-h-screen overflow-x-hidden relative"
    >
      <motion.div variants={image} className="relative w-full md:w-1/2 min-h-[30vh] md:min-h-screen flex items-center justify-center p-8 overflow-hidden bg-white shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#FFCC00] -translate-x-1/4 -translate-y-1/4 rounded-br-[100%] scale-125 origin-top-left" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-[400px] md:max-w-[600px]"
        >
          <img src="/src/assets/img/ilustrasi.png" alt="Ilustrasi Orang Bekerja" className="w-full h-auto drop-shadow-xl" />
        </motion.div>
      </motion.div>

      <motion.div variants={container} className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-white z-10 relative">
        <div className="w-full max-w-[360px] mx-auto">
          <motion.div variants={item} className="flex flex-col items-center mb-10">
            <img src="/src/assets/img/logo1.png" alt="Sisain Logo" className="w-64 md:w-72 h-auto object-contain mb-2" />
            <p className="text-gray-500 text-sm font-medium">Masuk ke akun Anda</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            {errorMsg && (
              <motion.div variants={item} className="bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium p-3 rounded-xl mb-5 text-center flex items-center justify-center gap-2">
                {errorMsg}
              </motion.div>
            )}

            <motion.div variants={item} className="flex items-center border-b-2 border-gray-200 py-2.5 mb-5 transition-colors duration-300 focus-within:border-[#FFCC00]">
              <User className="text-gray-400 w-5 h-5 mr-3 shrink-0" strokeWidth={2} />
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
                placeholder="Username" 
                className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-1 leading-tight focus:outline-none font-bold placeholder:font-medium placeholder:text-gray-400" 
              />
            </motion.div>

            <motion.div variants={item} className="flex items-center border-b-2 border-gray-200 py-2.5 mb-5 transition-colors duration-300 focus-within:border-[#FFCC00]">
              <Lock className="text-gray-400 w-5 h-5 mr-3 shrink-0" strokeWidth={2} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                placeholder="Kata Sandi" 
                className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-1 leading-tight focus:outline-none font-bold placeholder:font-medium placeholder:text-gray-400" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="text-gray-400 hover:text-[#FFCC00] transition-colors ml-2 outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-md p-1"
                aria-label="Tampilkan kata sandi"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </motion.div>

            <motion.div variants={item} className="flex items-center justify-between mb-8 text-[13px]">
              <label className="flex items-center text-gray-500 cursor-pointer hover:text-gray-800 transition-colors font-medium select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="mr-2 w-4 h-4 text-[#FFCC00] bg-gray-100 border-gray-300 rounded focus:ring-[#FFCC00] focus:ring-2" 
                />
                Ingat saya
              </label>

              <a href="#" className="text-[#FFCC00] hover:text-yellow-600 font-bold hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded">
                Lupa kata sandi?
              </a>
            </motion.div>

            <motion.div variants={item} className="flex justify-center w-full">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full max-w-[280px] rounded-full py-2 px-2 flex items-center justify-center transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                  isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-inner' 
                  : 'bg-[#FFCC00] text-gray-900 hover:bg-yellow-400 shadow-[0_6px_20px_rgba(255,204,0,0.3)] border-b-4 border-yellow-500 hover:border-yellow-500 active:border-t-4 active:border-b-0'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-1.5 w-full">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <span className="font-black text-sm tracking-wider">MEMPROSES</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-white/30 rounded-full p-2 flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4 text-gray-900" strokeWidth={3} />
                    </div>
                    <span className="flex-1 text-center font-black text-sm tracking-widest pr-8">
                      MASUK
                    </span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div variants={item} className="mt-8 mb-6 flex items-center justify-center w-full">
              <span className="h-px w-full bg-gray-200"></span>
              <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white">Atau</span>
              <span className="h-px w-full bg-gray-200"></span>
            </motion.div>

            <motion.div variants={item} className="flex justify-center w-full">
              <div className="w-full max-w-[280px] flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMsg('Gagal memuat popup Google.')}
                  useOneTap
                  shape="pill"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  width="280"
                />
              </div>
            </motion.div>

            <motion.div variants={item} className="mt-10 text-center text-[13px] text-gray-500 font-medium">
              Belum punya akun?{" "}
              <Link to="/register" className="text-[#FFCC00] hover:text-yellow-600 font-black transition-colors hover:underline outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded">
                Buat akun baru
              </Link>
            </motion.div>

          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}