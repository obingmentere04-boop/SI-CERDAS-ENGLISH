import React, { useState } from 'react';
import { ReadingExercise, Student } from '../../types';
import { BookOpen, CheckCircle2, RotateCcw, HelpCircle, Award, Sparkles } from 'lucide-react';

interface ReadingPracticeViewProps {
  exercises: ReadingExercise[];
  student: Student;
  onUpdatePoints: (delta: number) => void;
}

export const ReadingPracticeView: React.FC<ReadingPracticeViewProps> = ({
  exercises,
  student,
  onUpdatePoints,
}) => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeExercise = exercises[selectedExerciseIndex] || exercises[0];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    activeExercise.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    onUpdatePoints(correctCount * 10);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reading Practice</h1>
          <p className="text-xs text-gray-700">
            Latihan membaca dan memahami teks Bahasa Inggris SMP dengan glosarium kata kunci dan pembahasan
          </p>
        </div>

        {/* Exercise picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Pilih Teks:</label>
          <select
            value={selectedExerciseIndex}
            onChange={(e) => {
              setSelectedExerciseIndex(parseInt(e.target.value));
              handleReset();
            }}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700"
          >
            {exercises.map((ex, idx) => (
              <option key={ex.id} value={idx}>
                {ex.title} (Kelas {ex.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeExercise && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Passage & Glossary Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider px-2 py-0.5 bg-indigo-50 rounded">
                  Kelas {activeExercise.grade} &bull; {activeExercise.topic}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  {activeExercise.title}
                </h2>
              </div>

              {/* Text Passage */}
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-200 whitespace-pre-line font-serif">
                {activeExercise.passage}
              </div>
            </div>

            {/* Glossary */}
            {activeExercise.glossary?.length > 0 && (
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Glosarium Kosakata Penting (Vocabulary):</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {activeExercise.glossary.map((g, i) => (
                    <div key={i} className="text-gray-700">
                      <strong className="text-indigo-900">{g.word}:</strong> {g.meaning}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comprehension Questions */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Pertanyaan Pemahaman Teks:
              </h3>
              <span className="text-xs text-gray-700">
                {activeExercise.questions.length} Butir Soal
              </span>
            </div>

            <div className="space-y-4">
              {activeExercise.questions.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                return (
                  <div key={q.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                    <div className="font-bold text-gray-900">
                      {qIndex + 1}. {q.question}
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIndex) => {
                        const isChosen = userChoice === optIndex;
                        const isCorrect = optIndex === q.correctIndex;

                        let optClass = 'bg-white border-gray-200 hover:bg-indigo-50/60 text-gray-800';
                        if (isSubmitted) {
                          if (isCorrect) optClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                          else if (isChosen) optClass = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                        } else if (isChosen) {
                          optClass = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(q.id, optIndex)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${optClass}`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="mt-2 p-2 bg-indigo-50/70 rounded-lg text-[11px] text-indigo-900 border border-indigo-100">
                        <strong>Pembahasan:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-indigo-600 text-xs font-semibold"
              >
                Reset Jawaban
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitted || Object.keys(selectedAnswers).length === 0}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-40 shadow-xs"
              >
                {isSubmitted ? 'Jawaban Terkirim' : 'Periksa Jawaban'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
