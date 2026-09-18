import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

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
  hidden: { opacity: 0, scale: 0.92, x: 30 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.9, ease } },
  exit: { opacity: 0, scale: 0.96, x: 25, transition: { duration: 0.4, ease } },
};

export default function Register() {
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi frontend
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
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 
                           (err.message || "Terjadi kesalahan saat mendaftar. Username mungkin sudah terpakai.");
      setErrorMsg(errorMessage);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white flex flex-col md:flex-row-reverse w-full h-screen overflow-hidden relative overflow-y-auto"
    >

      <motion.div variants={image} className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[500px] flex items-center justify-center p-8 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-full h-full bg-yellow-400 translate-x-1/4 -translate-y-1/4 rounded-bl-[100%] scale-125 origin-top-right" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-[500px] md:max-w-[700px]"
        >
          <img src="/src/assets/img/ilustrasi.png" alt="Ilustrasi Mendaftar Sisain" className="w-full h-auto drop-shadow-xl" />
        </motion.div>
      </motion.div>

      {/* Form */}
      <motion.div variants={container} className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white z-10">

        <motion.div variants={item} className="flex flex-col items-center md:items-start mb-8">
          <img src="/src/assets/img/logo1.png" alt="Sisain" className="w-64 h-auto object-contain" />
          <p className="text-gray-500 text-sm font-medium mt-2">Daftar akun baru Sisain</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto md:mx-0 ">
          
          {errorMsg && (
            <motion.p variants={item} className="text-red-500 text-sm font-medium mb-4 text-center md:text-left">
              {errorMsg}
            </motion.p>
          )}

          <motion.div variants={item} className="flex items-center border-b border-gray-300 py-2 mb-5 transition-colors duration-300 focus-within:border-yellow-500">
            <User className="text-gray-400 w-5 h-5 mr-3 transition-colors duration-300 group-focus:text-yellow-500" strokeWidth={1.5} />
            <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Username" className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none font-medium" />
          </motion.div>

          <motion.div variants={item} className="flex items-center border-b border-gray-300 py-2 mb-5 transition-colors duration-300 focus-within:border-yellow-500">
            <Mail className="text-gray-400 w-5 h-5 mr-3" strokeWidth={1.5} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none font-medium" />
          </motion.div>

          <motion.div variants={item} className="flex items-center border-b border-gray-300 py-2 mb-5 transition-colors duration-300 focus-within:border-yellow-500">
            <Lock className="text-gray-400 w-5 h-5 mr-3" strokeWidth={1.5} />
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Kata Sandi" className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none font-medium" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-yellow-500 transition-colors ml-2">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>

          <motion.div variants={item} className="flex items-center border-b border-gray-300 py-2 mb-8 transition-colors duration-300 focus-within:border-yellow-500">
            <Lock className="text-gray-400 w-5 h-5 mr-3" strokeWidth={1.5} />
            <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Ulangi Kata Sandi" className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none font-medium" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-yellow-500 transition-colors ml-2">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>

          <motion.button
            variants={item}
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full max-w-[280px] text-white rounded-full py-2 px-2 flex items-center shadow-lg transition-colors duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20'}`}
          >
            <div className={`${isLoading ? 'bg-gray-300' : 'bg-yellow-600/50'} rounded-full p-2 flex items-center justify-center`}>
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="flex-1 text-center font-semibold tracking-wide pr-8">
              {isLoading ? "MEMPROSES..." : "DAFTAR"}
            </span>
          </motion.button>

          <motion.div variants={item} className="mt-6 text-center md:text-left text-sm text-gray-500 font-medium">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-yellow-500 hover:text-yellow-600 hover:underline transition-colors">
              Masuk di sini
            </Link>
          </motion.div>

        </form>
      </motion.div>
    </motion.div>
  );
}