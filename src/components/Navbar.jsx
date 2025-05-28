// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext'; // Sesuaikan path jika perlu

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login'); // Arahkan ke login setelah logout
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-indigo-200">
          WebBelajarKu
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Link to="/mulai-belajar" className="hover:text-indigo-200">Mulai Belajar</Link>
              <Link to="/lihat-nilai" className="hover:text-indigo-200">Lihat Nilai</Link>
              <Link to="/pengaturan" className="hover:text-indigo-200">Pengaturan</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
              <span className="text-sm">({user.email})</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;