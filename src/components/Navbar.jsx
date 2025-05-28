// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Sesuaikan path jika AuthContext tidak di ../auth/

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login'); // Arahkan ke login setelah logout
    } catch (error) {
      console.error("Logout error:", error);
      // Tambahkan penanganan error jika perlu
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex flex-wrap justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-indigo-200 mb-2 sm:mb-0">
          WebBelajarKu
        </Link>
        
        <div className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base">
          {/* Tautan yang akan selalu ada di Navbar ini (jika user sudah login) */}
          <Link to="/privacy-policy" className="hover:text-indigo-200">Kebijakan Privasi</Link>
          <Link to="/terms-of-service" className="hover:text-indigo-200">Persyaratan Layanan</Link>

          {/* Pembatas opsional jika ada link user */}
          {user && <span className="hidden sm:inline">|</span>}

          {/* Tautan khusus untuk pengguna yang sudah login */}
          {user && (
            <>
              <Link to="/mulai-belajar" className="hover:text-indigo-200">Mulai Belajar</Link>
              <Link to="/lihat-nilai" className="hover:text-indigo-200">Lihat Nilai</Link>
              <Link to="/pengaturan" className="hover:text-indigo-200">Pengaturan</Link>
            </>
          )}
        </div>

        {/* Tombol Logout untuk pengguna yang sudah login */}
        {user && (
          <div className="mt-2 sm:mt-0">
            <span className="mr-3 text-sm hidden md:inline">Halo, {user.email.split('@')[0]}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;