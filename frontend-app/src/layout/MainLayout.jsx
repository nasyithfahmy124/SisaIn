import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow w-full max-w-9xl mx-auto px-4  ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}