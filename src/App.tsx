/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppDatabase, 
  UserRole, 
  GradeLevel, 
  Student, 
  TeacherProfile, 
  ClassRoom, 
  LearningModule, 
  VocabularyItem, 
  WritingSubmission, 
  Quiz, 
  QuizAttempt, 
  SkillRubrics, 
  LessonPlan, 
  PronunciationAttempt 
} from './types';
import { initialDatabase } from './data/initialData';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/student/StudentHome';
import { SpeakingPartner } from './components/student/SpeakingPartner';
import { PronunciationPractice } from './components/student/PronunciationPractice';
import { VocabularyBuilder } from './components/student/VocabularyBuilder';
import { GrammarTutor } from './components/student/GrammarTutor';
import { DemoModuleView } from './components/student/DemoModuleView';
import { ReadingPracticeView } from './components/student/ReadingPracticeView';
import { ListeningPracticeView } from './components/student/ListeningPracticeView';
import { WritingPracticeView } from './components/student/WritingPracticeView';
import { QuizEvaluationView } from './components/student/QuizEvaluationView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminView } from './components/admin/AdminView';
import { ComicCartoonGenerator } from './components/common/ComicCartoonGenerator';
import { FirebaseSyncModal } from './components/common/FirebaseSyncModal';
import { firebaseSync } from './services/firebaseSync';

import { 
  Home, 
  MessageSquare, 
  Volume2, 
  BookMarked, 
  Brain, 
  BookOpen, 
  FileText, 
  Headphones, 
  PenTool, 
  CheckCircle2, 
  Sparkles,
  Info,
  Palette
} from 'lucide-react';

export default function App() {
  const [database, setDatabase] = useState<AppDatabase>(initialDatabase);
  const [currentRole, setCurrentRole] = useState<UserRole>('siswa');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('VII');
  const [activeStudentId, setActiveStudentId] = useState<string>('std-1');
  const [studentActiveTab, setStudentActiveTab] = useState<string>('home');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);
  const [activeQuizIdToOpen, setActiveQuizIdToOpen] = useState<string | undefined>(undefined);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);

  // Load database and check health on initial mount
  useEffect(() => {
    async function init() {
      setIsLoadingDb(true);
      try {
        const health = await api.getHealth();
        setHasGeminiKey(health.hasGeminiKey);

        const loadedDb = await api.loadDatabase();
        setDatabase(loadedDb);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoadingDb(false);
      }
    }
    init();
  }, []);

  // Save database to server whenever it updates
  const saveState = async (newDb: AppDatabase) => {
    setDatabase(newDb);
    setIsSaving(true);
    await api.saveDatabase(newDb);
    setIsSaving(false);
  };

  const activeStudent =
    database.students.find((s) => s.id === activeStudentId) ||
    database.students[0] ||
    initialDatabase.students[0];

  const handleUpdateStudentPoints = (delta: number) => {
    const updatedStudents = database.students.map((st) => {
      if (st.id === activeStudent.id) {
        return {
          ...st,
          points: st.points + delta,
          lastActive: new Date().toISOString(),
        };
      }
      return st;
    });
    saveState({ ...database, students: updatedStudents });
  };

  const handleSpeakingSessionComplete = () => {
    const updatedStudents = database.students.map((st) => {
      if (st.id === activeStudent.id) {
        return {
          ...st,
          speakingSessionsCount: st.speakingSessionsCount + 1,
          completedLessonsCount: st.completedLessonsCount + 1,
          lastActive: new Date().toISOString(),
        };
      }
      return st;
    });
    saveState({ ...database, students: updatedStudents });
  };

  const handleSavePronunciationAttempt = (attempt: PronunciationAttempt) => {
    saveState({
      ...database,
      pronunciationAttempts: [attempt, ...database.pronunciationAttempts],
    });
  };

  const handleSaveWritingSubmission = (submission: WritingSubmission) => {
    saveState({
      ...database,
      writingSubmissions: [submission, ...database.writingSubmissions],
    });
  };

  const handleSaveQuizAttempt = (attempt: QuizAttempt) => {
    saveState({
      ...database,
      quizAttempts: [attempt, ...database.quizAttempts],
    });
  };

  const handleUpdateStudentQuizScore = (quizId: string, score: number, category: string) => {
    const updatedStudents = database.students.map((st) => {
      if (st.id === activeStudent.id) {
        return {
          ...st,
          preTestScore: category === 'pre-test' ? score : st.preTestScore,
          postTestScore: category === 'post-test' ? score : st.postTestScore,
          points: st.points + Math.round(score / 5),
          completedLessonsCount: st.completedLessonsCount + 1,
        };
      }
      return st;
    });
    saveState({ ...database, students: updatedStudents });
  };

  const handleResetDemoData = async () => {
    setIsSaving(true);
    const fresh = await api.resetDemoData();
    setDatabase(fresh);
    setIsSaving(false);
    alert('Data berhasil diatur ulang ke kondisi demonstrasi resmi kurikulum!');
  };

  // Find demo module (Grade 7 Introducing Yourself)
  const demoModule =
    database.modules.find((m) => m.isDemoModule) ||
    database.modules[0] ||
    initialDatabase.modules[0];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        activeStudent={activeStudent}
        students={database.students}
        onSelectStudent={(s) => {
          setActiveStudentId(s.id);
          setSelectedGrade(s.grade);
        }}
        teacher={database.teacher}
        hasGeminiKey={hasGeminiKey}
        onResetDemo={handleResetDemoData}
        isSaving={isSaving}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
      />

      {/* Sub-Navigation Bar in Student Mode */}
      {currentRole === 'siswa' && (
        <div className="bg-white border-b border-indigo-100 shadow-xs sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none text-xs font-bold">
              {[
                { id: 'home', label: 'Beranda Siswa', icon: Home },
                { id: 'demo-module', label: 'Modul Demo VII', icon: BookOpen, badge: 'Resmi' },
                { id: 'speaking', label: 'AI Speaking Partner', icon: MessageSquare, badge: 'Suara Perempuan' },
                { id: 'comic-cartoon', label: 'Komik & Kartun AI', icon: Palette, badge: 'Visual AI' },
                { id: 'vocab', label: 'AI Vocabulary Builder', icon: BookMarked, badge: 'Unggulan 3' },
                { id: 'grammar', label: 'AI Grammar Tutor', icon: Brain, badge: 'Unggulan 4' },
                { id: 'pronunciation', label: 'Pronunciation', icon: Volume2 },
                { id: 'reading', label: 'Reading', icon: FileText },
                { id: 'listening', label: 'Listening', icon: Headphones },
                { id: 'writing', label: 'Writing', icon: PenTool },
                { id: 'quiz', label: 'Kuis & Evaluasi', icon: CheckCircle2, badge: 'Pre/Post' },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = studentActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setStudentActiveTab(tab.id);
                      if (tab.id === 'quiz') setActiveQuizIdToOpen(undefined);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isActive
                            ? 'bg-indigo-800 text-white'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoadingDb ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-semibold text-gray-700">
              Memuat data pembelajaran SI CERDAS ENGLISH...
            </p>
          </div>
        ) : currentRole === 'guru' ? (
          /* Teacher Dashboard View */
          <TeacherDashboard
            teacher={database.teacher}
            classes={database.classes}
            students={database.students}
            modules={database.modules}
            vocabulary={database.vocabulary}
            grammarTopics={database.grammarTopics}
            pronunciationItems={database.pronunciationItems}
            readingExercises={database.readingExercises}
            listeningExercises={database.listeningExercises}
            writingTasks={database.writingTasks}
            writingSubmissions={database.writingSubmissions}
            quizzes={database.quizzes}
            quizAttempts={database.quizAttempts}
            rubrics={database.rubrics}
            lessonPlans={database.lessonPlans}
            onUpdateTeacherProfile={(p) => saveState({ ...database, teacher: p })}
            onUpdateClasses={(cls) => saveState({ ...database, classes: cls })}
            onUpdateStudents={(stds) => saveState({ ...database, students: stds })}
            onUpdateModules={(mods) => saveState({ ...database, modules: mods })}
            onUpdateVocabulary={(vocs) => saveState({ ...database, vocabulary: vocs })}
            onUpdateLessonPlans={(lps) => saveState({ ...database, lessonPlans: lps })}
            onUpdateWritingSubmission={(sub) => {
              const updated = database.writingSubmissions.map((s) => (s.id === sub.id ? sub : s));
              saveState({ ...database, writingSubmissions: updated });
            }}
            onUpdateQuizzes={(qzs) => saveState({ ...database, quizzes: qzs })}
            onUpdateRubrics={(rubs) => saveState({ ...database, rubrics: rubs })}
            onUpdateReadingExercises={(reads) => saveState({ ...database, readingExercises: reads })}
            onUpdateListeningExercises={(lists) => saveState({ ...database, listeningExercises: lists })}
            onUpdatePronunciationItems={(pros) => saveState({ ...database, pronunciationItems: pros })}
            onResetDemoData={handleResetDemoData}
            hasGeminiKey={hasGeminiKey}
          />
        ) : currentRole === 'admin' ? (
          /* Admin View */
          <AdminView
            database={database}
            hasGeminiKey={hasGeminiKey}
            onResetDemo={handleResetDemoData}
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          />
        ) : (
          /* Student Role Tab Router */
          <div>
            {studentActiveTab === 'home' && (
              <StudentHome
                student={activeStudent}
                selectedGrade={selectedGrade}
                onNavigateTab={(tab) => setStudentActiveTab(tab)}
              />
            )}

            {studentActiveTab === 'demo-module' && (
              <DemoModuleView
                module={demoModule}
                student={activeStudent}
                allVocabulary={database.vocabulary}
                onOpenSpeakingPartner={(topic) => setStudentActiveTab('speaking')}
                onOpenQuiz={(quizId) => {
                  setActiveQuizIdToOpen(quizId);
                  setStudentActiveTab('quiz');
                }}
                onOpenGrammar={() => setStudentActiveTab('grammar')}
              />
            )}

            {studentActiveTab === 'speaking' && (
              <SpeakingPartner
                student={activeStudent}
                onUpdatePoints={handleUpdateStudentPoints}
                onSessionComplete={handleSpeakingSessionComplete}
              />
            )}

            {studentActiveTab === 'comic-cartoon' && (
              <ComicCartoonGenerator
                selectedGrade={selectedGrade}
                userRole="siswa"
              />
            )}

            {studentActiveTab === 'pronunciation' && (
              <PronunciationPractice
                items={database.pronunciationItems}
                student={activeStudent}
                onUpdatePoints={handleUpdateStudentPoints}
                onSaveAttempt={handleSavePronunciationAttempt}
              />
            )}

            {studentActiveTab === 'vocab' && (
              <VocabularyBuilder
                vocabulary={database.vocabulary}
                student={activeStudent}
                onUpdatePoints={handleUpdateStudentPoints}
              />
            )}

            {studentActiveTab === 'grammar' && (
              <GrammarTutor
                topics={database.grammarTopics}
                student={activeStudent}
                onUpdatePoints={handleUpdateStudentPoints}
              />
            )}

            {studentActiveTab === 'reading' && (
              <ReadingPracticeView
                exercises={database.readingExercises}
                student={activeStudent}
                onUpdatePoints={handleUpdateStudentPoints}
              />
            )}

            {studentActiveTab === 'listening' && (
              <ListeningPracticeView
                exercises={database.listeningExercises}
                student={activeStudent}
                onUpdatePoints={handleUpdateStudentPoints}
              />
            )}

            {studentActiveTab === 'writing' && (
              <WritingPracticeView
                tasks={database.writingTasks}
                submissions={database.writingSubmissions}
                student={activeStudent}
                onUpdatePoints={handleUpdateStudentPoints}
                onSaveSubmission={handleSaveWritingSubmission}
              />
            )}

            {studentActiveTab === 'quiz' && (
              <QuizEvaluationView
                quizzes={database.quizzes}
                student={activeStudent}
                onUpdateStudentQuizScore={handleUpdateStudentQuizScore}
                onSaveQuizAttempt={handleSaveQuizAttempt}
                initialQuizId={activeQuizIdToOpen}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-xs text-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-gray-900">SI CERDAS ENGLISH</span> &mdash; 
            <span className="text-gray-700 ml-1">Sistem Pembelajaran Cerdas, Kreatif, dan Adaptif untuk SMP</span>
            <div className="text-[11px] text-gray-700 mt-0.5">
              Tagline: <strong className="text-indigo-600">"Learn with Confidence, Speak with Courage!"</strong>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-700">
            <span>Kurikulum Merdeka SMP</span>
            <span>&bull;</span>
            <span>Dukungan Google Gemini AI</span>
            <span>&bull;</span>
            <span>Web Responsif &amp; Offline Resilient</span>
          </div>
        </div>
      </footer>

      {/* Firebase Sync & Console Modal */}
      <FirebaseSyncModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        database={database}
        onDatabaseUpdate={(newDb) => saveState(newDb)}
      />
    </div>
  );
}
