// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase/supabaseClient'; // Pastikan path ini benar

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getInitialSession = async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      };
  
      getInitialSession();
  
      // Dengarkan perubahan status autentikasi
      const { data: { subscription } } = supabase.auth.onAuthStateChange( // <--- UBAH CARA DESTRUCTURING DI SINI
        async (_event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (loading) {
              setLoading(false);
          }
        }
      );
  
      // Cleanup listener saat komponen di-unmount
      return () => {
        subscription?.unsubscribe(); // <--- PANGGIL UNSUBSCRIBE PADA 'subscription'
      };
    }, [loading]); // Pastikan dependency array sesuai (misalnya, [loading] atau [])
  
    const value = {
      session,
      user,
      loading,
      signUp: (data) => supabase.auth.signUp(data),
      signInWithPassword: (data) => supabase.auth.signInWithPassword(data),
      signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
      signOut: () => supabase.auth.signOut(),
    };
  
    // Anda bisa memilih salah satu dari dua return statement di bawah ini,
    // tergantung pendekatan yang Anda ambil dari diskusi sebelumnya:
  
    // Opsi 1: Render children secara kondisional (jika Anda masih menggunakan ini)
    // return (
    //   <AuthContext.Provider value={value}>
    //     {!loading && children}
    //   </AuthContext.Provider>
    // );
  
    // Opsi 2: Render children secara langsung (jika Anda beralih ke ini)
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
      throw new Error('useAuth must be used within an AuthProvider, and AuthProvider must supply a value.');
    }
    return context;
  };