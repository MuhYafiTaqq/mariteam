// src/pages/LoginPage.jsx (atau src/auth/LoginPage.jsx)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Sesuaikan path

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithPassword, signInWithGoogle, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/'); // Jika sudah ada sesi, arahkan ke home
    }
  }, [session, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: signInError } = await signInWithPassword({ email, password });
      if (signInError) {
        throw signInError;
      }
      navigate('/'); // Arahkan ke home setelah login berhasil
    } catch (err) {
      setError(err.message || 'Email atau password salah.');
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true); // Bisa juga tidak, karena akan ada redirect
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        throw googleError;
      }
      // Pengguna akan diarahkan oleh Supabase ke Google, lalu kembali ke aplikasi Anda
      // useEffect di atas akan menangani redirect ke home jika sesi terbentuk
    } catch (err) {
      setError(err.message || 'Gagal login dengan Google.');
      console.error("Google sign in error:", err);
      setLoading(false);
    }
    // setLoading(false) mungkin tidak tercapai jika redirect berhasil
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login ke Akun Anda
          </h2>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          {/* ... form input email dan password (mirip SignUpPage) ... */}
          <div>
            <label htmlFor="email-address" className="sr-only">Alamat Email</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Alamat Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Login dengan Google</span>
                {/* Anda bisa menambahkan ikon Google di sini */}
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.419 2.865 8.166 6.738 9.464.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.602-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.465-1.11-1.465-.909-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.891 1.529 2.334 1.087 2.902.832.091-.647.349-1.087.635-1.337-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.268.098-2.645 0 0 .84-.269 2.75 1.025A9.548 9.548 0 0110 4.837c.853 0 1.718.114 2.513.338 1.91-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.392.1 2.645.64.702 1.027 1.595 1.027 2.682 0 3.842-2.338 4.687-4.565 4.935.358.307.679.917.679 1.848 0 1.333-.012 2.41-.012 2.734 0 .267.18.577.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                Login dengan Google
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;