import React, { useState } from 'react';
import { WritingTask, WritingSubmission, Student } from '../../types';
import { api } from '../../services/api';
import { 
  PenTool, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Award,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface WritingPracticeViewProps {
  tasks: WritingTask[];
  submissions: WritingSubmission[];
  student: Student;
  onUpdatePoints: (delta: number) => void;
  onSaveSubmission: (submission: WritingSubmission) => void;
}

export const WritingPracticeView: React.FC<WritingPracticeViewProps> = ({
  tasks,
  submissions,
  student,
  onUpdatePoints,
  onSaveSubmission,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [textContent, setTextContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<any | null>(null);

  const activeTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // Count words
  const wordsCount = textContent.trim().split(/\s+/).filter(Boolean).length;

  // Previous submissions for this task by this student
  const mySubmissions = submissions.filter(
    (s) => s.studentId === student.id && s.taskId === activeTask?.id
  );

  const handleSubmitWriting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim() || isEvaluating) return;

    if (wordsCount < activeTask.minWords) {
      if (
        !confirm(
          `Tulisanmu saat ini berisi ${wordsCount} kata (target minimal ${activeTask.minWords} kata). Apakah kamu tetap ingin mengirimkan untuk evaluasi AI?`
        )
      ) {
        return;
      }
    }

    setIsEvaluating(true);
    setLatestFeedback(null);

    try {
      const feedback = await api.evaluateWriting({
        prompt: activeTask.prompt,
        content: textContent,
        grade: activeTask.grade,
        minWords: activeTask.minWords,
      });

      setLatestFeedback(feedback);

      const newSubmission: WritingSubmission = {
        id: `sub-${Date.now()}`,
        taskId: activeTask.id,
        studentId: student.id,
        studentName: student.name,
        content: textContent,
        wordCount: wordsCount,
        submittedAt: new Date().toISOString(),
        status: 'graded',
        aiFeedback: feedback,
      };

      onSaveSubmission(newSubmission);
      onUpdatePoints(20);
    } catch (err) {
      console.error('Error in writing evaluation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Writing Practice</h1>
          <p className="text-xs text-gray-700">
            Latihan menulis kalimat dan paragraf Bahasa Inggris dengan telaah AI mendalam (Tata bahasa, kosakata, ejaan, struktur, organisasi)
          </p>
        </div>

        {/* Task selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Tugas Menulis:</label>
          <select
            value={selectedTaskId}
            onChange={(e) => {
              setSelectedTaskId(e.target.value);
              setLatestFeedback(null);
            }}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:ring-2 focus:ring-indigo-500"
          >
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title} (Kelas {task.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeTask && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Task Prompt & Guide Questions */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                Kelas {activeTask.grade} &bull; {activeTask.type}
              </span>
              <h2 className="text-base font-bold text-gray-900 mt-1">
                {activeTask.title}
              </h2>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-medium">
              <strong>Instruksi Tugas:</strong>
              <p className="mt-1 text-indigo-900">{activeTask.prompt}</p>
            </div>

            {activeTask.guideQuestions?.length > 0 && (
              <div className="space-y-1.5 text-xs text-gray-700">
                <strong className="text-gray-900 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Panduan Menulis (Guide Questions):</span>
                </strong>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
                  {activeTask.guideQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
              <div>
                Target minimal: <strong>{activeTask.minWords} kata</strong>
              </div>
              <div>
                Fokus rubrik:{' '}
                <span className="font-semibold text-indigo-700">
                  {activeTask.rubricFocus?.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Writing Editor & AI Evaluation */}
          <div className="lg:col-span-2 space-y-4">
            {/* Editor Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 space-y-3">
              <form onSubmit={handleSubmitWriting} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">
                    Lembar Kerja Menulis:
                  </label>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      wordsCount >= activeTask.minWords
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {wordsCount} / {activeTask.minWords} kata
                  </span>
                </div>

                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={7}
                  placeholder="Ketik paragraf Bahasa Inggrismu di sini... Tulislah dengan percaya diri tanpa takut salah tata bahasa."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-700">
                    AI akan menganalisis tata bahasa dan memberi masukan ramah.
                  </span>
                  <button
                    type="submit"
                    disabled={!textContent.trim() || isEvaluating}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? 'Menganalisis Tulisan...' : 'Evaluasi Tulisan dengan AI'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* AI Feedback Report */}
            {latestFeedback && (
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <Award className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Hasil Analisis Tulisan Siswa
                      </h3>
                      <p className="text-[11px] text-gray-700">
                        Estimasi Skor AI: <strong>{latestFeedback.overallEstimatedScore}/100</strong> (+20 Poin)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rubric Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] text-gray-700 uppercase font-bold">Grammar</div>
                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">
                      {latestFeedback.grammarScore}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] text-gray-700 uppercase font-bold">Vocabulary</div>
                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">
                      {latestFeedback.vocabularyScore}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] text-gray-700 uppercase font-bold">Spelling</div>
                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">
                      {latestFeedback.spellingScore}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] text-gray-700 uppercase font-bold">Structure</div>
                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">
                      {latestFeedback.structureScore}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-gray-700 uppercase font-bold">Organization</div>
                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">
                      {latestFeedback.organizationScore}
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {latestFeedback.strengths?.length > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <strong className="block text-emerald-950 font-bold">
                      Kelebihan Tulisanmu (Strengths):
                    </strong>
                    <ul className="list-disc list-inside space-y-0.5">
                      {latestFeedback.strengths.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Constructive Improvements */}
                {latestFeedback.improvements?.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <strong className="block text-amber-950 font-bold">
                      Saran Perbaikan (Constructive Suggestions):
                    </strong>
                    <ul className="list-disc list-inside space-y-0.5">
                      {latestFeedback.improvements.map((imp: string, i: number) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Correction */}
                {latestFeedback.sampleCorrection && (
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs space-y-1">
                    <strong className="block text-indigo-950 font-bold">
                      Contoh Paragraf yang Disempurnakan:
                    </strong>
                    <p className="text-indigo-900 leading-relaxed italic">
                      "{latestFeedback.sampleCorrection}"
                    </p>
                  </div>
                )}

                {/* Detailed Notes */}
                {latestFeedback.detailedNotes && (
                  <p className="text-xs text-gray-700 italic">
                    {latestFeedback.detailedNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
