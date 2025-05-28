// src/features/dashboard/pages/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext'; // Sesuaikan path

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Selamat Datang, {user?.email}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Siap untuk memulai petualangan belajarmu?
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/mulai-belajar" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-6 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-150 ease-in-out">
          <h2 className="text-2xl mb-2">Mulai Belajar</h2>
          <p>Pilih pelajaran dan taklukkan levelnya!</p>
        </Link>
        <Link to="/lihat-nilai" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-150 ease-in-out">
          <h2 className="text-2xl mb-2">Lihat Nilai</h2>
          <p>Cek progres dan pencapaianmu.</p>
        </Link>
        <Link to="/pengaturan" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-6 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-150 ease-in-out">
          <h2 className="text-2xl mb-2">Pengaturan</h2>
          <p>Atur preferensi akunmu.</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;