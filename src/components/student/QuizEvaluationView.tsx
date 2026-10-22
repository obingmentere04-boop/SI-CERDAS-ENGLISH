import React, { useState, useEffect } from 'react';
import { Quiz, QuizAttempt, Student, QuizQuestion } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  AlertCircle, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  PenTool,
  ListOrdered,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuizEvaluationViewProps {
  quizzes: Quiz[];
  student: Student;
  onUpdateStudentQuizScore: (quizId: string, score: number, category: string) => void;
  onSaveQuizAttempt: (attempt: QuizAttempt) => void;
  initialQuizId?: string;
}

export const QuizEvaluationView: React.FC<QuizEvaluationViewProps> = ({
  quizzes,
  student,
  onUpdateStudentQuizScore,
  onSaveQuizAttempt,
  initialQuizId,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(
    initialQuizId || quizzes[0]?.id || ''
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(true);

  const activeQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];
  const questions = activeQuiz?.questions || [];
  const currentQuestion: QuizQuestion | undefined = questions[currentQuestionIndex];

  // Initialize timer when quiz changes
  useEffect(() => {
    if (activeQuiz) {
      setTimeLeftSeconds(activeQuiz.durationMinutes * 60);
      setIsTimerRunning(true);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setIsQuizCompleted(false);
      setFinalScore(null);
    }
  }, [selectedQuizId]);

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning || isQuizCompleted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isQuizCompleted, timeLeftSeconds]);

  const handleAnswerChange = (qId: string, answer: any) => {
    if (isQuizCompleted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleFinishQuiz = () => {
    setIsTimerRunning(false);
    setIsQuizCompleted(true);

    // Calculate score based on weights
    let totalScore = 0;
    let maxTotal = 0;

    questions.forEach((q) => {
      maxTotal += q.points;
      const ans = userAnswers[q.id];

      if (q.type === 'mc' || q.type === 'dialog') {
        if (ans !== undefined && Number(ans) === Number(q.correctAnswer)) {
          totalScore += q.points;
        }
      } else if (q.type === 'tf') {
        if (ans !== undefined && Boolean(ans) === Boolean(q.correctAnswer)) {
          totalScore += q.points;
        }
      } else if (q.type === 'fill' || q.type === 'unscramble') {
        const cleanedUser = String(ans || '').trim().toLowerCase();
        const cleanedCorrect = String(q.correctAnswer).trim().toLowerCase();
        if (cleanedUser === cleanedCorrect) {
          totalScore += q.points;
        }
      } else if (q.type === 'match') {
        if (ans && String(ans).trim() === String(q.correctAnswer).trim()) {
          totalScore += q.points;
        }
      } else if (q.type === 'essay') {
        const studentAns = String(ans || '').trim();
        const wordCount = studentAns.split(/\s+/).filter(Boolean).length;
        const targetWords = q.minWords || 15;
        if (wordCount >= targetWords) {
          totalScore += q.points;
        } else if (wordCount >= 5) {
          totalScore += Math.round(q.points * 0.75);
        } else if (wordCount > 0) {
          totalScore += Math.round(q.points * 0.4);
        }
      }
    });

    const scaledPercentage = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;
    setFinalScore(scaledPercentage);

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentId: student.id,
      studentName: student.name,
      studentGrade: student.grade,
      score: scaledPercentage,
      maxScore: 100,
      percentage: scaledPercentage,
      answers: userAnswers,
      completedAt: new Date().toISOString(),
      feedback:
        scaledPercentage >= 80
          ? 'Hasil evaluasi sangat memuaskan!'
          : scaledPercentage >= 60
          ? 'Hasil evaluasi cukup baik, terus tingkatkan latihan.'
          : 'Perlu penguatan konsep dan latihan ulang.',
    };

    onSaveQuizAttempt(attempt);
    onUpdateStudentQuizScore(activeQuiz.id, scaledPercentage, activeQuiz.category);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kuis &amp; Evaluasi Pembelajaran</h1>
          <p className="text-xs text-gray-700">
            Uji pemahaman dengan Pre-Test (Evaluasi Awal), Post-Test (Evaluasi Akhir), dan Kuis Harian
          </p>
        </div>

        {/* Quiz selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Pilih Kuis:</label>
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:ring-2 focus:ring-indigo-500"
          >
            {quizzes.map((qz) => (
              <option key={qz.id} value={qz.id}>
                {qz.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeQuiz && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-6">
          {/* Top Status Bar: Timer & Progress */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeQuiz.category === 'pre-test'
                  ? 'Evaluasi Awal (Pre-Test)'
                  : activeQuiz.category === 'post-test'
                  ? 'Evaluasi Akhir (Post-Test)'
                  : 'Evaluasi Harian'}
              </span>
              <span className="text-gray-700 font-semibold">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono font-bold">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span
                className={timeLeftSeconds < 120 ? 'text-rose-600 animate-pulse' : 'text-gray-800'}
              >
                Sisa Waktu: {formatTimer(timeLeftSeconds)}
              </span>
            </div>
          </div>

          {!isQuizCompleted ? (
            /* Active Question Card */
            currentQuestion && (
              <div className="space-y-5">
                {/* Navigasi Nomor Soal (1 s.d. 50) */}
                <div className="bg-gray-50/90 rounded-xl border border-gray-200 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowQuestionGrid(!showQuestionGrid)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-indigo-600 transition-colors"
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Lembar Jawaban: Soal 1 s.d. {questions.length}</span>
                      {showQuestionGrid ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
                    </button>
                    <div className="text-[11px] text-gray-700 font-medium">
                      Status Terjawab:{' '}
                      <strong className="text-emerald-700 font-bold">
                        {questions.filter((q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== '').length}
                      </strong>{' '}
                      / {questions.length} Nomor
                    </div>
                  </div>

                  {showQuestionGrid && (
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1 max-h-48 overflow-y-auto pr-1">
                      {questions.map((q, idx) => {
                        const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== '';
                        const isCurrent = idx === currentQuestionIndex;
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs'
                                : isAnswered
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                            title={`Nomor ${idx + 1} (${q.type === 'essay' ? 'Essai' : 'Pilihan Ganda'})${isAnswered ? ' - Sudah Dijawab' : ' - Belum Dijawab'}`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {currentQuestion.type === 'essay' ? 'Soal Essai (Uraian)' : 'Soal Pilihan Ganda'} &bull; {currentQuestion.points} Poin
                    </span>
                    <span className="text-[11px] text-gray-700 font-medium">
                      Nomor {currentQuestionIndex + 1} dari {questions.length}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed whitespace-pre-line">
                    {currentQuestionIndex + 1}. {currentQuestion.questionText}
                  </h2>
                </div>

                {/* 1. Multiple Choice / Dialog */}
                {(currentQuestion.type === 'mc' || currentQuestion.type === 'dialog') &&
                  currentQuestion.options && (
                    <div className="space-y-2">
                      {currentQuestion.options.map((opt, oIdx) => {
                        const isSelected = userAnswers[currentQuestion.id] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerChange(currentQuestion.id, oIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                                : 'bg-gray-50 hover:bg-indigo-50/60 text-gray-800 border-gray-200'
                            }`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                {/* 2. True / False */}
                {currentQuestion.type === 'tf' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, true)}
                      className={`p-4 rounded-xl border text-sm font-bold transition-all text-center ${
                        userAnswers[currentQuestion.id] === true
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-emerald-50'
                      }`}
                    >
                      Benar (True)
                    </button>
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, false)}
                      className={`p-4 rounded-xl border text-sm font-bold transition-all text-center ${
                        userAnswers[currentQuestion.id] === false
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-rose-50'
                      }`}
                    >
                      Salah (False)
                    </button>
                  </div>
                )}

                {/* 3. Fill in the blank / Unscramble text */}
                {(currentQuestion.type === 'fill' || currentQuestion.type === 'unscramble') && (
                  <div className="space-y-2">
                    {currentQuestion.scrambledWords && (
                      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-semibold flex items-center gap-2">
                        <span>Kata yang disediakan:</span>
                        <div className="flex flex-wrap gap-1">
                          {currentQuestion.scrambledWords.map((w, idx) => (
                            <span
                              key={idx}
                              onClick={() => {
                                const cur = userAnswers[currentQuestion.id] || '';
                                handleAnswerChange(
                                  currentQuestion.id,
                                  cur ? `${cur} ${w}` : w
                                );
                              }}
                              className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-indigo-700 cursor-pointer hover:bg-indigo-100"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <input
                      type="text"
                      value={userAnswers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Ketik jawabanmu di sini..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* 4. Matching */}
                {currentQuestion.type === 'match' && currentQuestion.matchingPairs && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                    <p className="text-gray-700">
                      Klik pasangkan atau konfirmasi penjodohan berikut:
                    </p>
                    <div className="space-y-1.5 font-medium">
                      {currentQuestion.matchingPairs.map((pair, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200"
                        >
                          <span className="font-bold text-indigo-700">{pair.left}</span>
                          <span className="text-gray-600">&harr;</span>
                          <span className="text-gray-800">{pair.right}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, currentQuestion.correctAnswer)}
                      className={`w-full py-2 rounded-lg border text-xs font-bold ${
                        userAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      {userAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                        ? 'Pasangan Dikonfirmasi'
                        : 'Konfirmasi Penjodohan di Atas'}
                    </button>
                  </div>
                )}

                {/* 5. Essay Question Input */}
                {currentQuestion.type === 'essay' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5 shadow-2xs">
                      <div className="font-bold flex items-center gap-1.5 text-amber-900">
                        <PenTool className="w-4 h-4 text-amber-700" />
                        <span>Panduan Pengerjaan Soal Essai:</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Tuliskan jawaban dalam kalimat Bahasa Inggris yang baik, terstruktur, dan percaya diri.
                      </p>
                      {currentQuestion.rubricCriteria && currentQuestion.rubricCriteria.length > 0 && (
                        <div className="pt-1">
                          <span className="font-bold text-[10px] text-amber-900 block mb-1">Rubrik &amp; Kriteria Penilaian Guru:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentQuestion.rubricCriteria.map((rc, rIdx) => (
                              <span key={rIdx} className="px-2 py-0.5 rounded-md bg-white text-amber-900 text-[10px] font-semibold border border-amber-200 shadow-2xs">
                                &bull; {rc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-800">
                        Tuliskan Jawaban Essaimu:
                      </label>
                      <textarea
                        rows={6}
                        value={userAnswers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Type your complete English essay answer here..."
                        className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed shadow-2xs"
                      />
                      <div className="flex justify-between items-center text-[11px] text-gray-700 px-1">
                        <span>
                          Jumlah kata saat ini:{' '}
                          <strong className="text-indigo-700 font-bold">
                            {(userAnswers[currentQuestion.id] || '').trim().split(/\s+/).filter(Boolean).length}
                          </strong>{' '}
                          kata
                        </span>
                        <span className="text-gray-700 font-medium">
                          Rekomendasi minimal: <strong>{currentQuestion.minWords || 20}</strong> kata
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 disabled:opacity-30"
                  >
                    &larr; Soal Sebelumnya
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(questions.length - 1, prev + 1)
                        )
                      }
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs"
                    >
                      <span>Soal Berikutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                    >
                      Selesai &amp; Kirim Jawaban
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in duration-150">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Evaluasi Selesai
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                  Nilai Akhirmu: {finalScore} / 100
                </h2>
                <p className="text-xs text-gray-700 mt-1">
                  {finalScore! >= 80
                    ? 'Luar biasa! Pemahaman materimu sangat baik.'
                    : finalScore! >= 60
                    ? 'Bagus! Kamu sudah memahami sebagian besar materi.'
                    : 'Tetap semangat! Ulangi kembali materi dan latihan interaktif.'}
                </p>
              </div>

              {/* Answer Key Release Condition Notice */}
              {activeQuiz.releaseAnswerKey ? (
                <div className="text-left bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                  <div className="text-xs font-bold uppercase text-gray-700 border-b border-gray-200 pb-1">
                    Pembahasan &amp; Kunci Jawaban (Diizinkan oleh Guru):
                  </div>
                  <div className="space-y-3 text-xs">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-gray-900 text-xs">
                            {idx + 1}. {q.questionText}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700 shrink-0">
                            {q.type === 'essay' ? 'Essai' : 'Pilihan Ganda'} &bull; {q.points} Poin
                          </span>
                        </div>

                        {q.type === 'essay' ? (
                          <div className="space-y-1.5 text-[11px] pt-1">
                            <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-indigo-950">
                              <span className="font-bold block text-indigo-900">Jawaban Siswa:</span>
                              <p className="mt-0.5 whitespace-pre-line italic">
                                {userAnswers[q.id] ? `"${userAnswers[q.id]}"` : '(Tidak dijawab / kosong)'}
                              </p>
                              <div className="text-[10px] text-indigo-700 mt-1">
                                Jumlah kata: {(userAnswers[q.id] || '').trim().split(/\s+/).filter(Boolean).length} kata
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                              <span className="font-bold block text-emerald-900">Contoh Model Jawaban Ideal:</span>
                              <p className="mt-0.5 whitespace-pre-line leading-relaxed font-sans">
                                {q.sampleAnswer || String(q.correctAnswer)}
                              </p>
                            </div>

                            {q.rubricCriteria && q.rubricCriteria.length > 0 && (
                              <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-950">
                                <span className="font-bold text-[10px] block text-amber-900">Kriteria Rubrik Penilaian:</span>
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {q.rubricCriteria.map((rc, rIdx) => (
                                    <span key={rIdx} className="px-1.5 py-0.5 rounded bg-white text-amber-900 text-[10px] border border-amber-200">
                                      &bull; {rc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-emerald-700 font-semibold text-xs">
                            Jawaban benar:{' '}
                            {q.type === 'mc' || q.type === 'dialog'
                              ? q.options?.[Number(q.correctAnswer)]
                              : String(q.correctAnswer)}
                          </div>
                        )}

                        <div className="text-gray-700 italic text-[11px] bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <strong>Pembahasan:</strong> {q.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2 text-left">
                  <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pengaturan Keamanan Guru:</strong> Kunci jawaban tidak ditampilkan sekarang sesuai pengaturan evaluasi tertutup oleh guru.
                  </div>
                </div>
              )}

              <div>
                <button
                  onClick={() => {
                    setIsQuizCompleted(false);
                    setUserAnswers({});
                    setCurrentQuestionIndex(0);
                    setTimeLeftSeconds(activeQuiz.durationMinutes * 60);
                    setIsTimerRunning(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Pengerjaan Kuis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
