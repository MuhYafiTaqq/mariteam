// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import komponen autentikasi dan layout
import { useAuth } from '../auth/AuthContext'; // Untuk PublicRoute
import ProtectedRoute from '../auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Import halaman-halaman publik (login, signup)
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';

// Import halaman-halaman fitur yang dilindungi
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ChooseSubjectPage from '../features/learning/pages/ChooseSubjectPage';
import AdventureMapPage from '../features/learning/pages/AdventureMapPage';
import QuizPage from '../features/learning/pages/QuizPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import ViewScoresPage from '../features/scores/pages/ViewScoresPage';

import Terms from '../pages/termsprivacy/terms';
import PrivacyPolicy from '../pages/termsprivacy/PrivacyPolicy';
// (Opsional) Import halaman jika rute tidak ditemukan
// import NotFoundPage from '../pages/NotFoundPage';

// Komponen wrapper untuk rute publik (agar pengguna yang sudah login tidak bisa akses halaman login/signup)
function PublicRoute({ children }) {
  const { session, loading } = useAuth(); // Ambil juga loading untuk penanganan yang lebih baik

  if (loading) {
    // Jika masih loading status autentikasi, tampilkan loading atau null
    // Ini mencegah redirect prematur sebelum sesi benar-benar terverifikasi
    return <div>Memuat...</div>; // Anda bisa mengganti ini dengan spinner atau null
  }

  if (session) {
    // Jika sudah ada sesi (sudah login), arahkan ke halaman utama (dashboard)
    return <Navigate to="/" replace />;
  }
  // Jika tidak ada sesi dan tidak loading, tampilkan children (LoginPage atau SignUpPage)
  return children;
}

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Rute Publik (Halaman Login dan Sign Up) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        } 
      />

      {/* Rute Terlindungi (Membutuhkan Login) - Menggunakan MainLayout */}
      <Route element={<ProtectedRoute />}> {/* Komponen ini akan memeriksa apakah user sudah login */}
        <Route element={<MainLayout />}> {/* Semua rute di dalam ini akan menggunakan MainLayout (Navbar, Footer) */}
          
          {/* Halaman utama setelah login */}
          <Route path="/" element={<DashboardPage />} />

          {/* Rute untuk Fitur Pembelajaran */}
          <Route path="/mulai-belajar" element={<ChooseSubjectPage />} />
          <Route path="/mulai-belajar/:subjectId" element={<AdventureMapPage />} />
          <Route path="/mulai-belajar/:subjectId/:levelId" element={<QuizPage />} />

          {/* Rute untuk Fitur Lain */}
          <Route path="/lihat-nilai" element={<ViewScoresPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />

          {/* Anda bisa menambahkan rute terlindungi lainnya di sini */}
          
        </Route>
      </Route>

      {/* Fallback untuk rute yang tidak ditemukan */}
      {/* Opsi 1: Redirect ke halaman utama (Dashboard) */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
      {/* Opsi 2: Tampilkan halaman NotFoundPage (jika Anda membuatnya) */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}


    </Routes>
  );
};

export default AppRoutes;