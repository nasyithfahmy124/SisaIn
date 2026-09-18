import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SplashScreen from "../pages/SplashScreen";

// Import halaman utama Sisain
import Beranda from "../pages/Beranda";
import Redistribusi from "../pages/redistribusi/Redistribusi";
import Maps from "../pages/maps/Maps";
import Profil from "../pages/profil/Profil";
import Pengaturan from "../pages/setting/Pengaturan";

function RouteTransitions() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        
        {/* Rute Awal & Autentikasi (Tanpa Navbar) */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rute Utama Sisain (Menggunakan Navbar dari MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/redistribusi" element={<Redistribusi />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Route>

        {/* Rute Fallback (404) */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </AnimatePresence>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
      <h1 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h1>
    </div>
  );
}

export default function AnimatedRoutes() {
  return (
    <Router>
      <RouteTransitions />
    </Router>
  );
}