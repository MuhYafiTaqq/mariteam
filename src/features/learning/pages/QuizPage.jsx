// src/features/learning/pages/QuizPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/supabaseClient'; // Sesuaikan path
import { useAuth } from '../../../auth/AuthContext'; // Untuk user.id

const QuizPage = () => {
  const { subjectId, levelId } = useParams();
  const { user } = useAuth(); // Dapatkan user yang sedang login
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [levelName, setLevelName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finalScore, setFinalScore] = useState(0); // State untuk menyimpan skor akhir

  const fetchQuizData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: levelData, error: levelError } = await supabase
        .from('levels')
        .select('name, level_number')
        .eq('id', levelId)
        .single();

      if (levelError) throw levelError;
      if (!levelData) throw new Error('Level tidak ditemukan.');
      setLevelName(levelData.name);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id, text, options, correct_answer')
        .eq('level_id', levelId)
        .order('order_number', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
    } catch (err) {
      console.error("Error fetching quiz data:", err);
      setError(err.message || 'Gagal memuat soal.');
    } finally {
      setLoading(false);
    }
  }, [levelId]); // subjectId dan navigate tidak selalu dibutuhkan di dependency fetchQuizData kecuali ada logic redirect di dalamnya

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Fungsi untuk menyimpan progres dan membuka level berikutnya
  const saveProgressAndUnlockNext = async (currentLevelId, calculatedScore) => {
    if (!user) {
        console.warn("User not logged in, cannot save progress.");
        return;
    }

    setLoading(true); // Tunjukkan loading saat menyimpan
    try {
      // 1. Tandai level saat ini sebagai 'completed' dan simpan skornya
      console.log(`Saving progress for user ${user.id}, level ${currentLevelId}, score ${calculatedScore}`);
      const { error: completeError } = await supabase
        .from('user_level_progress')
        .upsert({
          user_id: user.id,
          level_id: currentLevelId,
          status: 'completed',
          score: calculatedScore,
          completed_at: new Date().toISOString(),
          last_attempted_at: new Date().toISOString()
        }, {
          onConflict: 'user_id, level_id'
        });

      if (completeError) {
        console.error('Error updating current level status:', completeError);
        setError('Gagal menyimpan progres level saat ini.'); // Tampilkan error ke user
        // return; // Mungkin tidak perlu return jika ingin tetap mencoba unlock
      } else {
        console.log('Current level progress saved.');
      }

      // 2. Tentukan ID level berikutnya
      const { data: allLevelsInSubject, error: fetchLevelsError } = await supabase
        .from('levels')
        .select('id, level_number')
        .eq('subject_id', subjectId) // subjectId dari useParams
        .order('level_number', { ascending: true });

      if (fetchLevelsError || !allLevelsInSubject) {
        console.error('Error fetching levels to find next one:', fetchLevelsError);
        // setError('Gagal menemukan informasi level berikutnya.'); // Opsional
        return;
      }

      const currentLevelInList = allLevelsInSubject.find(l => l.id === currentLevelId);
      if (!currentLevelInList) {
        console.error('Current level not found in subject list.');
        return;
      }

      const nextLevelNumber = currentLevelInList.level_number + 1;
      const nextLevel = allLevelsInSubject.find(l => l.level_number === nextLevelNumber);

      if (nextLevel) {
        console.log(`Next level to unlock: ${nextLevel.id} (Number: ${nextLevel.number})`);
        // 3. Jika ada level berikutnya, buka (unlock) level tersebut
        // Cek dulu statusnya agar tidak menimpa status 'completed'
        const { data: nextLevelProgressData, error: nextLevelProgressError } = await supabase
            .from('user_level_progress')
            .select('status')
            .eq('user_id', user.id)
            .eq('level_id', nextLevel.id)
            .single(); // Gunakan single karena kita hanya butuh satu baris atau null

        // PGRST116 error code means " exactamente una fila esperada pero ninguna fue devuelta" (no row found), which is OK for new progress.
        if (nextLevelProgressError && nextLevelProgressError.code !== 'PGRST116') {
            console.error('Error checking next level progress:', nextLevelProgressError);
            // setError('Gagal memeriksa progres level berikutnya.'); // Opsional
        }
        
        // Hanya unlock jika belum pernah ada progress atau statusnya masih 'locked'
        if (!nextLevelProgressData || nextLevelProgressData.status === 'locked') {
            console.log(`Unlocking level: ${nextLevel.id}`);
            const { error: unlockError } = await supabase
              .from('user_level_progress')
              .upsert({
                user_id: user.id,
                level_id: nextLevel.id,
                status: 'unlocked',
                unlocked_at: new Date().toISOString(),
                last_attempted_at: new Date().toISOString()
              }, {
                onConflict: 'user_id, level_id'
              });

            if (unlockError) {
              console.error('Error unlocking next level:', unlockError);
              // setError('Gagal membuka level berikutnya.'); // Opsional
            } else {
              console.log(`Level ${nextLevel.id} unlocked!`);
            }
        } else {
            console.log(`Next level ${nextLevel.id} is already '${nextLevelProgressData.status}'. No need to change to 'unlocked'.`);
        }
      } else {
        console.log('This is the last level or no next level found for this subject.');
        // Tampilkan pesan "Selamat, Anda telah menyelesaikan semua level di pelajaran ini!"
        // Mungkin bisa set state khusus untuk ini.
      }
    } catch (error) {
      console.error('An unexpected error occurred while saving progress:', error);
      setError('Terjadi kesalahan tidak terduga saat menyimpan progres.');
    } finally {
        setLoading(false); // Selesai loading setelah semua proses simpan
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Soal terakhir, hitung skor
      let calculatedScore = 0;
      questions.forEach(q => {
        if (userAnswers[q.id] === q.correct_answer) {
          calculatedScore++;
        }
      });
      setFinalScore(calculatedScore); // Simpan skor ke state untuk ditampilkan
      
      // Panggil fungsi untuk menyimpan progres dan membuka level berikutnya
      // Kondisi kelulusan bisa ditambahkan di sini sebelum memanggil, misal:
      // if (calculatedScore >= (questions.length / 2)) { ... }
      saveProgressAndUnlockNext(levelId, calculatedScore);
      
      setShowResults(true); // Tampilkan hasil setelah proses simpan dimulai (atau selesai jika Anda await)
    }
  };

  if (loading && questions.length === 0 && !showResults) { // Loading awal untuk data soal
    return <div className="text-center py-10">Memuat soal...</div>;
  }
  if (error) { // Error saat fetch data soal
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }
  if (questions.length === 0 && !showResults && !loading) { // Tidak ada soal setelah selesai loading
    return (
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <p className="text-gray-700 mb-4">Tidak ada soal untuk level ini atau level tidak valid.</p>
            <button
                onClick={() => navigate(`/mulai-belajar/${subjectId}`)}
                className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
                Kembali ke Peta Petualangan
            </button>
        </div>
    );
  }

  if (showResults) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Hasil Level: {levelName}</h2>
        {loading && <p className="text-lg mb-2">Menyimpan progres...</p>}
        {!loading && error && <p className="text-red-500 text-sm mb-2">Error saat menyimpan: {error}</p>}
        <p className="text-lg mb-2">Anda Benar: {finalScore} dari {questions.length} soal.</p>
        <button
            onClick={() => navigate(`/mulai-belajar/${subjectId}`)}
            className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading} // Disable tombol saat sedang menyimpan
        >
            Kembali ke Peta Petualangan
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Link to={`/mulai-belajar/${subjectId}`} className="text-indigo-600 hover:underline mb-4 inline-block">&larr; Kembali ke Peta Petualangan</Link>
      <h2 className="text-2xl font-bold mb-1">{levelName} - Soal {currentQuestionIndex + 1} dari {questions.length}</h2>
      {currentQuestion ? (
        <>
          <p className="text-lg text-gray-700 mb-6">{currentQuestion.text}</p>
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className={`block w-full text-left p-3 rounded border
                            ${userAnswers[currentQuestion.id] === option
                              ? 'bg-indigo-200 border-indigo-400 ring-2 ring-indigo-500'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
                            }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={!userAnswers[currentQuestion.id]}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Lanjut' : 'Selesai & Lihat Hasil'}
          </button>
        </>
      ) : (
        // Ini seharusnya tidak terjadi jika loading dan error sudah ditangani di atas
        <p>Soal tidak ditemukan atau sedang memuat...</p>
      )}
    </div>
  );
};

export default QuizPage;