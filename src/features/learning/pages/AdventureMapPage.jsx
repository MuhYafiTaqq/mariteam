// src/features/learning/pages/AdventureMapPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/supabaseClient'; // Sesuaikan path
import { useAuth } from '../../../auth/AuthContext'; // Untuk mendapatkan user ID

// Hapus atau komentari import data statis:
// import { subjects as staticSubjects } from '../data/subjects';
// import { getLevelsForSubject as getStaticLevelsForSubject } from '../data/levels';

const AdventureMapPage = () => {
  const { subjectId } = useParams();
  const { user } = useAuth(); // Dapatkan user yang sedang login
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdventureData = useCallback(async () => {
    if (!user || !subjectId) return; // Pastikan user dan subjectId ada

    setLoading(true);
    setError(null);
    try {
      // 1. Ambil detail subject
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id, name, description')
        .eq('id', subjectId)
        .single(); // .single() karena kita mencari satu subject

      if (subjectError) throw subjectError;
      if (!subjectData) throw new Error('Mata pelajaran tidak ditemukan.');
      setSubject(subjectData);

      // 2. Ambil semua level untuk subject ini, diurutkan berdasarkan level_number
      const { data: levelsData, error: levelsError } = await supabase
        .from('levels')
        .select('id, level_number, name')
        .eq('subject_id', subjectId)
        .order('level_number', { ascending: true });

      if (levelsError) throw levelsError;

      // 3. Ambil progres pengguna untuk level-level ini
      const levelIds = levelsData.map(l => l.id);
      const { data: progressData, error: progressError } = await supabase
        .from('user_level_progress')
        .select('level_id, status')
        .eq('user_id', user.id)
        .in('level_id', levelIds);

      if (progressError) throw progressError;

      // 4. Gabungkan data level dengan progres pengguna untuk menentukan status 'unlocked'
      // Logika 'unlocked' default: Level 1 selalu unlocked.
      // Level berikutnya unlocked jika level sebelumnya 'completed'.
      // Atau, jika ada entri di user_level_progress dengan status 'unlocked' atau 'completed'.
      const enrichedLevels = levelsData.map((level, index) => {
        const userProgress = progressData?.find(p => p.level_id === level.id);
        let isUnlocked = false;

        if (level.level_number === 1) { // Level pertama selalu unlocked
          isUnlocked = true;
        } else if (userProgress?.status === 'unlocked' || userProgress?.status === 'completed') {
          isUnlocked = true;
        } else {
          // Cek apakah level sebelumnya sudah 'completed'
          const prevLevelData = levelsData[index - 1];
          if (prevLevelData) {
            const prevLevelProgress = progressData?.find(p => p.level_id === prevLevelData.id);
            if (prevLevelProgress?.status === 'completed') {
              isUnlocked = true;
            }
          }
        }
        
        // Jika level unlocked dan belum ada di progress, kita mungkin mau buatkan entri 'unlocked'
        // (Ini bisa dihandle saat menyimpan progress atau di sini sebagai side effect)
        // Untuk sekarang, kita hanya set flag `isUnlocked`
        return { ...level, unlocked: isUnlocked, status: userProgress?.status };
      });

      setLevels(enrichedLevels);

    } catch (err) {
      console.error("Error fetching adventure data:", err);
      setError(err.message || 'Gagal memuat data petualangan.');
      if (err.message === 'Mata pelajaran tidak ditemukan.') {
        // navigate('/mulai-belajar'); // Opsional: redirect jika subject tidak valid
      }
    } finally {
      setLoading(false);
    }
  }, [user, subjectId, navigate]); // navigate ditambahkan jika digunakan untuk redirect

  useEffect(() => {
    fetchAdventureData();
  }, [fetchAdventureData]);

  if (loading) return <div className="text-center py-10">Memuat data petualangan...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!subject) return <div className="text-center py-10">Mata pelajaran tidak ditemukan.</div>;

  return (
    <div>
      <Link to="/mulai-belajar" className="text-indigo-600 hover:underline mb-4 inline-block">&larr; Kembali ke Pilih Pelajaran</Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Petualangan: {subject.name}</h1>
      <p className="text-gray-600 mb-8">{subject.description}</p>

      <div className="flex flex-col items-center space-y-4">
        {levels.map((level, index) => (
          <React.Fragment key={level.id}>
            <Link
              to={level.unlocked ? `/mulai-belajar/${subjectId}/${level.id}` : '#'}
              className={`w-full md:w-1/2 p-6 rounded-lg shadow-lg text-center font-semibold
                ${level.unlocked
                  ? level.status === 'completed'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' // Warna untuk yang sudah selesai
                    : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              onClick={(e) => !level.unlocked && e.preventDefault()}
              aria-disabled={!level.unlocked}
            >
              Level {level.level_number}: {level.name}
              {level.status === 'completed' && <span className="ml-2 text-xs">(Selesai)</span>}
              {!level.unlocked && level.status !== 'completed' && <span className="ml-2 text-xs">(Terkunci)</span>}
            </Link>
            {index < levels.length - 1 && (
              <div className="h-8 w-1 bg-gray-400"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AdventureMapPage;