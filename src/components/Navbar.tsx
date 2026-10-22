import React, { useState } from 'react';
import { UserRole, GradeLevel, Student, TeacherProfile } from '../types';
import { 
  Sparkles, 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Menu, 
  X, 
  BookOpen, 
  Flame, 
  Volume2, 
  CheckCircle2, 
  RefreshCw,
  LogOut,
  Cloud 
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  activeStudent: Student;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  teacher: TeacherProfile;
  hasGeminiKey: boolean;
  onResetDemo: () => void;
  isSaving: boolean;
  onOpenFirebaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  selectedGrade,
  onGradeChange,
  activeStudent,
  students,
  onSelectStudent,
  teacher,
  hasGeminiKey,
  onResetDemo,
  isSaving,
  onOpenFirebaseModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-indigo-100 shadow-xs">
      {/* Top Banner Tagline */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 text-white px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>
            <strong className="tracking-wide">SI CERDAS ENGLISH</strong> &mdash; 
            <span className="italic text-indigo-100 ml-1">"Learn with Confidence, Speak with Courage!"</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 text-xs">
          <button
            onClick={onOpenFirebaseModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/25 hover:bg-orange-500/40 text-orange-200 border border-orange-400/30 transition-colors cursor-pointer"
            title="Kelola &amp; Sinkronkan ke Firebase Console"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-300" />
            <span>Firebase Console: <strong>Singkron</strong></span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-indigo-50 border border-white/20">
            <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400' : 'bg-amber-300'}`} />
            {hasGeminiKey ? 'Gemini AI Aktif' : 'Mode Offline'}
          </span>
          {isSaving && (
            <span className="inline-flex items-center gap-1 text-emerald-200">
              <RefreshCw className="w-3 h-3 animate-spin" /> Menyimpan...
            </span>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white p-0.5 border border-indigo-100 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src="/logo.png" 
                alt="SI CERDAS ENGLISH" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-gray-900 tracking-tight text-lg sm:text-xl">
                  SI CERDAS <span className="text-indigo-600">ENGLISH</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  SMP
                </span>
              </div>
              <p className="text-[11px] text-gray-700 hidden sm:block">
                Sistem Pembelajaran Cerdas &amp; Adaptif Bahasa Inggris
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Grade Level Selector */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-700 px-2">Kelas:</span>
              {(['VII', 'VIII', 'IX'] as GradeLevel[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => onGradeChange(grade)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    selectedGrade === grade
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-indigo-50/70 p-1 rounded-xl border border-indigo-100">
              <button
                onClick={() => onRoleChange('guru')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'guru'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Dashboard Guru</span>
              </button>
              <button
                onClick={() => onRoleChange('siswa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'siswa'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Moda Siswa</span>
              </button>
              <button
                onClick={() => onRoleChange('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Active User Avatar / Switcher */}
            {currentRole === 'siswa' ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <img
                  src={activeStudent.avatarUrl}
                  alt={activeStudent.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-800 leading-tight">
                    {activeStudent.name}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>{activeStudent.streakDays} hari streak</span>
                  </div>
                </div>
                <select
                  value={activeStudent.id}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    if (st) onSelectStudent(st);
                  }}
                  className="text-[11px] bg-white border border-gray-200 rounded px-1.5 py-1 text-gray-700 ml-1"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.className})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <img
                  src={teacher.avatarUrl}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-800 leading-tight">
                    {teacher.name}
                  </div>
                  <div className="text-[10px] text-gray-700">Guru B. Inggris SMP</div>
                </div>
              </div>
            )}

            {/* Logout / Switch Account button */}
            <button
              onClick={() => {
                if (confirm('Keluar dari sesi saat ini dan kembali ke akun siswa percontohan?')) {
                  onRoleChange('siswa');
                  if (students[0]) onSelectStudent(students[0]);
                }
              }}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
              title="Logout / Ganti Sesi"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              {currentRole === 'guru' ? 'Guru' : currentRole === 'siswa' ? 'Siswa' : 'Admin'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-4 shadow-lg">
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">Peran Pengguna:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onRoleChange('guru');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                  currentRole === 'guru'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Guru
              </button>
              <button
                onClick={() => {
                  onRoleChange('siswa');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                  currentRole === 'siswa'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Siswa
              </button>
              <button
                onClick={() => {
                  onRoleChange('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                  currentRole === 'admin'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">Pilih Jenjang Kelas:</div>
            <div className="grid grid-cols-3 gap-2">
              {(['VII', 'VIII', 'IX'] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    onGradeChange(g);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg border text-center ${
                    selectedGrade === g
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  Kelas {g}
                </button>
              ))}
            </div>
          </div>

          {currentRole === 'siswa' && (
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">Ganti Profil Siswa:</div>
              <select
                value={activeStudent.id}
                onChange={(e) => {
                  const st = students.find((s) => s.id === e.target.value);
                  if (st) onSelectStudent(st);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-800"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.className} - NISN: {st.nisn})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <button
              onClick={() => {
                onOpenFirebaseModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              <Cloud className="w-4 h-4 text-white" />
              <span>Sinkronisasi Firebase Console</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => {
                onRoleChange('siswa');
                if (students[0]) onSelectStudent(students[0]);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 p-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Logout</span>
            </button>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan Otomatis
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
