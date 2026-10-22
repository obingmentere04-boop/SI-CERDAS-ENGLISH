import React from 'react';
import { Student, GradeLevel } from '../../types';
import { 
  Sparkles, 
  MessageSquare, 
  Volume2, 
  BookMarked, 
  Brain, 
  FileText, 
  CheckCircle2, 
  Flame, 
  Award, 
  TrendingUp, 
  ArrowRight,
  Headphones,
  PenTool,
  BookOpen,
  Palette
} from 'lucide-react';

interface StudentHomeProps {
  student: Student;
  selectedGrade: GradeLevel;
  onNavigateTab: (tabId: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  student,
  selectedGrade,
  onNavigateTab,
}) => {
  const preScore = student.preTestScore ?? 55;
  const postScore = student.postTestScore ?? 85;
  const gain = postScore - preScore;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Student Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-100 text-xs font-bold border border-white/20 uppercase tracking-wider">
                Kelas {student.className} &bull; NISN: {student.nisn}
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-bold text-xs bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{student.streakDays} Hari Streak!</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-white/30 shadow-md shrink-0 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="SI CERDAS ENGLISH Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Hello, {student.name}! Welcome Back!
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
              "Learn with Confidence, Speak with Courage!" Setiap kalimat yang kamu ucapkan adalah langkah berharga menuju kefasihan Bahasa Inggris.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onNavigateTab('demo-module')}
                className="px-3.5 py-2 bg-amber-400 text-gray-900 font-extrabold text-xs rounded-xl hover:bg-amber-300 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Modul Perkenalan Diri (Kelas VII)</span>
              </button>
              <button
                onClick={() => onNavigateTab('speaking')}
                className="px-3.5 py-2 bg-rose-500/90 text-white font-bold text-xs rounded-xl hover:bg-rose-500 border border-rose-400/40 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-rose-200" />
                <span>Bicara dengan Miss Sarah (Suara Perempuan)</span>
              </button>
              <button
                onClick={() => onNavigateTab('comic-cartoon')}
                className="px-3.5 py-2 bg-white/15 text-white font-bold text-xs rounded-xl hover:bg-white/25 border border-white/25 transition-colors flex items-center gap-1.5"
              >
                <Palette className="w-4 h-4 text-amber-300" />
                <span>Buat Gambar Komik &amp; Kartun AI</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 gap-3 sm:w-64 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center">
              <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                Poin Kamu
              </div>
              <div className="text-2xl font-black text-amber-300 mt-0.5">
                {student.points}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center">
              <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                Kata Dikuasai
              </div>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">
                {student.vocabMasteredCount}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center col-span-2">
              <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                Peningkatan Pre &rarr; Post Test
              </div>
              <div className="text-xl font-black text-white mt-0.5 flex items-center justify-center gap-1">
                <span>{preScore}</span>
                <span className="text-indigo-300">&rarr;</span>
                <span className="text-emerald-300">{postScore}</span>
                <span className="text-xs text-emerald-300 font-bold ml-1">(+{gain})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Main Core Features Priority Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
              4 Fitur Utama SI CERDAS ENGLISH
            </h2>
          </div>
          <span className="text-xs text-indigo-700 font-semibold">Prioritas Versi 1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: AI Speaking Partner (Suara Perempuan) */}
          <div
            onClick={() => onNavigateTab('speaking')}
            className="group bg-white rounded-2xl p-5 border border-rose-100 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-rose-600 transition-colors">
                    1. AI Speaking Partner
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    Suara Perempuan
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Percakapan langsung dengan <strong>Miss Sarah (suara perempuan ramah)</strong> di 11 topik percakapan SMP dengan bantuan tombol petunjuk &amp; koreksi santun.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>Bicara dengan Miss Sarah</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: AI Vocabulary Builder */}
          <div
            onClick={() => onNavigateTab('vocab')}
            className="group bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                  2. AI Vocabulary Builder
                </h3>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Perkaya kosakata dengan Flashcards, Mencocokkan Kata, Susun Huruf, Pilihan Ganda, &amp; Tebak Konteks.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Latih Kosakata</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: AI Grammar Tutor */}
          <div
            onClick={() => onNavigateTab('grammar')}
            className="group bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                  3. AI Grammar Tutor
                </h3>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  12 topik tata bahasa SMP lengkap dengan rumus, contoh kontekstual, kesalahan umum, dan konsultasi AI.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Buka Tutor Tata Bahasa</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Kuis dan Evaluasi */}
          <div
            onClick={() => onNavigateTab('quiz')}
            className="group bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                  4. Kuis &amp; Evaluasi
                </h3>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Ukur hasil belajar dengan Pre-Test dan Post-Test berbasis bobot penilaian dan durasi waktu.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Ikuti Kuis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Skills Practice Section */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
          Latihan Keterampilan Berbahasa Lainnya
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pronunciation Practice */}
          <div
            onClick={() => onNavigateTab('pronunciation')}
            className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-gray-900">Pronunciation Practice</div>
              <div className="text-[11px] text-gray-700">Audio model &amp; rekam suara</div>
            </div>
          </div>

          {/* Reading Practice */}
          <div
            onClick={() => onNavigateTab('reading')}
            className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-gray-900">Reading Practice</div>
              <div className="text-[11px] text-gray-700">Teks cerita &amp; pemahaman</div>
            </div>
          </div>

          {/* Listening Practice */}
          <div
            onClick={() => onNavigateTab('listening')}
            className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-gray-900">Listening Practice</div>
              <div className="text-[11px] text-gray-700">Audio &amp; transkrip tersembunyi</div>
            </div>
          </div>

          {/* Writing Practice */}
          <div
            onClick={() => onNavigateTab('writing')}
            className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-gray-900">Writing Practice</div>
              <div className="text-[11px] text-gray-700">Umpan balik AI &amp; nilai guru</div>
            </div>
          </div>

          {/* Studio Gambar Komik & Kartun AI */}
          <div
            onClick={() => onNavigateTab('comic-cartoon')}
            className="bg-white rounded-2xl p-4 border border-purple-200 hover:border-purple-400 hover:bg-purple-50/40 transition-all cursor-pointer flex items-center gap-3.5 sm:col-span-2 lg:col-span-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-900">Studio Gambar Komik &amp; Kartun AI</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                    Visual Interaktif
                  </span>
                </div>
                <div className="text-[11px] text-gray-700">
                  Visualisasikan cerita &amp; dialog bahasa Inggris ke dalam komik strip berwarna dan kartun edukatif lengkap dengan balon ucapan audio!
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 flex items-center gap-1 shrink-0 ml-3">
                <span>Buka Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
