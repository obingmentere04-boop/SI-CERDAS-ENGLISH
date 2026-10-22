import React, { useState } from 'react';
import { ListeningExercise, Student } from '../../types';
import { speechService } from '../../services/speech';
import { 
  Volume2, 
  Eye, 
  EyeOff, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Info,
  Award
} from 'lucide-react';

interface ListeningPracticeViewProps {
  exercises: ListeningExercise[];
  student: Student;
  onUpdatePoints: (delta: number) => void;
}

export const ListeningPracticeView: React.FC<ListeningPracticeViewProps> = ({
  exercises,
  student,
  onUpdatePoints,
}) => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeExercise = exercises[selectedExerciseIndex] || exercises[0];

  const handlePlayAudio = () => {
    if (!activeExercise || isPlayingAudio) return;
    if (playCount >= activeExercise.maxPlayCount) {
      alert(
        `Batas pemutaran audio (${activeExercise.maxPlayCount} kali) telah tercapai sesuai pengaturan latihan.`
      );
      return;
    }

    setIsPlayingAudio(true);
    setPlayCount((prev) => prev + 1);

    speechService.speak(activeExercise.audioScript, 0.85, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correct = 0;
    activeExercise.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct += 1;
      }
    });
    onUpdatePoints(correct * 10);
  };

  const handleReset = () => {
    speechService.stopSpeaking();
    setIsPlayingAudio(false);
    setPlayCount(0);
    setShowTranscript(false);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Listening Practice</h1>
          <p className="text-xs text-gray-700">
            Latih kemampuan menyimak Bahasa Inggris dengan pemutar audio, batas pemutaran, dan naskah tersembunyi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Pilih Latihan:</label>
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
          {/* Audio Player & Transcript Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider px-2 py-0.5 bg-indigo-50 rounded">
                  Kelas {activeExercise.grade} &bull; {activeExercise.topic}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  {activeExercise.title}
                </h2>
              </div>

              {/* Audio Control Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-200 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Volume2 className={`w-8 h-8 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                </div>

                <div className="text-xs font-semibold text-gray-700">
                  Pemutaran:{' '}
                  <span className="font-extrabold text-indigo-700">
                    {playCount} / {activeExercise.maxPlayCount} kali
                  </span>
                </div>

                <button
                  onClick={handlePlayAudio}
                  disabled={isPlayingAudio || playCount >= activeExercise.maxPlayCount}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto disabled:opacity-40 transition-colors shadow-xs"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {isPlayingAudio
                      ? 'Sedang Memutar Audio...'
                      : playCount >= activeExercise.maxPlayCount
                      ? 'Batas Putar Tercapai'
                      : 'Dengarkan Audio Sekarang'}
                  </span>
                </button>
              </div>

              {/* Toggle Transcript */}
              <div className="pt-2">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>
                    {showTranscript
                      ? 'Sembunyikan Naskah Transkrip'
                      : 'Tampilkan Naskah Transkrip (Bantuan Belajar)'}
                  </span>
                </button>

                {showTranscript && (
                  <div className="mt-2 p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed font-serif whitespace-pre-line animate-in fade-in">
                    {activeExercise.audioScript}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Petunjuk:</strong> Dengarkan audio tanpa melihat naskah terlebih dahulu untuk melatih ketajaman menyimak intonasi dan kosakata penutur.
              </span>
            </div>
          </div>

          {/* Comprehension Quiz */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Pertanyaan Pemahaman Menyimak:
              </h3>
              <span className="text-xs text-gray-700">
                {activeExercise.questions.length} Soal
              </span>
            </div>

            <div className="space-y-3.5">
              {activeExercise.questions.map((q, qIdx) => {
                const userChoice = selectedAnswers[q.id];
                return (
                  <div key={q.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                    <div className="font-bold text-gray-900">
                      {qIdx + 1}. {q.question}
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userChoice === optIdx;
                        const isCorrect = optIdx === q.correctIndex;

                        let optClass = 'bg-white border-gray-200 hover:bg-indigo-50/60 text-gray-800';
                        if (isSubmitted) {
                          if (isCorrect) optClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                          else if (isChosen) optClass = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                        } else if (isChosen) {
                          optClass = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${optClass}`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="mt-2 p-2 bg-indigo-50 rounded-lg text-[11px] text-indigo-900 border border-indigo-100">
                        <strong>Pembahasan:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-indigo-600 font-semibold"
              >
                Ulangi Latihan
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitted || Object.keys(selectedAnswers).length === 0}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-40 shadow-xs"
              >
                {isSubmitted ? 'Selesai Dievaluasi' : 'Periksa Jawaban'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
