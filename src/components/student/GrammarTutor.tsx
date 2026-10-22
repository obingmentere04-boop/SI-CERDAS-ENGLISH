import React, { useState } from 'react';
import { GrammarTopic, Student } from '../../types';
import { api } from '../../services/api';
import { 
  BookOpen, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Send, 
  MessageCircle,
  Lightbulb
} from 'lucide-react';

interface GrammarTutorProps {
  topics: GrammarTopic[];
  student: Student;
  onUpdatePoints: (delta: number) => void;
}

export const GrammarTutor: React.FC<GrammarTutorProps> = ({
  topics,
  student,
  onUpdatePoints,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [hasSubmittedExercise, setHasSubmittedExercise] = useState(false);

  // Ask AI custom tutor state
  const [userQuestion, setUserQuestion] = useState('');
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const [aiCustomExplanation, setAiCustomExplanation] = useState<any | null>(null);

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];
  const activeExercise = activeTopic?.exercises?.[selectedExerciseIndex];

  const handleExerciseOptionSelect = (idx: number) => {
    setUserSelectedOption(idx);
    setHasSubmittedExercise(true);
    if (activeExercise && idx === activeExercise.correctIndex) {
      onUpdatePoints(10);
    }
  };

  const handleAskAiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || isAiAnswering) return;

    setIsAiAnswering(true);
    setAiCustomExplanation(null);
    try {
      const response = await api.askGrammarTutor({
        question: userQuestion,
        topic: activeTopic.title,
        grade: activeTopic.grade,
      });
      setAiCustomExplanation(response);
    } catch (err) {
      console.error('Error asking grammar AI:', err);
    } finally {
      setIsAiAnswering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Grammar Tutor</h1>
          <p className="text-xs text-gray-700">
            Pahami 12 materi tata bahasa SMP dengan rumus jelas, contoh kontekstual, dan latihan interaktif
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 self-start sm:self-auto">
          Materi Kelas {activeTopic.grade} SMP
        </div>
      </div>

      {/* Main Grid: Sidebar of 12 Topics & Detail Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: List of 12 Topics */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-indigo-100 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            12 Materi Tata Bahasa SMP:
          </h2>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {topics.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTopicId(t.id);
                  setSelectedExerciseIndex(0);
                  setUserSelectedOption(null);
                  setHasSubmittedExercise(false);
                  setAiCustomExplanation(null);
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                  selectedTopicId === t.id
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                    : 'bg-gray-50 hover:bg-indigo-50/60 text-gray-800 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate pr-1">
                    {idx + 1}. {t.title}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded font-bold uppercase shrink-0 ${
                      selectedTopicId === t.id ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Kls {t.grade}
                  </span>
                </div>
                <div
                  className={`text-[10px] mt-0.5 truncate ${
                    selectedTopicId === t.id ? 'text-indigo-100' : 'text-gray-700'
                  }`}
                >
                  {t.titleId}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Grammar Topic Explanation & Practice */}
        <div className="md:col-span-2 space-y-4">
          {/* Topic Hero Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 bg-indigo-100 rounded">
                {activeTopic.category} &bull; Kelas {activeTopic.grade}
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                {activeTopic.title}
              </h2>
              <p className="text-xs text-gray-700 mt-0.5">
                {activeTopic.titleId} &mdash; {activeTopic.summary}
              </p>
            </div>

            {/* Formula Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>Rumus / Pola Kalimat:</span>
              </div>
              <pre className="font-mono text-xs font-extrabold text-indigo-950 whitespace-pre-wrap leading-relaxed">
                {activeTopic.formula}
              </pre>
            </div>

            {/* Friendly Explanation */}
            <div className="text-xs text-gray-700 leading-relaxed space-y-2">
              <strong className="text-gray-900 block font-bold">Penjelasan Sederhana:</strong>
              <div className="whitespace-pre-line bg-gray-50/70 p-3 rounded-xl border border-gray-200">
                {activeTopic.explanation}
              </div>
            </div>

            {/* Contextual Examples */}
            {activeTopic.examples?.length > 0 && (
              <div className="space-y-2">
                <strong className="text-xs text-gray-900 block font-bold">
                  Contoh Kalimat Kontekstual:
                </strong>
                <div className="space-y-1.5">
                  {activeTopic.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <span className="text-indigo-900 font-bold">"{ex.en}"</span>
                      <span className="text-gray-700 italic">({ex.id})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Student Mistakes (Kesalahan yang Sering Terjadi) */}
            {activeTopic.commonMistakes?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 space-y-2 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Kesalahan yang Sering Dilakukan Siswa SMP &amp; Solusinya:</span>
                </div>
                {activeTopic.commonMistakes.map((cm, idx) => (
                  <div key={idx} className="space-y-0.5 pt-1 border-t border-amber-200/60">
                    <div className="text-rose-700 line-through">
                      &bull; Kurang tepat: "{cm.wrong}"
                    </div>
                    <div className="text-emerald-700 font-bold">
                      &bull; Lebih tepat: "{cm.right}"
                    </div>
                    <div className="text-amber-800 text-[11px]">{cm.explanation}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Practice Question */}
          {activeExercise && (
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 border-b border-gray-100 pb-2">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Latihan Interaktif (Latihan {selectedExerciseIndex + 1})</span>
                </span>
                <span className="text-[11px] text-gray-700">Pilihlah jawaban yang paling tepat:</span>
              </div>

              <div className="text-sm font-bold text-gray-900 leading-relaxed">
                {activeExercise.question}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeExercise.options.map((opt, idx) => {
                  const isSelected = userSelectedOption === idx;
                  const isCorrect = idx === activeExercise.correctIndex;

                  let optClass = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-indigo-50/60';
                  if (hasSubmittedExercise) {
                    if (isCorrect) optClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                    else if (isSelected) optClass = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                  } else if (isSelected) {
                    optClass = 'bg-indigo-600 text-white border-indigo-600';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmittedExercise}
                      onClick={() => handleExerciseOptionSelect(idx)}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${optClass}`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {hasSubmittedExercise && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                  <div className="font-bold text-gray-900">Pembahasan Jawaban:</div>
                  <p className="text-gray-700">{activeExercise.explanation}</p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setUserSelectedOption(null);
                        setHasSubmittedExercise(false);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Coba Lagi Soal Ini</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ask AI Grammar Tutor Form */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-gray-900">
                  Tanya AI Grammar Tutor (Pertanyaan Mandiri)
                </h3>
                <p className="text-[11px] text-gray-700">
                  Masih bingung dengan materi {activeTopic.title}? Tanyakan langsung dan AI akan menjelaskannya secara ramah!
                </p>
              </div>
            </div>

            <form onSubmit={handleAskAiTutor} className="flex gap-2">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder={`Contoh: "Kapan saya harus pakai am, is, atau are?"`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
              <button
                type="submit"
                disabled={!userQuestion.trim() || isAiAnswering}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
              >
                <span>{isAiAnswering ? 'Menjawab...' : 'Tanya'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {aiCustomExplanation && (
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-2 animate-in fade-in">
                <strong className="block text-indigo-950 font-bold">
                  Jawaban AI Tutor:
                </strong>
                <p className="text-indigo-900 leading-relaxed whitespace-pre-line">
                  {aiCustomExplanation.explanation}
                </p>
                {aiCustomExplanation.formula && (
                  <div className="p-2 bg-white rounded-lg border border-indigo-200 font-mono text-[11px] text-indigo-950 font-bold">
                    Rumus: {aiCustomExplanation.formula}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
