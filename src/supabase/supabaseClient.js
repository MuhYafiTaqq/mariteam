// src/supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// GANTI CARA PENGAMBILAN VARIABEL JIKA SEBELUMNYA MENGGUNAKAN process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Supabase URL is required. Make sure VITE_SUPABASE_URL is set in your environment variables.");
  throw new Error("Supabase URL is required."); // Atau handle error dengan cara lain
}
if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is required. Make sure VITE_SUPABASE_ANON_KEY is set in your environment variables.");
  throw new Error("Supabase Anon Key is required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);