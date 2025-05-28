// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Sesuaikan path jika perlu

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet /> {/* Konten halaman akan dirender di sini */}
      </main>
      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
        © 2025 WebBelajarKu
      </footer>
    </div>
  );
};

export default MainLayout;