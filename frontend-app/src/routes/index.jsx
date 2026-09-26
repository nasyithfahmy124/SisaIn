import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider } from "@react-oauth/google";

import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SplashScreen from "../pages/SplashScreen";

import Beranda from "../pages/Beranda";
import Redistribusi from "../pages/redistribusi/Redistribusi";
import Maps from "../pages/maps/Maps";
import Profil from "../pages/profil/Profil";
import Pengaturan from "../pages/setting/Pengaturan";
import TambahMaterial from "../pages/TambahMaterial/Index";

function RouteTransitions() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<MainLayout />}>
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/redistribusi" element={<Redistribusi />} />
          <Route path="/redistribusi/material/new" element={<TambahMaterial />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F7] text-gray-900">
      <h1 className="text-4xl font-black mb-2 text-[#FFCC00]">404</h1>
      <p className="text-sm font-bold text-gray-500">Halaman Tidak Ditemukan</p>
    </div>
  );
}

export default function AnimatedRoutes() {
  return (
    <GoogleOAuthProvider clientId="497788560869-tr6847ke129tnbh6ao5s59r61sflhir2.apps.googleusercontent.com">
      <Router>
        <RouteTransitions />
      </Router>
    </GoogleOAuthProvider>
  );
}