import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SplashScreen from "../pages/SplashScreen";
import Beranda from "../pages/Beranda";

const Upload = () => <div className="p-8 text-2xl font-bold text-gray-800">Halaman Upload</div>;
const Wallet = () => <div className="p-8 text-2xl font-bold text-gray-800">Halaman Wallet</div>;
const Impact = () => <div className="p-8 text-2xl font-bold text-gray-800">Halaman Impact</div>;
const Statistics = () => <div className="p-8 text-2xl font-bold text-gray-800">Halaman Statistics</div>;

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
          <Route path="/upload" element={<Upload />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>

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