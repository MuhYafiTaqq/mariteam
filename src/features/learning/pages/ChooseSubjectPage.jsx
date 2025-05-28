// src/features/learning/pages/ChooseSubjectPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase/supabaseClient'; // Sesuaikan path

// Hapus atau komentari import data statis:
// import { subjects as staticSubjects } from '../data/subjects';

const ChooseSubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('subjects') // Nama tabel di Supabase
          .select('id, name, description'); // Kolom yang ingin diambil

        if (fetchError) {
          throw fetchError;
        }
        setSubjects(data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError(err.message || 'Gagal memuat mata pelajaran.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Memuat mata pelajaran...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pilih Pelajaran</h1>
      {subjects.length === 0 ? (
        <p className="text-gray-600">Belum ada pelajaran yang tersedia.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              to={`/mulai-belajar/${subject.id}`} // ID sekarang dari database (UUID)
              className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
            >
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{subject.name}</h2>
              <p className="font-normal text-gray-700">{subject.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChooseSubjectPage;