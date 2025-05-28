// src/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Pastikan path benar

const ProtectedRoute = () => {
  const { session, loading } = useAuth(); // Ambil `loading` dari context

  if (loading) {
    // Jika status autentikasi masih loading, tampilkan sesuatu
    return <div>Memuat autentikasi...</div>; // Ganti dengan komponen loading yang lebih baik
  }

  // Setelah loading selesai, baru cek sesi
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;