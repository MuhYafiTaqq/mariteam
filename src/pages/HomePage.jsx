// src/pages/HomePage.jsx
import React from 'react';
import { useAuth } from '../auth/authContext'; // Sesuaikan path
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, signOut, session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      // AuthContext akan mendeteksi perubahan sesi dan ProtectedRoute akan mengarahkan
      // navigate('/'); // Bisa juga langsung navigate ke login jika diperlukan
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!session) {
    // Ini sebagai fallback, seharusnya sudah ditangani ProtectedRoute
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Selamat Datang!
        </h1>
        {user && (
          <p className="text-gray-700 mb-6">
            Anda login sebagai: <span className="font-semibold">{user.email}</span>
          </p>
        )}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      {/* <div className="mt-4 p-4 bg-gray-200 rounded max-w-xl overflow-auto">
        <h3 className="text-lg font-semibold">Session Data (Debug):</h3>
        <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default HomePage;