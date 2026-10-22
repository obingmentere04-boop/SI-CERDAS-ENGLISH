import React, { useState } from 'react';
import { LearningModule, Student, VocabularyItem } from '../../types';
import { speechService } from '../../services/speech';
import { 
  BookOpen, 
  Volume2, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  HelpCircle,
  Award
} from 'lucide-react';

interface DemoModuleViewProps {
  module: LearningModule;
  student: Student;
  allVocabulary: VocabularyItem[];
  onOpenSpeakingPartner: (topic: string) => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenGrammar: () => void;
}

export const DemoModuleView: React.FC<DemoModuleViewProps> = ({
  module,
  student,
  allVocabulary,
  onOpenSpeakingPartner,
  onOpenQuiz,
  onOpenGrammar,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const sections = module.sections || [];
  const currentSection = sections[activeSectionIndex] || sections[0];

  const playSectionAudio = (text: string) => {
    setIsPlayingAudio(true);
    speechService.speak(text, 0.85, () => setIsPlayingAudio(false));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Banner Modul Resmi */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-amber-400 text-gray-900 rounded-full uppercase tracking-wider">
            Modul Demonstrasi Kurikulum Merdeka
          </span>
          <span className="text-xs text-indigo-100 font-semibold">
            Kelas VII SMP &bull; Semester 1
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {module.title}
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-2xl">
          {module.description}
        </p>

        {/* Quick Launch Buttons */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={() => onOpenSpeakingPartner('Introducing Yourself')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Simulasi Percakapan AI dengan Topik Ini</span>
          </button>
          <button
            onClick={() => onOpenQuiz('qz-post-7')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-900/60 text-white font-bold text-xs hover:bg-indigo-900/80 transition-colors border border-white/20"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kerjakan Kuis Evaluasi Modul</span>
          </button>
        </div>
      </div>

      {/* 7 Subtopics Steps Navigator */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-indigo-100">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          7 Langkah Pembelajaran Modul (Klik untuk Beralih):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {sections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionIndex(idx)}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                activeSectionIndex === idx
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-indigo-50/60'
              }`}
            >
              <div className="text-[10px] opacity-80 uppercase">Langkah {idx + 1}</div>
              <div className="truncate mt-0.5">{sec.title.split('(')[0].replace(/^\d+\.\s*/, '')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Section Content Card */}
      {currentSection && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Langkah {activeSectionIndex + 1} dari 7
              </span>
              <h2 className="text-xl font-bold text-gray-900">{currentSection.title}</h2>
            </div>
            {currentSection.audioScript && (
              <button
                onClick={() => playSectionAudio(currentSection.audioScript!)}
                disabled={isPlayingAudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold self-start sm:self-auto transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? 'Memutar Audio...' : 'Putar Audio Pelafalan'}</span>
              </button>
            )}
          </div>

          {/* Explanation Text */}
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/80 p-4 rounded-xl border border-gray-200">
            {currentSection.content}
          </div>

          {/* Dialog Player */}
          {currentSection.dialogue && currentSection.dialogue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Contoh Dialog Praktik:
                </span>
                <span className="text-[11px] text-gray-600">Klik ikon audio untuk menyimak</span>
              </div>

              <div className="space-y-2.5">
                {currentSection.dialogue.map((dlg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-1.5 hover:bg-indigo-50/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-indigo-900">{dlg.speaker}:</span>
                      <button
                        onClick={() => playSectionAudio(dlg.textEn)}
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                        title="Dengarkan dialog ini"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-gray-900 font-semibold text-sm">
                      "{dlg.textEn}"
                    </div>
                    <div className="text-gray-700 italic text-[11px]">
                      "{dlg.textId}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next / Previous Step Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeSectionIndex === 0}
              className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 disabled:opacity-30"
            >
              &larr; Langkah Sebelumnya
            </button>
            <button
              onClick={() => setActiveSectionIndex((prev) => Math.min(sections.length - 1, prev + 1))}
              disabled={activeSectionIndex === sections.length - 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-30 shadow-xs"
            >
              <span>Langkah Selanjutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
