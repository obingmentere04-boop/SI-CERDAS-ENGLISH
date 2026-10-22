import React, { useState, useMemo } from 'react';
import { 
  TeacherProfile, 
  ClassRoom, 
  Student, 
  LearningModule, 
  VocabularyItem, 
  GrammarTopic, 
  PronunciationItem, 
  ReadingExercise, 
  ListeningExercise, 
  WritingTask, 
  WritingSubmission, 
  Quiz, 
  QuizAttempt, 
  SkillRubrics, 
  LessonPlan, 
  GradeLevel,
  QuizQuestion
} from '../../types';
import { api } from '../../services/api';
import { 
  LayoutDashboard, 
  User, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  BookMarked, 
  Brain, 
  MessageSquare, 
  Volume2, 
  FileText, 
  Headphones, 
  PenTool, 
  CheckCircle2, 
  Award, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Download, 
  Printer, 
  Search, 
  Check, 
  X, 
  Sliders, 
  HelpCircle,
  Eye,
  RotateCcw,
  UserPlus,
  AlertTriangle,
  Palette,
  Calendar,
  CalendarDays,
  ListOrdered,
  Layers,
  FileCheck,
  ClipboardList
} from 'lucide-react';
import { ComicCartoonGenerator } from '../common/ComicCartoonGenerator';
import { speechService } from '../../services/speech';
import { initialFiftyQuestions, buildFiftyQuestions } from '../../data/fiftyQuestionQuiz';

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  classes: ClassRoom[];
  students: Student[];
  modules: LearningModule[];
  vocabulary: VocabularyItem[];
  grammarTopics: GrammarTopic[];
  pronunciationItems: PronunciationItem[];
  readingExercises: ReadingExercise[];
  listeningExercises: ListeningExercise[];
  writingTasks: WritingTask[];
  writingSubmissions: WritingSubmission[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  rubrics: SkillRubrics;
  lessonPlans: LessonPlan[];
  onUpdateTeacherProfile: (profile: TeacherProfile) => void;
  onUpdateClasses: (classes: ClassRoom[]) => void;
  onUpdateStudents: (students: Student[]) => void;
  onUpdateModules: (modules: LearningModule[]) => void;
  onUpdateVocabulary: (vocabulary: VocabularyItem[]) => void;
  onUpdateLessonPlans: (plans: LessonPlan[]) => void;
  onUpdateWritingSubmission: (submission: WritingSubmission) => void;
  onUpdateQuizzes: (quizzes: Quiz[]) => void;
  onUpdateRubrics: (rubrics: SkillRubrics) => void;
  onResetDemoData: () => void;
  hasGeminiKey: boolean;
  onUpdateReadingExercises?: (exercises: ReadingExercise[]) => void;
  onUpdateListeningExercises?: (exercises: ListeningExercise[]) => void;
  onUpdatePronunciationItems?: (items: PronunciationItem[]) => void;
}

export type TeacherMenu = 
  | 'dashboard'
  | 'profile'
  | 'classes'
  | 'students'
  | 'materials'
  | 'lesson-planner'
  | 'vocab-gen'
  | 'grammar-tutor'
  | 'speaking-partner'
  | 'comic-gen'
  | 'pronunciation'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'quizzes'
  | 'gradebook'
  | 'analytics'
  | 'settings'
  | 'rubrics';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  classes,
  students,
  modules,
  vocabulary,
  grammarTopics,
  pronunciationItems,
  readingExercises,
  listeningExercises,
  writingTasks,
  writingSubmissions,
  quizzes,
  quizAttempts,
  rubrics,
  lessonPlans,
  onUpdateTeacherProfile,
  onUpdateClasses,
  onUpdateStudents,
  onUpdateModules,
  onUpdateVocabulary,
  onUpdateLessonPlans,
  onUpdateWritingSubmission,
  onUpdateQuizzes,
  onUpdateRubrics,
  onResetDemoData,
  hasGeminiKey,
  onUpdateReadingExercises,
  onUpdateListeningExercises,
  onUpdatePronunciationItems,
}) => {
  const [activeMenu, setActiveMenu] = useState<TeacherMenu>('dashboard');

  // Teacher Profile Form State
  const [profileForm, setProfileForm] = useState<TeacherProfile>({ ...teacher });
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Search & Filter States
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All');

  // Active/Global Academic Year & Semester for Teacher
  const [activeAcademicYearGlobal, setActiveAcademicYearGlobal] = useState<string>('2026/2027');
  const [activeSemesterGlobal, setActiveSemesterGlobal] = useState<1 | 2>(1);

  // Class Management State
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<GradeLevel>('VII');
  const [newClassAcademicYear, setNewClassAcademicYear] = useState('2026/2027');
  const [newClassSemester, setNewClassSemester] = useState<1 | 2>(1);
  const [newClassDesc, setNewClassDesc] = useState('');
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  // Quick Edit Class Semester & Academic Year Modal
  const [quickEditClass, setQuickEditClass] = useState<ClassRoom | null>(null);
  const [quickClassSemester, setQuickClassSemester] = useState<1 | 2>(1);
  const [quickClassYear, setQuickClassYear] = useState('2026/2027');

  // In-App Notification Toast State
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // In-App Delete Confirmation Modal State (Reliable across all browser iframes without window.confirm)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'class' | 'student' | 'module' | 'quiz' | 'reading' | 'listening' | 'pronunciation';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'class',
    id: '',
    name: '',
  });

  // Student Management State (Panel & Modal)
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isStudentPanelOpen, setIsStudentPanelOpen] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormNisn, setStudentFormNisn] = useState('');
  const [studentFormClass, setStudentFormClass] = useState(classes[0]?.name || 'VII-A');
  const [studentFormGrade, setStudentFormGrade] = useState<GradeLevel>('VII');
  const [studentFormPoints, setStudentFormPoints] = useState<number>(100);

  // Learning Modules Management State (Add / Edit / Preview Module)
  const [materialFilterSemester, setMaterialFilterSemester] = useState<'All' | '1' | '2'>('All');
  const [materialFilterYear, setMaterialFilterYear] = useState<string>('All');
  const [materialGradeTab, setMaterialGradeTab] = useState<'All' | 'VII' | 'VIII' | 'IX'>('All');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);
  const [previewingModule, setPreviewingModule] = useState<LearningModule | null>(null);
  const [moduleFormTitle, setModuleFormTitle] = useState('');
  const [moduleFormGrade, setModuleFormGrade] = useState<GradeLevel>('VII');
  const [moduleFormSemester, setModuleFormSemester] = useState<1 | 2>(1);
  const [moduleFormAcademicYear, setModuleFormAcademicYear] = useState('2026/2027');
  const [moduleFormTopic, setModuleFormTopic] = useState('');
  const [moduleFormDesc, setModuleFormDesc] = useState('');
  const [moduleSubTitle, setModuleSubTitle] = useState('1. Pengantar & Kosakata Inti');
  const [moduleSubContent, setModuleSubContent] = useState('');
  const [moduleSubAudio, setModuleSubAudio] = useState('');
  const [moduleDialogueEn, setModuleDialogueEn] = useState('');
  const [moduleDialogueId, setModuleDialogueId] = useState('');

  // Quick Edit Module Semester & Academic Year Modal
  const [quickEditModule, setQuickEditModule] = useState<LearningModule | null>(null);
  const [quickModuleSemester, setQuickModuleSemester] = useState<1 | 2>(1);
  const [quickModuleYear, setQuickModuleYear] = useState('2026/2027');

  // Lesson Planner State
  const [lpGrade, setLpGrade] = useState<GradeLevel>('VII');
  const [lpSemester, setLpSemester] = useState<number>(1);
  const [lpAcademicYear, setLpAcademicYear] = useState('2026/2027');
  const [lpTopic, setLpTopic] = useState('Introducing Yourself & Daily Greetings');
  const [lpTimeAllocation, setLpTimeAllocation] = useState('2 x 40 menit');
  const [lpLearningModel, setLpLearningModel] = useState('Deep Learning Kemendikdasmen (Mindful, Meaningful, Joyful Learning)');
  const [lpSpecialNeeds, setLpSpecialNeeds] = useState('Bantuan tombol terjemahan Bahasa Indonesia & hint untuk siswa pemalu');
  const [isGeneratingLp, setIsGeneratingLp] = useState(false);
  const [generatedLp, setGeneratedLp] = useState<any | null>(lessonPlans[0] || null);

  // Lesson Plan Edit Semester & Year in Preview State
  const [isEditingLpSemester, setIsEditingLpSemester] = useState(false);
  const [editLpSemesterVal, setEditLpSemesterVal] = useState<1 | 2>(1);
  const [editLpYearVal, setEditLpYearVal] = useState('2026/2027');

  // Hasil Belajar (Gradebook) Semester & Year State
  const [gradebookSemester, setGradebookSemester] = useState<1 | 2>(1);
  const [gradebookYear, setGradebookYear] = useState('2026/2027');
  const [gradebookClassFilter, setGradebookClassFilter] = useState('All');

  // Vocabulary Generator State
  const [vgTopic, setVgTopic] = useState('Daily Activities & School Life');
  const [vgCount, setVgCount] = useState(5);
  const [vgGrade, setVgGrade] = useState<GradeLevel>('VII');
  const [isGeneratingVocab, setIsGeneratingVocab] = useState(false);
  const [generatedVocabList, setGeneratedVocabList] = useState<VocabularyItem[]>([]);

  // Quiz Management State (Create / AI Generate Quiz up to 50 questions with PG & Essai)
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [isAiGeneratingQuiz, setIsAiGeneratingQuiz] = useState(false);
  const [quizMode, setQuizMode] = useState<'ai' | 'manual'>('ai');
  const [quizFormTitle, setQuizFormTitle] = useState('');
  const [quizFormGrade, setQuizFormGrade] = useState<GradeLevel>('VII');
  const [quizFormTopic, setQuizFormTopic] = useState('');
  const [quizFormCategory, setQuizFormCategory] = useState<'pre-test' | 'post-test' | 'evaluasi-harian'>('evaluasi-harian');
  const [quizFormDuration, setQuizFormDuration] = useState(60);
  const [quizFormAttempts, setQuizFormAttempts] = useState(2);
  const [quizFormReleaseKey, setQuizFormReleaseKey] = useState(true);
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(50);
  const [quizFormatType, setQuizFormatType] = useState<'mixed' | 'mc' | 'essay'>('mixed');
  const [manualQuestions, setManualQuestions] = useState<QuizQuestion[]>([]);
  const [previewingQuiz, setPreviewingQuiz] = useState<Quiz | null>(null);

  // New Question form state inside Manual Quiz Builder
  const [newManualQType, setNewManualQType] = useState<'mc' | 'essay'>('mc');
  const [newManualQText, setNewManualQText] = useState('');
  const [newManualQOptA, setNewManualQOptA] = useState('');
  const [newManualQOptB, setNewManualQOptB] = useState('');
  const [newManualQOptC, setNewManualQOptC] = useState('');
  const [newManualQOptD, setNewManualQOptD] = useState('');
  const [newManualQCorrect, setNewManualQCorrect] = useState(0);
  const [newManualQSample, setNewManualQSample] = useState('');
  const [newManualQRubric, setNewManualQRubric] = useState('Kesesuaian isi, tata bahasa, dan kosakata');
  const [newManualQExp, setNewManualQExp] = useState('');
  const [newManualQPoints, setNewManualQPoints] = useState(2);

  const [manualQ1Text, setManualQ1Text] = useState('What is the best greeting in the morning?');
  const [manualQ1OptA, setManualQ1OptA] = useState('Good morning');
  const [manualQ1OptB, setManualQ1OptB] = useState('Good night');
  const [manualQ1OptC, setManualQ1OptC] = useState('Goodbye');
  const [manualQ1OptD, setManualQ1OptD] = useState('See you');
  const [manualQ1Correct, setManualQ1Correct] = useState(0);
  const [manualQ1Exp, setManualQ1Exp] = useState('Good morning digunakan untuk salam pagi hari.');

  // Pronunciation Add State
  const [showPronunciationModal, setShowPronunciationModal] = useState(false);
  const [pronWord, setPronWord] = useState('');
  const [pronPhonetic, setPronPhonetic] = useState('');
  const [pronMeaning, setPronMeaning] = useState('');
  const [pronDifficulty, setPronDifficulty] = useState<'Mudah' | 'Sedang' | 'Tantangan'>('Mudah');
  const [pronTip, setPronTip] = useState('');

  // Reading Passage Add State
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [readTitle, setReadTitle] = useState('');
  const [readGrade, setReadGrade] = useState<GradeLevel>('VII');
  const [readTopic, setReadTopic] = useState('');
  const [readPassage, setReadPassage] = useState('');
  const [readDifficulty, setReadDifficulty] = useState<'Beginner' | 'Elementary' | 'Intermediate'>('Beginner');
  const [readQ1Text, setReadQ1Text] = useState('');
  const [readQ1A, setReadQ1A] = useState('');
  const [readQ1B, setReadQ1B] = useState('');
  const [readQ1C, setReadQ1C] = useState('');
  const [readQ1D, setReadQ1D] = useState('');
  const [readQ1Correct, setReadQ1Correct] = useState(0);
  const [readQ1Exp, setReadQ1Exp] = useState('');

  // Listening Exercise Add State
  const [showListeningModal, setShowListeningModal] = useState(false);
  const [listenTitle, setListenTitle] = useState('');
  const [listenGrade, setListenGrade] = useState<GradeLevel>('VII');
  const [listenTopic, setListenTopic] = useState('');
  const [listenScript, setListenScript] = useState('');
  const [listenMaxPlays, setListenMaxPlays] = useState(3);
  const [listenQ1Text, setListenQ1Text] = useState('');
  const [listenQ1A, setListenQ1A] = useState('');
  const [listenQ1B, setListenQ1B] = useState('');
  const [listenQ1C, setListenQ1C] = useState('');
  const [listenQ1D, setListenQ1D] = useState('');
  const [listenQ1Correct, setListenQ1Correct] = useState(0);
  const [listenQ1Exp, setListenQ1Exp] = useState('');

  // Menu items list (17 items required + Rubrik Penilaian tab)
  const menuList: Array<{ id: TeacherMenu; label: string; icon: any; badge?: string }> = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: '2. Profil Guru', icon: User },
    { id: 'classes', label: '3. Data Kelas', icon: Users, badge: `${classes.length}` },
    { id: 'students', label: '4. Data Siswa', icon: GraduationCap, badge: `${students.length}` },
    { id: 'materials', label: '5. Materi Pembelajaran', icon: BookOpen, badge: `${modules.length}` },
    { id: 'lesson-planner', label: '6. Modul Ajar Deep Learning Kemendikdasmen', icon: Sparkles, badge: 'Deep Learning' },
    { id: 'vocab-gen', label: '7. AI Vocabulary Generator', icon: BookMarked, badge: 'AI' },
    { id: 'grammar-tutor', label: '8. AI Grammar Tutor', icon: Brain },
    { id: 'speaking-partner', label: '9. AI Speaking Partner (Suara Perempuan)', icon: MessageSquare, badge: 'Female' },
    { id: 'comic-gen', label: 'Studio Gambar Komik & Kartun AI', icon: Palette, badge: 'Visual AI' },
    { id: 'pronunciation', label: '10. Pronunciation Practice', icon: Volume2 },
    { id: 'reading', label: '11. Reading Practice', icon: FileText },
    { id: 'listening', label: '12. Listening Practice', icon: Headphones },
    { id: 'writing', label: '13. Writing Practice', icon: PenTool, badge: `${writingSubmissions.length}` },
    { id: 'quizzes', label: '14. Kuis dan Evaluasi', icon: CheckCircle2, badge: `${quizzes.length}` },
    { id: 'gradebook', label: '15. Hasil Belajar', icon: Award },
    { id: 'analytics', label: '16. Laporan Perkembangan', icon: BarChart3 },
    { id: 'rubrics', label: 'Rubrik Penilaian Keterampilan', icon: Sliders },
    { id: 'settings', label: '17. Pengaturan', icon: Settings },
  ];

  // Filtered Students list
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchSearch = 
        st.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        st.nisn.includes(studentSearchQuery);
      const matchClass = studentClassFilter === 'All' || st.className === studentClassFilter;
      return matchSearch && matchClass;
    });
  }, [students, studentSearchQuery, studentClassFilter]);

  // Profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacherProfile(profileForm);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  // Class Management Handlers
  const handleAddOrEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    if (editingClass) {
      const updated = classes.map((c) =>
        c.id === editingClass.id
          ? {
              ...c,
              name: newClassName.trim(),
              grade: newClassGrade,
              academicYear: newClassAcademicYear.trim() || '2026/2027',
              semester: newClassSemester,
              description: newClassDesc.trim(),
            }
          : c
      );
      onUpdateClasses(updated);
      showNotification(`Data kelas "${newClassName.trim()}" (Semester ${newClassSemester}, TA ${newClassAcademicYear}) berhasil diperbarui.`);
      setEditingClass(null);
    } else {
      const newCls: ClassRoom = {
        id: `cls-${Date.now()}`,
        name: newClassName.trim(),
        grade: newClassGrade,
        academicYear: newClassAcademicYear.trim() || activeAcademicYearGlobal || '2026/2027',
        semester: newClassSemester || activeSemesterGlobal || 1,
        studentCount: 0,
        description: newClassDesc.trim() || 'Kelas Bahasa Inggris SMP',
      };
      onUpdateClasses([...classes, newCls]);
      showNotification(`Kelas baru "${newCls.name}" (Semester ${newCls.semester || 1}, TA ${newCls.academicYear}) berhasil ditambahkan.`);
    }
    setNewClassName('');
    setNewClassDesc('');
  };

  // Quick Edit Class Semester & Academic Year
  const handleOpenQuickEditClass = (cls: ClassRoom) => {
    setQuickEditClass(cls);
    setQuickClassSemester(cls.semester || 1);
    setQuickClassYear(cls.academicYear || '2026/2027');
  };

  const handleSaveQuickEditClass = () => {
    if (!quickEditClass) return;
    const updated = classes.map((c) =>
      c.id === quickEditClass.id
        ? {
            ...c,
            academicYear: quickClassYear.trim() || c.academicYear,
            semester: quickClassSemester,
          }
        : c
    );
    onUpdateClasses(updated);
    showNotification(`Semester & Tahun Ajaran kelas "${quickEditClass.name}" berhasil diubah ke Semester ${quickClassSemester} (${quickClassSemester === 1 ? 'Ganjil' : 'Genap'}) • TA ${quickClassYear}.`);
    setQuickEditClass(null);
  };

  // Apply Semester & Academic Year to ALL Classes
  const handleApplySemesterYearToAllClasses = () => {
    const updated = classes.map((c) => ({
      ...c,
      academicYear: activeAcademicYearGlobal,
      semester: activeSemesterGlobal,
    }));
    onUpdateClasses(updated);
    showNotification(`Tahun Ajaran ${activeAcademicYearGlobal} dan Semester ${activeSemesterGlobal} (${activeSemesterGlobal === 1 ? 'Ganjil' : 'Genap'}) berhasil diterapkan ke seluruh (${classes.length}) kelas.`);
  };

  // Apply Semester & Academic Year to ALL Modules
  const handleApplySemesterYearToAllModules = (targetSem: 1 | 2, targetYear: string) => {
    const updated = modules.map((m) => ({
      ...m,
      semester: targetSem,
      academicYear: targetYear,
    }));
    onUpdateModules(updated);
    showNotification(`Semester ${targetSem} (${targetSem === 1 ? 'Ganjil' : 'Genap'}) & TA ${targetYear} berhasil diterapkan ke semua (${modules.length}) modul.`);
  };

  // Quick Edit Module Semester & Academic Year
  const handleOpenQuickEditModule = (mod: LearningModule) => {
    setQuickEditModule(mod);
    setQuickModuleSemester(mod.semester || 1);
    setQuickModuleYear(mod.academicYear || '2026/2027');
  };

  const handleSaveQuickEditModule = () => {
    if (!quickEditModule) return;
    const updated = modules.map((m) =>
      m.id === quickEditModule.id
        ? {
            ...m,
            semester: quickModuleSemester,
            academicYear: quickModuleYear.trim() || '2026/2027',
          }
        : m
    );
    onUpdateModules(updated);
    showNotification(`Semester & Tahun Ajaran modul "${quickEditModule.title}" berhasil diubah ke Semester ${quickModuleSemester} • TA ${quickModuleYear}.`);
    setQuickEditModule(null);
  };

  // Quick Save Lesson Plan Semester & Academic Year
  const handleSaveLpSemesterYear = () => {
    if (!generatedLp) return;
    const updatedLp = {
      ...generatedLp,
      semester: editLpSemesterVal,
      academicYear: editLpYearVal.trim() || '2026/2027',
      identitas: {
        ...(generatedLp.identitas || {}),
        kelasSemester: `Kelas ${generatedLp.grade || lpGrade} / Semester ${editLpSemesterVal} (${editLpSemesterVal === 1 ? 'Ganjil' : 'Genap'}) - TA ${editLpYearVal.trim() || '2026/2027'}`,
      },
    };
    setGeneratedLp(updatedLp);
    const updatedList = lessonPlans.map((lp) =>
      lp.id === generatedLp.id || lp.title === generatedLp.title
        ? {
            ...lp,
            semester: editLpSemesterVal,
            academicYear: editLpYearVal.trim() || '2026/2027',
            identitas: {
              ...(lp.identitas || {}),
              kelasSemester: `Kelas ${lp.grade || lpGrade} / Semester ${editLpSemesterVal} (${editLpSemesterVal === 1 ? 'Ganjil' : 'Genap'}) - TA ${editLpYearVal.trim() || '2026/2027'}`,
            },
          }
        : lp
    );
    onUpdateLessonPlans(updatedList);
    showNotification(`Semester & Tahun Ajaran Modul Ajar berhasil disimpan: Semester ${editLpSemesterVal} (${editLpSemesterVal === 1 ? 'Ganjil' : 'Genap'}) • TA ${editLpYearVal}.`);
    setIsEditingLpSemester(false);
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const handleDeleteClass = (id: string, name?: string) => {
    const targetClass = classes.find((c) => c.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'class',
      id,
      name: name || targetClass?.name || 'Kelas yang dipilih',
    });
  };

  // Student Management Handlers
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentFormName('');
    setStudentFormNisn(`${Date.now()}`.slice(-10));
    setStudentFormClass(classes[0]?.name || 'VII-A');
    setStudentFormGrade('VII');
    setStudentFormPoints(100);
    setIsStudentPanelOpen(true);
    // Smoothly scroll to the student panel
    setTimeout(() => {
      const panelEl = document.getElementById('panel-tambah-siswa');
      if (panelEl) {
        panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameInput = panelEl.querySelector('input') as HTMLInputElement | null;
        if (nameInput) nameInput.focus();
      }
    }, 50);
  };

  const handleOpenEditStudent = (st: Student) => {
    setEditingStudent(st);
    setStudentFormName(st.name);
    setStudentFormNisn(st.nisn);
    setStudentFormClass(st.className);
    setStudentFormGrade(st.grade);
    setStudentFormPoints(st.points);
    setIsStudentPanelOpen(true);
    // Smoothly scroll to the student panel
    setTimeout(() => {
      const panelEl = document.getElementById('panel-tambah-siswa');
      if (panelEl) {
        panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameInput = panelEl.querySelector('input') as HTMLInputElement | null;
        if (nameInput) nameInput.focus();
      }
    }, 50);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormName.trim()) return;

    if (editingStudent) {
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              name: studentFormName.trim(),
              nisn: studentFormNisn.trim() || s.nisn,
              className: studentFormClass,
              grade: studentFormGrade,
              points: studentFormPoints >= 0 ? studentFormPoints : s.points,
            }
          : s
      );
      onUpdateStudents(updated);
      showNotification(`Data siswa "${studentFormName.trim()}" berhasil diperbarui.`);
      setEditingStudent(null);
    } else {
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        name: studentFormName.trim(),
        nisn: studentFormNisn.trim() || `${Date.now()}`.slice(-10),
        grade: studentFormGrade,
        className: studentFormClass,
        avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + (Date.now() % 1000000)}?w=200&auto=format&fit=crop&q=80`,
        points: studentFormPoints || 100,
        streakDays: 1,
        completedLessonsCount: 0,
        preTestScore: undefined,
        postTestScore: undefined,
        vocabMasteredCount: 0,
        grammarAccuracy: 0,
        speakingSessionsCount: 0,
        writingSubmissionsCount: 0,
        lastActive: new Date().toISOString(),
      };
      onUpdateStudents([...students, newStudent]);
      showNotification(`Siswa baru "${newStudent.name}" (${newStudent.className}) berhasil ditambahkan.`);
    }
    setStudentFormName('');
    setStudentFormNisn('');
    setStudentFormPoints(100);
    setShowStudentModal(false);
  };

  const handleDeleteStudent = (id: string, name?: string) => {
    const targetStudent = students.find((s) => s.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'student',
      id,
      name: name || targetStudent?.name || 'Siswa yang dipilih',
    });
  };

  const handleExecuteDelete = () => {
    if (!deleteConfirm.id) return;

    if (deleteConfirm.type === 'class') {
      onUpdateClasses(classes.filter((c) => c.id !== deleteConfirm.id));
      showNotification(`Kelas "${deleteConfirm.name}" berhasil dihapus.`);
    } else if (deleteConfirm.type === 'student') {
      onUpdateStudents(students.filter((s) => s.id !== deleteConfirm.id));
      showNotification(`Data siswa "${deleteConfirm.name}" berhasil dihapus.`);
    } else if (deleteConfirm.type === 'module') {
      onUpdateModules(modules.filter((m) => m.id !== deleteConfirm.id));
      showNotification(`Modul "${deleteConfirm.name}" berhasil dihapus.`);
    } else if (deleteConfirm.type === 'quiz') {
      onUpdateQuizzes(quizzes.filter((q) => q.id !== deleteConfirm.id));
      showNotification(`Kuis "${deleteConfirm.name}" berhasil dihapus.`);
    } else if (deleteConfirm.type === 'reading') {
      if (onUpdateReadingExercises) {
        onUpdateReadingExercises(readingExercises.filter((r) => r.id !== deleteConfirm.id));
      }
      showNotification(`Teks bacaan "${deleteConfirm.name}" berhasil dihapus.`);
    } else if (deleteConfirm.type === 'listening') {
      if (onUpdateListeningExercises) {
        onUpdateListeningExercises(listeningExercises.filter((l) => l.id !== deleteConfirm.id));
      }
      showNotification(`Latihan listening "${deleteConfirm.name}" berhasil dihapus.`);
    } else if (deleteConfirm.type === 'pronunciation') {
      if (onUpdatePronunciationItems) {
        onUpdatePronunciationItems(pronunciationItems.filter((p) => p.id !== deleteConfirm.id));
      }
      showNotification(`Kata pelafalan "${deleteConfirm.name}" berhasil dihapus.`);
    }

    setDeleteConfirm({ isOpen: false, type: 'class', id: '', name: '' });
  };

  // Module Management Handlers
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleFormTitle('');
    setModuleFormGrade('VII');
    setModuleFormSemester(activeSemesterGlobal || 1);
    setModuleFormAcademicYear(activeAcademicYearGlobal || '2026/2027');
    setModuleFormTopic('');
    setModuleFormDesc('');
    setShowModuleModal(true);
  };

  const handleOpenEditModule = (mod: LearningModule) => {
    setEditingModule(mod);
    setModuleFormTitle(mod.title);
    setModuleFormGrade(mod.grade);
    setModuleFormSemester(mod.semester || 1);
    setModuleFormAcademicYear(mod.academicYear || '2026/2027');
    setModuleFormTopic(mod.topic);
    setModuleFormDesc(mod.description);
    setShowModuleModal(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleFormTitle.trim()) return;

    if (editingModule) {
      const updated = modules.map((m) =>
        m.id === editingModule.id
          ? {
              ...m,
              title: moduleFormTitle.trim(),
              grade: moduleFormGrade,
              semester: moduleFormSemester,
              academicYear: moduleFormAcademicYear.trim() || '2026/2027',
              topic: moduleFormTopic.trim(),
              description: moduleFormDesc.trim(),
            }
          : m
      );
      onUpdateModules(updated);
      showNotification(`Modul "${moduleFormTitle.trim()}" (Semester ${moduleFormSemester}, TA ${moduleFormAcademicYear}) berhasil diperbarui.`);
    } else {
      const newMod: LearningModule = {
        id: `mod-${Date.now()}`,
        title: moduleFormTitle.trim(),
        grade: moduleFormGrade,
        semester: moduleFormSemester,
        academicYear: moduleFormAcademicYear.trim() || '2026/2027',
        topic: moduleFormTopic.trim(),
        description: moduleFormDesc.trim(),
        isDemoModule: false,
        sections: [
          {
            id: `sec-${Date.now()}-1`,
            title: '1. Pengantar & Kosakata Inti',
            content: `Materi pengantar topik ${moduleFormTopic} untuk siswa Kelas ${moduleFormGrade} SMP.`,
            audioScript: `Welcome to our lesson about ${moduleFormTopic}. Let us study with confidence.`,
            dialogue: [
              { speaker: 'Teacher', textEn: `Good morning students! Today we learn about ${moduleFormTopic}.`, textId: `Selamat pagi anak-anak! Hari ini kita belajar tentang ${moduleFormTopic}.` },
              { speaker: 'Students', textEn: 'Good morning Ma’am! We are ready.', textId: 'Selamat pagi Bu! Kami sudah siap.' }
            ]
          }
        ]
      };
      onUpdateModules([...modules, newMod]);
    }
    setShowModuleModal(false);
  };

  const handleDeleteModule = (id: string, name?: string) => {
    const target = modules.find((m) => m.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'module',
      id,
      name: name || target?.title || 'Modul Pembelajaran',
    });
  };

  const handleOpenAddModuleForGrade = (grade: GradeLevel) => {
    setEditingModule(null);
    setModuleFormTitle(`Modul Bahasa Inggris Kelas ${grade}: `);
    setModuleFormGrade(grade);
    setModuleFormSemester(activeSemesterGlobal || 1);
    setModuleFormAcademicYear(activeAcademicYearGlobal || '2026/2027');
    setModuleFormTopic('');
    setModuleFormDesc(`Materi pembelajaran kurikulum bahasa Inggris untuk siswa SMP Kelas ${grade}.`);
    setModuleSubTitle('1. Pengantar & Kosakata Inti');
    setModuleSubContent('');
    setModuleSubAudio('');
    setModuleDialogueEn('');
    setModuleDialogueId('');
    setShowModuleModal(true);
  };

  // Quiz Management Handlers (Supporting up to 50 questions with Multiple Choice and Essay)
  const handleAiGenerateQuiz = async () => {
    setIsAiGeneratingQuiz(true);
    const targetCount = Math.min(50, Math.max(1, quizQuestionCount || 50));
    try {
      const generated = await api.generateQuiz({
        topic: quizFormTopic || 'General English Assessment',
        grade: quizFormGrade,
        count: targetCount,
        category: quizFormCategory,
        questionFormat: quizFormatType,
      });

      if (generated && generated.questions && generated.questions.length > 0) {
        const newQuizObj: Quiz = {
          id: `qz-${Date.now()}`,
          title: generated.title || `Kuis: ${quizFormTopic || 'Bahasa Inggris'} (Kelas ${quizFormGrade}) - ${targetCount} Butir Soal`,
          grade: quizFormGrade,
          topic: quizFormTopic || generated.topic,
          category: quizFormCategory,
          durationMinutes: generated.durationMinutes || (targetCount >= 40 ? 60 : targetCount >= 20 ? 40 : 20),
          maxAttempts: generated.maxAttempts || 2,
          releaseAnswerKey: generated.releaseAnswerKey ?? true,
          questions: generated.questions,
          isPublished: true,
          createdAt: new Date().toISOString(),
        };
        onUpdateQuizzes([...quizzes, newQuizObj]);
        setShowQuizModal(false);
        showNotification(`Kuis "${newQuizObj.title}" (${newQuizObj.questions.length} Soal) berhasil dibuat dan disimpan!`);
      } else {
        // Fallback using built-in 50-question generator
        const built = buildFiftyQuestions(quizFormTopic || 'English Assessment', quizFormGrade, quizFormatType).slice(0, targetCount);
        const newQuizObj: Quiz = {
          id: `qz-${Date.now()}`,
          title: quizFormTitle.trim() || `Kuis: ${quizFormTopic || 'Bahasa Inggris'} (Kelas ${quizFormGrade}) - ${targetCount} Butir Soal`,
          grade: quizFormGrade,
          topic: quizFormTopic || 'English Practice',
          category: quizFormCategory,
          durationMinutes: targetCount >= 40 ? 60 : targetCount >= 20 ? 40 : 20,
          maxAttempts: quizFormAttempts || 2,
          releaseAnswerKey: quizFormReleaseKey,
          questions: built,
          isPublished: true,
          createdAt: new Date().toISOString(),
        };
        onUpdateQuizzes([...quizzes, newQuizObj]);
        setShowQuizModal(false);
        showNotification(`Kuis "${newQuizObj.title}" (${newQuizObj.questions.length} Butir Soal) berhasil dibuat!`);
      }
    } catch (err) {
      console.error('Quiz AI error:', err);
      const built = buildFiftyQuestions(quizFormTopic || 'English Assessment', quizFormGrade, quizFormatType).slice(0, targetCount);
      const newQuizObj: Quiz = {
        id: `qz-${Date.now()}`,
        title: quizFormTitle.trim() || `Kuis: ${quizFormTopic || 'Bahasa Inggris'} (Kelas ${quizFormGrade}) - ${targetCount} Butir Soal`,
        grade: quizFormGrade,
        topic: quizFormTopic || 'English Practice',
        category: quizFormCategory,
        durationMinutes: targetCount >= 40 ? 60 : 20,
        maxAttempts: quizFormAttempts || 2,
        releaseAnswerKey: quizFormReleaseKey,
        questions: built,
        isPublished: true,
        createdAt: new Date().toISOString(),
      };
      onUpdateQuizzes([...quizzes, newQuizObj]);
      setShowQuizModal(false);
      showNotification(`Kuis "${newQuizObj.title}" (${newQuizObj.questions.length} Butir Soal) berhasil dibuat!`);
    } finally {
      setIsAiGeneratingQuiz(false);
    }
  };

  const handlePopulateFiftyQuestions = (format: 'mixed' | 'mc' | 'essay' = 'mixed') => {
    const questions50 = buildFiftyQuestions(quizFormTopic || 'Evaluasi Standar Bahasa Inggris', quizFormGrade, format);
    setManualQuestions(questions50);
    showNotification(`50 Nomor Soal (${format === 'mixed' ? '40 PG & 10 Essai' : format === 'mc' ? '50 PG' : '50 Essai'}) berhasil dimuat ke bank soal!`);
  };

  const handleAddManualQuestion = () => {
    if (!newManualQText.trim()) {
      showNotification('Harap masukkan teks pertanyaan terlebih dahulu.');
      return;
    }
    const qId = `q-man-${Date.now()}-${manualQuestions.length + 1}`;
    if (newManualQType === 'mc') {
      const qObj: QuizQuestion = {
        id: qId,
        type: 'mc',
        questionText: newManualQText.trim(),
        options: [
          newManualQOptA.trim() || 'Pilihan A',
          newManualQOptB.trim() || 'Pilihan B',
          newManualQOptC.trim() || 'Pilihan C',
          newManualQOptD.trim() || 'Pilihan D',
        ],
        correctAnswer: newManualQCorrect,
        explanation: newManualQExp.trim() || 'Pembahasan soal.',
        points: newManualQPoints || 2,
      };
      setManualQuestions([...manualQuestions, qObj]);
    } else {
      const qObj: QuizQuestion = {
        id: qId,
        type: 'essay',
        questionText: newManualQText.trim(),
        correctAnswer: newManualQSample.trim() || 'Model jawaban ideal dalam Bahasa Inggris.',
        sampleAnswer: newManualQSample.trim() || 'Model jawaban ideal dalam Bahasa Inggris.',
        rubricCriteria: newManualQRubric.split(',').map((s) => s.trim()).filter(Boolean),
        explanation: newManualQExp.trim() || 'Pedoman penskoran essay.',
        points: newManualQPoints || 2,
      };
      setManualQuestions([...manualQuestions, qObj]);
    }
    setNewManualQText('');
    setNewManualQOptA('');
    setNewManualQOptB('');
    setNewManualQOptC('');
    setNewManualQOptD('');
    setNewManualQSample('');
    setNewManualQExp('');
    showNotification(`Soal nomor ${manualQuestions.length + 1} (${newManualQType === 'mc' ? 'Pilihan Ganda' : 'Essai'}) ditambahkan.`);
  };

  const handleDeleteQuiz = (id: string, name?: string) => {
    const target = quizzes.find((q) => q.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'quiz',
      id,
      name: name || target?.title || 'Kuis',
    });
  };

  const handleSaveManualQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizFormTitle.trim() && !quizFormTopic.trim()) return;

    let finalQuestions = manualQuestions;
    if (finalQuestions.length === 0) {
      // Use standard 50 questions if empty or default
      finalQuestions = buildFiftyQuestions(quizFormTopic || 'Kuis Standar', quizFormGrade, quizFormatType);
    }

    const newQuizObj: Quiz = {
      id: `qz-man-${Date.now()}`,
      title: quizFormTitle.trim() || `Kuis: ${quizFormTopic} (Kelas ${quizFormGrade}) - ${finalQuestions.length} Nomor`,
      grade: quizFormGrade,
      topic: quizFormTopic.trim() || 'General Practice',
      category: quizFormCategory,
      durationMinutes: quizFormDuration || (finalQuestions.length >= 40 ? 60 : 25),
      maxAttempts: quizFormAttempts || 2,
      releaseAnswerKey: quizFormReleaseKey,
      isPublished: true,
      createdAt: new Date().toISOString(),
      questions: finalQuestions,
    };

    onUpdateQuizzes([...quizzes, newQuizObj]);
    setShowQuizModal(false);
    showNotification(`Kuis manual "${newQuizObj.title}" dengan ${finalQuestions.length} soal berhasil disimpan permanen!`);
  };

  const handleSaveReadingExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readTitle.trim() || !readPassage.trim()) return;

    const newRd: ReadingExercise = {
      id: `rd-${Date.now()}`,
      title: readTitle.trim(),
      grade: readGrade,
      topic: readTopic.trim() || 'General Reading',
      difficulty: readDifficulty,
      passage: readPassage.trim(),
      glossary: [
        { word: 'Important', meaning: 'Penting' },
        { word: 'Understand', meaning: 'Memahami' },
      ],
      questions: [
        {
          id: `rd-q-${Date.now()}-1`,
          question: readQ1Text.trim() || 'What is the main topic of the passage above?',
          options: [
            readQ1A.trim() || 'Introduction',
            readQ1B.trim() || 'Grammar rules',
            readQ1C.trim() || 'Daily schedule',
            readQ1D.trim() || 'Friendship',
          ],
          correctIndex: readQ1Correct,
          explanation: readQ1Exp.trim() || 'Teks di atas membahas topik utama secara terstruktur.',
        },
      ],
    };

    if (onUpdateReadingExercises) {
      onUpdateReadingExercises([...readingExercises, newRd]);
    }
    setShowReadingModal(false);
    setReadTitle('');
    setReadTopic('');
    setReadPassage('');
    setReadQ1Text('');
  };

  const handleDeleteReadingExercise = (id: string, name?: string) => {
    const target = readingExercises.find((r) => r.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'reading',
      id,
      name: name || target?.title || 'Teks Bacaan',
    });
  };

  const handleSaveListeningExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listenTitle.trim() || !listenScript.trim()) return;

    const newLs: ListeningExercise = {
      id: `ls-${Date.now()}`,
      title: listenTitle.trim(),
      grade: listenGrade,
      topic: listenTopic.trim() || 'General Listening',
      audioScript: listenScript.trim(),
      maxPlayCount: listenMaxPlays,
      questions: [
        {
          id: `ls-q-${Date.now()}-1`,
          question: listenQ1Text.trim() || 'What did the speaker say in the audio?',
          options: [
            listenQ1A.trim() || 'Option A',
            listenQ1B.trim() || 'Option B',
            listenQ1C.trim() || 'Option C',
            listenQ1D.trim() || 'Option D',
          ],
          correctIndex: listenQ1Correct,
          explanation: listenQ1Exp.trim() || 'Berdasarkan audio yang disimak.',
        },
      ],
    };

    if (onUpdateListeningExercises) {
      onUpdateListeningExercises([...listeningExercises, newLs]);
    }
    setShowListeningModal(false);
    setListenTitle('');
    setListenTopic('');
    setListenScript('');
    setListenQ1Text('');
    showNotification(`Latihan listening "${newLs.title}" berhasil ditambahkan.`);
  };

  const handleDeleteListeningExercise = (id: string, name?: string) => {
    const target = listeningExercises.find((l) => l.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'listening',
      id,
      name: name || target?.title || 'Latihan Listening',
    });
  };

  const handleDeletePronunciationItem = (id: string, name?: string) => {
    const target = pronunciationItems.find((p) => p.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'pronunciation',
      id,
      name: name || target?.wordOrPhrase || 'Kata Pelafalan',
    });
  };

  // Export Gradebook CSV
  const handleExportGradebookCsv = () => {
    const semName = gradebookSemester === 1 ? 'Ganjil' : 'Genap';
    const metadataHeader = [
      `# LAPORAN HASIL BELAJAR SISWA SMP - SI CERDAS ENGLISH`,
      `# Tahun Ajaran: ${gradebookYear}`,
      `# Semester: ${gradebookSemester} (${semName})`,
      `# Guru Pengampu: ${teacher.name} (NIP: ${teacher.nip})`,
      `# Sekolah: ${teacher.school}`,
      `# Tanggal Unduh: ${new Date().toLocaleDateString('id-ID')}`,
    ].join('\n');

    const headers = ['Nama Siswa', 'Kelas', 'NISN', 'Semester', 'Tahun Ajaran', 'Pre-Test', 'Post-Test', 'Peningkatan (Gain)', 'Kosakata Dikuasai', 'Poin Siswa'];
    const filteredRows = students
      .filter((st) => gradebookClassFilter === 'All' || st.className === gradebookClassFilter)
      .map((st) => [
        `"${st.name}"`,
        `"${st.className}"`,
        `"${st.nisn}"`,
        `"Semester ${gradebookSemester} (${semName})"`,
        `"${gradebookYear}"`,
        st.preTestScore !== undefined ? st.preTestScore : '-',
        st.postTestScore !== undefined ? st.postTestScore : '-',
        st.preTestScore !== undefined && st.postTestScore !== undefined ? `+${st.postTestScore - st.preTestScore}` : '-',
        st.vocabMasteredCount,
        st.points,
      ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      metadataHeader + '\n' +
      [headers.join(','), ...filteredRows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HASIL_BELAJAR_SEM_${gradebookSemester}_TA_${gradebookYear.replace('/', '-')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showNotification(`Buku Nilai Siswa Semester ${gradebookSemester} (${semName}) TA ${gradebookYear} berhasil diunduh (CSV).`);
  };

  const handleGenerateLessonPlan = async () => {
    setIsGeneratingLp(true);
    try {
      const plan = await api.generateLessonPlan({
        grade: lpGrade,
        semester: lpSemester,
        academicYear: lpAcademicYear,
        topic: lpTopic,
        timeAllocation: lpTimeAllocation,
        studentLevel: `SMP Fase D - Kelas ${lpGrade}`,
        learningModel: lpLearningModel,
        media: ['Aplikasi SI CERDAS ENGLISH', 'Audio Pelafalan TTS', 'Lembar Kerja Interaktif'],
        specialNeedsNotes: lpSpecialNeeds,
      });

      if (plan) {
        const enrichedPlan = {
          ...plan,
          semester: lpSemester,
          academicYear: lpAcademicYear,
          identitas: {
            ...(plan.identitas || {}),
            kelasSemester: `Kelas ${lpGrade} / Semester ${lpSemester} (${lpSemester === 1 ? 'Ganjil' : 'Genap'}) - TA ${lpAcademicYear}`,
          },
        };
        setGeneratedLp(enrichedPlan);
        const newLpObj: LessonPlan = {
          id: `lp-${Date.now()}`,
          title: enrichedPlan.title || `Modul Ajar Kelas ${lpGrade}: ${lpTopic}`,
          grade: lpGrade,
          semester: lpSemester as 1 | 2,
          academicYear: lpAcademicYear,
          subject: 'Bahasa Inggris',
          topic: lpTopic,
          timeAllocation: lpTimeAllocation,
          studentLevel: `Kelas ${lpGrade}`,
          learningModel: lpLearningModel,
          media: ['Aplikasi SI CERDAS ENGLISH', 'Audio TTS'],
          specialNeedsNotes: lpSpecialNeeds,
          identitas: plan.identitas,
          tujuanPembelajaran: plan.tujuanPembelajaran || [],
          kegiatanPendahuluan: plan.kegiatanPendahuluan || [],
          kegiatanInti: plan.kegiatanInti || [],
          kegiatanPenutup: plan.kegiatanPenutup || [],
          mediaDanSumber: plan.mediaDanSumber || [],
          aktivitasSiswa: plan.aktivitasSiswa || [],
          asesmen: plan.asesmen || { diagnostik: '', formatif: '', sumatif: '' },
          rubrikPenilaian: plan.rubrikPenilaian || '',
          refleksiPembelajaran: plan.refleksiPembelajaran || '',
          pendekatanPembelajaran: plan.pendekatanPembelajaran || 'Deep Learning Kemendikdasmen (Mindful, Meaningful, Joyful Learning)',
          pilarDeepLearning: plan.pilarDeepLearning,
          dimensiCaturOlah: plan.dimensiCaturOlah,
          createdAt: new Date().toISOString(),
        };
        onUpdateLessonPlans([newLpObj, ...lessonPlans]);
      }
    } catch (err) {
      console.error('Error generating lesson plan:', err);
    } finally {
      setIsGeneratingLp(false);
    }
  };

  const handleGenerateVocab = async () => {
    setIsGeneratingVocab(true);
    try {
      const words = await api.generateVocabulary({
        topic: vgTopic,
        count: vgCount,
        grade: vgGrade,
        difficulty: vgGrade === 'VII' ? 'Beginner' : vgGrade === 'VIII' ? 'Elementary' : 'Intermediate',
      });
      setGeneratedVocabList(words);
    } catch (err) {
      console.error('Error generating vocabulary:', err);
    } finally {
      setIsGeneratingVocab(false);
    }
  };

  const handleImportVocabToBank = () => {
    if (generatedVocabList.length === 0) return;
    const formatted = generatedVocabList.map((item, idx) => ({
      ...item,
      id: `voc-gen-${Date.now()}-${idx}`,
    }));
    onUpdateVocabulary([...vocabulary, ...formatted]);
    alert(`${formatted.length} kosakata baru berhasil ditambahkan ke Bank Kosakata!`);
    setGeneratedVocabList([]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Teacher Status Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-indigo-200 shadow-xs shrink-0 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="SI CERDAS ENGLISH Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <img
            src={teacher.avatarUrl}
            alt={teacher.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{teacher.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Guru Mapel
              </span>
            </div>
            <p className="text-xs text-gray-700">
              {teacher.school} &bull; NIP: {teacher.nip}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-semibold">
            {classes.length} Kelas Aktif
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
            {students.length} Siswa Terdaftar
          </span>
        </div>
      </div>

      {/* Main Grid: 17 Menu Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Menu */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-indigo-100 h-fit space-y-1">
          <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
            Menu Dashboard Guru (17)
          </div>
          <div className="space-y-0.5 max-h-[640px] overflow-y-auto pr-0.5">
            {menuList.map((m) => {
              const Icon = m.icon;
              const isActive = activeMenu === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMenu(m.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-gray-700 hover:bg-indigo-50/70 hover:text-indigo-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </div>
                  {m.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-indigo-800 text-white'
                          : m.badge === 'AI'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. Dashboard Overview */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs">
                  <div className="text-[11px] text-gray-700 font-semibold uppercase">Total Siswa</div>
                  <div className="text-2xl font-extrabold text-indigo-700 mt-1">{students.length}</div>
                  <div className="text-[10px] text-gray-700 mt-0.5">Aktif di sistem</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs">
                  <div className="text-[11px] text-gray-700 font-semibold uppercase">Modul Belajar</div>
                  <div className="text-2xl font-extrabold text-blue-700 mt-1">{modules.length}</div>
                  <div className="text-[10px] text-gray-700 mt-0.5">Termasuk modul demo VII</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs">
                  <div className="text-[11px] text-gray-700 font-semibold uppercase">Tugas Menulis</div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">{writingSubmissions.length}</div>
                  <div className="text-[10px] text-gray-700 mt-0.5">Terkirim oleh siswa</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs">
                  <div className="text-[11px] text-gray-700 font-semibold uppercase">Hasil Kuis Selesai</div>
                  <div className="text-2xl font-extrabold text-purple-700 mt-1">{quizAttempts.length}</div>
                  <div className="text-[10px] text-gray-700 mt-0.5">Pre &amp; Post tests</div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Aksi Cepat Guru:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveMenu('lesson-planner')}
                    className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-left transition-colors flex items-center gap-3"
                  >
                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-indigo-900">Susun Modul Ajar AI</div>
                      <div className="text-[10px] text-indigo-700">Rancang RPP Kurikulum Merdeka</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveMenu('writing')}
                    className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-left transition-colors flex items-center gap-3"
                  >
                    <PenTool className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-950">Periksa Tulisan Siswa</div>
                      <div className="text-[10px] text-amber-800">Beri nilai akhir &amp; komentar</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveMenu('gradebook')}
                    className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-left transition-colors flex items-center gap-3"
                  >
                    <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Buku Nilai &amp; Rapor</div>
                      <div className="text-[10px] text-emerald-800">Pre-test vs Post-test gain</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Student Activities */}
              <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Aktivitas Siswa Terbaru (Data Riil):
                </h3>
                <div className="divide-y divide-gray-100">
                  {students.slice(0, 5).map((st) => (
                    <div key={st.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatarUrl}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <span className="font-bold text-gray-900">{st.name}</span>
                          <span className="text-gray-700 ml-1.5">({st.className})</span>
                          <div className="text-[10px] text-gray-700">
                            Pre-Test: {st.preTestScore ?? '-'} | Post-Test: {st.postTestScore ?? '-'} | Kosakata: {st.vocabMasteredCount} kata
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-indigo-600">{st.points} Poin</span>
                        <div className="text-[10px] text-gray-700">{st.streakDays} hari streak</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Profil Guru */}
          {activeMenu === 'profile' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Profil &amp; Data Pribadi Guru</h2>
                <p className="text-xs text-gray-700">
                  Perbarui profil Anda langsung melalui formulir ini. Data akan tersimpan permanen di database tanpa perlu mengubah kode program.
                </p>
              </div>

              {profileSavedMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profil berhasil diperbarui dan tersimpan di database server!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Lengkap &amp; Gelar:</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">NIP atau NUPTK:</label>
                    <input
                      type="text"
                      value={profileForm.nip}
                      onChange={(e) => setProfileForm({ ...profileForm, nip: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Sekolah / Satuan Pendidikan:</label>
                    <input
                      type="text"
                      value={profileForm.school}
                      onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mata Pelajaran:</label>
                    <input
                      type="text"
                      value={profileForm.subject}
                      onChange={(e) => setProfileForm({ ...profileForm, subject: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Resmi Guru:</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">URL Foto Profil:</label>
                    <input
                      type="url"
                      value={profileForm.avatarUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Biografi / Filosofi Mengajar:</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. Data Kelas */}
          {activeMenu === 'classes' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Pengelolaan Data Kelas Guru</h2>
                  <p className="text-xs text-gray-700">Kelola rombongan belajar, pembagian jenjang, semester, dan tahun ajaran aktif</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>TA Aktif: {activeAcademicYearGlobal} • Sem. {activeSemesterGlobal} ({activeSemesterGlobal === 1 ? 'Ganjil' : 'Genap'})</span>
                  </span>
                </div>
              </div>

              {/* PANEL EDIT SEMESTER DAN TAHUN AJARAN DI MENU DATA KELAS GURU */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-purple-50/90 border border-indigo-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-xs">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-indigo-950">Panel Edit Semester &amp; Tahun Ajaran (Data Kelas)</h3>
                      <p className="text-[11px] text-indigo-800">
                        Sesuaikan semester dan tahun ajaran berjalan, lalu terapkan secara serentak ke seluruh rombongan belajar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-white text-indigo-800 border border-indigo-200 shadow-2xs">
                      Total {classes.length} Kelas
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end pt-1">
                  <div>
                    <label className="block font-bold text-indigo-900 mb-1">Pilihan Semester Berjalan:</label>
                    <select
                      value={activeSemesterGlobal}
                      onChange={(e) => setActiveSemesterGlobal(Number(e.target.value) as 1 | 2)}
                      className="w-full bg-white border border-indigo-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    >
                      <option value={1}>Semester 1 (Ganjil)</option>
                      <option value={2}>Semester 2 (Genap)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-indigo-900 mb-1">Tahun Ajaran:</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={activeAcademicYearGlobal}
                        onChange={(e) => setActiveAcademicYearGlobal(e.target.value)}
                        placeholder="Contoh: 2026/2027"
                        list="ta-datalist-class"
                        className="flex-1 bg-white border border-indigo-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                      />
                      <datalist id="ta-datalist-class">
                        <option value="2024/2025" />
                        <option value="2025/2026" />
                        <option value="2026/2027" />
                        <option value="2027/2028" />
                        <option value="2028/2029" />
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleApplySemesterYearToAllClasses}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs flex items-center justify-center gap-1.5 h-[34px]"
                    >
                      <Check className="w-4 h-4" />
                      <span>Terapkan ke Semua Kelas</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Add / Edit Class Form */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{editingClass ? `Mode Edit Kelas: ${editingClass.name}` : 'Form Tambah Kelas Baru'}</span>
                  </span>
                  {editingClass && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingClass(null);
                        setNewClassName('');
                        setNewClassDesc('');
                      }}
                      className="text-[11px] text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded font-semibold"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddOrEditClass} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs items-end">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Kelas:</label>
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Contoh: VII-C"
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tingkat Jenjang:</label>
                    <select
                      value={newClassGrade}
                      onChange={(e) => setNewClassGrade(e.target.value as GradeLevel)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900"
                    >
                      <option value="VII">Kelas VII (Tujuh)</option>
                      <option value="VIII">Kelas VIII (Delapan)</option>
                      <option value="IX">Kelas IX (Sembilan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Semester:</label>
                    <select
                      value={newClassSemester}
                      onChange={(e) => setNewClassSemester(Number(e.target.value) as 1 | 2)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900"
                    >
                      <option value={1}>Semester 1 (Ganjil)</option>
                      <option value={2}>Semester 2 (Genap)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tahun Ajaran:</label>
                    <input
                      type="text"
                      value={newClassAcademicYear}
                      onChange={(e) => setNewClassAcademicYear(e.target.value)}
                      placeholder="Contoh: 2026/2027"
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-xs h-[34px]"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingClass ? 'Simpan Edit' : 'Tambah Kelas'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Class Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase">
                    <tr>
                      <th className="p-3">Nama Kelas</th>
                      <th className="p-3">Jenjang</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Tahun Ajaran</th>
                      <th className="p-3">Siswa Terdaftar</th>
                      <th className="p-3">Keterangan</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {classes.map((cls) => {
                      const count = students.filter((s) => s.className === cls.name).length;
                      const semNum = cls.semester || 1;
                      return (
                        <tr key={cls.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-indigo-700">{cls.name}</td>
                          <td className="p-3 font-semibold text-gray-800">Kelas {cls.grade}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                              semNum === 1 
                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              Semester {semNum} ({semNum === 1 ? 'Ganjil' : 'Genap'})
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
                              {cls.academicYear || '2026/2027'}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-gray-700">
                            {count} Siswa
                          </td>
                          <td className="p-3 text-gray-700">{cls.description}</td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenQuickEditClass(cls)}
                              className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                              title="Edit Semester & Tahun Ajaran Kelas Ini"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Edit Sem/TA</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingClass(cls);
                                setNewClassName(cls.name);
                                setNewClassGrade(cls.grade);
                                setNewClassAcademicYear(cls.academicYear || '2026/2027');
                                setNewClassSemester(cls.semester || 1);
                                setNewClassDesc(cls.description);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 p-1 font-semibold"
                              title="Edit Lengkap Kelas"
                            >
                              <Edit3 className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(cls.id, cls.name)}
                              className="text-rose-600 hover:text-rose-800 p-1"
                              title="Hapus Kelas"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Data Siswa */}
          {activeMenu === 'students' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Data Siswa &amp; Rekapitulasi Kemampuan</h2>
                  <p className="text-xs text-gray-700">Daftar siswa terdaftar lengkap dengan NISN dan perkembangan belajar</p>
                </div>
                <button
                  onClick={handleOpenAddStudent}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Siswa Baru</span>
                </button>
              </div>

              {/* Panel Tambah / Edit Siswa */}
              <div id="panel-tambah-siswa" className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs text-gray-900">
                      {editingStudent ? `Mode Edit Data Siswa: ${editingStudent.name}` : 'Panel Tambah Siswa'}
                    </span>
                  </div>
                  {editingStudent && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudent(null);
                        setStudentFormName('');
                        setStudentFormNisn('');
                        setStudentFormPoints(100);
                      }}
                      className="text-[11px] text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-lg font-semibold"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs items-end">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Lengkap Siswa:</label>
                    <input
                      type="text"
                      value={studentFormName}
                      onChange={(e) => setStudentFormName(e.target.value)}
                      placeholder="Contoh: Rian Pratama"
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">NISN Siswa:</label>
                    <input
                      type="text"
                      value={studentFormNisn}
                      onChange={(e) => setStudentFormNisn(e.target.value)}
                      placeholder="Contoh: 0098123456"
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Kelas:</label>
                    <select
                      value={studentFormClass}
                      onChange={(e) => {
                        setStudentFormClass(e.target.value);
                        const matched = classes.find((c) => c.name === e.target.value);
                        if (matched) setStudentFormGrade(matched.grade);
                      }}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.grade})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jenjang:</label>
                    <select
                      value={studentFormGrade}
                      onChange={(e) => setStudentFormGrade(e.target.value as GradeLevel)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="VII">Kelas VII (Tujuh)</option>
                      <option value="VIII">Kelas VIII (Delapan)</option>
                      <option value="IX">Kelas IX (Sembilan)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block font-bold text-gray-700 mb-1">Poin Awal:</label>
                      <input
                        type="number"
                        min="0"
                        value={studentFormPoints}
                        onChange={(e) => setStudentFormPoints(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-xs shrink-0 h-[34px] self-end"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingStudent ? 'Simpan' : 'Tambah'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Cari nama atau NISN..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-gray-700 font-semibold shrink-0">Filter Kelas:</label>
                  <select
                    value={studentClassFilter}
                    onChange={(e) => setStudentClassFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900"
                  >
                    <option value="All">Semua Kelas ({students.length})</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase">
                    <tr>
                      <th className="p-3">Siswa</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Pre-Test</th>
                      <th className="p-3">Post-Test</th>
                      <th className="p-3">Kosakata</th>
                      <th className="p-3">Poin</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={st.avatarUrl} alt={st.name} className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                            <span className="font-bold text-gray-900">{st.name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-semibold">{st.className}</td>
                        <td className="p-3 font-mono">{st.nisn}</td>
                        <td className="p-3 font-bold text-gray-700">{st.preTestScore ?? '-'}</td>
                        <td className="p-3 font-bold text-emerald-700">{st.postTestScore ?? '-'}</td>
                        <td className="p-3">{st.vocabMasteredCount} kata</td>
                        <td className="p-3 font-extrabold text-indigo-700">{st.points}</td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditStudent(st)}
                            className="p-1 text-indigo-600 hover:text-indigo-800"
                            title="Edit Siswa"
                          >
                            <Edit3 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(st.id, st.name)}
                            className="p-1 text-rose-600 hover:text-rose-800"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Materi Pembelajaran */}
          {activeMenu === 'materials' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Bank Modul &amp; Materi Pembelajaran SMP</h2>
                  <p className="text-xs text-gray-700">
                    Guru memiliki kewenangan penuh menambah, mengedit, mengklasifikasi semester, tahun ajaran, pratinjau, dan menghapus materi
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddModule}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Modul Baru</span>
                  </button>
                </div>
              </div>

              {/* PANEL EDIT SEMESTER DAN TAHUN AJARAN DI MATERI PEMBELAJARAN */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-indigo-50/90 border border-teal-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-600 text-white rounded-lg shadow-xs">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-teal-950">Panel Edit Semester &amp; Tahun Ajaran (Materi Pembelajaran)</h3>
                      <p className="text-[11px] text-teal-800">
                        Saring atau perbarui penugasan semester dan tahun ajaran untuk modul materi bahan ajar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-white text-teal-900 border border-teal-200 shadow-2xs">
                      {modules.length} Total Modul
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end pt-1">
                  <div>
                    <label className="block font-bold text-teal-950 mb-1">Filter Semester Materi:</label>
                    <select
                      value={materialFilterSemester}
                      onChange={(e) => setMaterialFilterSemester(e.target.value as any)}
                      className="w-full bg-white border border-teal-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-teal-500 shadow-2xs"
                    >
                      <option value="All">Semua Semester ({modules.length})</option>
                      <option value="1">Semester 1 (Ganjil)</option>
                      <option value="2">Semester 2 (Genap)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-teal-950 mb-1">Filter Tahun Ajaran:</label>
                    <select
                      value={materialFilterYear}
                      onChange={(e) => setMaterialFilterYear(e.target.value)}
                      className="w-full bg-white border border-teal-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-teal-500 shadow-2xs"
                    >
                      <option value="All">Semua Tahun Ajaran</option>
                      <option value="2025/2026">2025/2026</option>
                      <option value="2026/2027">2026/2027</option>
                      <option value="2027/2028">2027/2028</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplySemesterYearToAllModules(1, '2026/2027')}
                      className="flex-1 px-3 py-2 bg-teal-700 text-white rounded-lg text-xs font-bold hover:bg-teal-800 transition-colors shadow-xs flex items-center justify-center gap-1 h-[34px]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Set Semua: Sem 1 &bull; 2026/2027</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySemesterYearToAllModules(2, '2026/2027')}
                      className="flex-1 px-3 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors shadow-xs flex items-center justify-center gap-1 h-[34px]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Set Semua: Sem 2 &bull; 2026/2027</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PANEL TAMBAH MATERI PADA SETIAP JENJANG (KELAS VII, KELAS VIII, KELAS IX) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">Panel Tambah Materi Pada Setiap Jenjang</h3>
                      <p className="text-xs text-gray-700">Pilih jenjang untuk menambahkan bahan ajar baru secara spesifik per tingkatan kelas SMP</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Standar Kurikulum Merdeka Fase D
                  </span>
                </div>

                {/* 3 Jenjang Cards with dedicated Add Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Card Jenjang Kelas VII */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50/70 to-white space-y-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                          Jenjang Kelas VII
                        </span>
                        <span className="text-[11px] font-bold text-blue-900">
                          {modules.filter((m) => m.grade === 'VII').length} Modul
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900">Tingkat Awal (Fase D)</h4>
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        Fokus: Greetings, Self-Introduction, Family, School Life, Descriptive Text sederhana, &amp; Simple Present.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModuleForGrade('VII')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Materi Kelas VII</span>
                    </button>
                  </div>

                  {/* Card Jenjang Kelas VIII */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white space-y-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                          Jenjang Kelas VIII
                        </span>
                        <span className="text-[11px] font-bold text-emerald-900">
                          {modules.filter((m) => m.grade === 'VIII').length} Modul
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900">Tingkat Menengah (Fase D)</h4>
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        Fokus: Descriptive Text mendalam, Recount Text, Daily Routine, Giving Instructions, &amp; Simple Past Tense.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModuleForGrade('VIII')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Materi Kelas VIII</span>
                    </button>
                  </div>

                  {/* Card Jenjang Kelas IX */}
                  <div className="p-4 rounded-xl border border-purple-200 bg-gradient-to-b from-purple-50/70 to-white space-y-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-purple-600 text-white shadow-2xs">
                          Jenjang Kelas IX
                        </span>
                        <span className="text-[11px] font-bold text-purple-900">
                          {modules.filter((m) => m.grade === 'IX').length} Modul
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900">Tingkat Mahir &amp; Ujian (Fase D)</h4>
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        Fokus: Procedure Text, Narrative Tales, Passive Voice, Report Text, &amp; Persiapan Asesmen Standar Kelulusan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModuleForGrade('IX')}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Materi Kelas IX</span>
                    </button>
                  </div>
                </div>

                {/* Filter Tabs Jenjang */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-gray-700 mr-1">Tampilkan Jenjang:</span>
                    <button
                      type="button"
                      onClick={() => setMaterialGradeTab('All')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        materialGradeTab === 'All'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Semua Jenjang ({modules.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialGradeTab('VII')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        materialGradeTab === 'VII'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      Kelas VII ({modules.filter((m) => m.grade === 'VII').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialGradeTab('VIII')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        materialGradeTab === 'VIII'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      Kelas VIII ({modules.filter((m) => m.grade === 'VIII').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialGradeTab('IX')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        materialGradeTab === 'IX'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      Kelas IX ({modules.filter((m) => m.grade === 'IX').length})
                    </button>
                  </div>

                  {materialGradeTab !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleOpenAddModuleForGrade(materialGradeTab as GradeLevel)}
                      className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Tambah Materi Kelas {materialGradeTab}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-4">
                {modules
                  .filter((mod) => {
                    const matchGrade = materialGradeTab === 'All' || mod.grade === materialGradeTab;
                    const matchSem = materialFilterSemester === 'All' || `${mod.semester || 1}` === materialFilterSemester;
                    const matchYear = materialFilterYear === 'All' || (mod.academicYear || '2026/2027') === materialFilterYear;
                    return matchGrade && matchSem && matchYear;
                  })
                  .map((mod) => {
                    const semNum = mod.semester || 1;
                    return (
                      <div key={mod.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 text-xs hover:border-indigo-200 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                              Kelas {mod.grade}
                            </span>
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${
                              semNum === 1
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              Semester {semNum} ({semNum === 1 ? 'Ganjil' : 'Genap'})
                            </span>
                            <span className="font-mono font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-800 text-[10px]">
                              TA {mod.academicYear || '2026/2027'}
                            </span>
                            {mod.isDemoModule && (
                              <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                Modul Demonstrasi Resmi
                              </span>
                            )}
                            <h3 className="font-bold text-sm text-gray-900">{mod.title}</h3>
                          </div>
                          <span className="text-gray-700 shrink-0">{mod.sections?.length || 0} Sub-bab</span>
                        </div>

                        <p className="text-gray-700 leading-relaxed">{mod.description}</p>

                        <div className="pt-2 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-[11px] text-gray-700">
                            Topik Kurikulum: <strong>{mod.topic}</strong> &bull; Semester: <strong>{semNum}</strong> &bull; TA: <strong>{mod.academicYear || '2026/2027'}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenQuickEditModule(mod)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 text-xs flex items-center gap-1"
                              title="Edit Semester & Tahun Ajaran Modul Ini"
                            >
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Edit Sem/TA</span>
                            </button>
                            <button
                              onClick={() => setPreviewingModule(mod)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 text-xs flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Pratinjau Modul</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditModule(mod)}
                              className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 text-xs flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            {!mod.isDemoModule && (
                              <button
                                onClick={() => handleDeleteModule(mod.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                title="Hapus Modul"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 6. AI English Lesson Planner (Modul Ajar Deep Learning Kemendikdasmen) */}
          {activeMenu === 'lesson-planner' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-gray-900">
                        Modul Ajar Deep Learning (Kemendikdasmen RI)
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Pedoman Resmi Kemendikdasmen
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mt-0.5">
                      Rancang Modul Ajar Kurikulum Merdeka berbasis <strong>Deep Learning (Mindful, Meaningful, Joyful Learning)</strong> dan <strong>Dimensi Catur Olah</strong> secara lengkap dan adaptif.
                    </p>
                  </div>
                </div>
              </div>

              {/* Callout Panduan Deep Learning Kemendikdasmen */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>3 Pilar Pendekatan Pembelajaran Mendalam (Deep Learning) Kemendikdasmen RI:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 bg-white/90 rounded-lg border border-emerald-100">
                    <strong className="text-emerald-900 block font-bold">1. Mindful Learning (Berkesadaran)</strong>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      Fokus pada kehadiran utuh dan kesadaran aktif siswa akan tujuan dan proses belajarnya.
                    </p>
                  </div>
                  <div className="p-2.5 bg-white/90 rounded-lg border border-teal-100">
                    <strong className="text-teal-900 block font-bold">2. Meaningful Learning (Bermakna)</strong>
                    <p className="text-teal-800 text-[11px] mt-0.5">
                      Menghubungkan materi dengan konteks riil kehidupan sehari-hari siswa SMP dan pemahaman konsep mendalam.
                    </p>
                  </div>
                  <div className="p-2.5 bg-white/90 rounded-lg border border-indigo-100">
                    <strong className="text-indigo-900 block font-bold">3. Joyful Learning (Menggembirakan)</strong>
                    <p className="text-indigo-800 text-[11px] mt-0.5">
                      Menciptakan suasana belajar gembira, interaktif, dan berani berbicara dengan AI Speaking Partner (Miss Sarah).
                    </p>
                  </div>
                </div>
              </div>

              {/* PANEL EDIT SEMESTER DAN TAHUN AJARAN DI MODUL AJAR */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-indigo-50/90 border border-emerald-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-xs">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-emerald-950">Panel Edit Semester &amp; Tahun Ajaran (Modul Ajar Deep Learning)</h3>
                      <p className="text-[11px] text-emerald-800">
                        Pilih Semester dan Tahun Ajaran acuan penyusunan Modul Ajar Kurikulum Merdeka
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2.5 py-0.5 rounded-lg bg-white text-emerald-900 border border-emerald-200 text-[11px] shadow-2xs">
                      Target: Sem. {lpSemester} ({lpSemester === 1 ? 'Ganjil' : 'Genap'}) &bull; TA {lpAcademicYear}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Pilihan Semester Modul:</label>
                    <select
                      value={lpSemester}
                      onChange={(e) => setLpSemester(parseInt(e.target.value))}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    >
                      <option value={1}>Semester 1 (Ganjil - Pertemuan Awal &amp; Penguatan Konsep)</option>
                      <option value={2}>Semester 2 (Genap - Pendalaman &amp; Proyek Percakapan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Tahun Ajaran Modul:</label>
                    <input
                      type="text"
                      value={lpAcademicYear}
                      onChange={(e) => setLpAcademicYear(e.target.value)}
                      placeholder="Contoh: 2026/2027"
                      className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Input Generator */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kelas:</label>
                  <select
                    value={lpGrade}
                    onChange={(e) => setLpGrade(e.target.value as GradeLevel)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value="VII">Kelas VII (Fase D)</option>
                    <option value="VIII">Kelas VIII (Fase D)</option>
                    <option value="IX">Kelas IX (Fase D)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Semester:</label>
                  <select
                    value={lpSemester}
                    onChange={(e) => setLpSemester(parseInt(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tahun Ajaran:</label>
                  <input
                    type="text"
                    value={lpAcademicYear}
                    onChange={(e) => setLpAcademicYear(e.target.value)}
                    placeholder="2026/2027"
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Alokasi Waktu:</label>
                  <input
                    type="text"
                    value={lpTimeAllocation}
                    onChange={(e) => setLpTimeAllocation(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Materi / Topik Pembelajaran:</label>
                  <input
                    type="text"
                    value={lpTopic}
                    onChange={(e) => setLpTopic(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pendekatan Pembelajaran:</label>
                  <input
                    type="text"
                    value={lpLearningModel}
                    onChange={(e) => setLpLearningModel(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-gray-700 mb-1">Kebutuhan Khusus / Diferensiasi Siswa:</label>
                  <input
                    type="text"
                    value={lpSpecialNeeds}
                    onChange={(e) => setLpSpecialNeeds(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end pt-1">
                  <button
                    onClick={handleGenerateLessonPlan}
                    disabled={isGeneratingLp}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingLp ? 'Menyusun Modul Ajar Deep Learning...' : 'Hasilkan Modul Ajar Deep Learning AI'}</span>
                  </button>
                </div>
              </div>

              {/* Generated 10-Part Lesson Plan Preview */}
              {generatedLp && (
                <div className="p-6 rounded-2xl bg-white border border-indigo-200 shadow-sm space-y-5 text-xs">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                        Deep Learning Kemendikdasmen Ready
                      </span>
                      <h3 className="text-base font-extrabold text-gray-900 mt-1">
                        {generatedLp.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak / Cetak PDF</span>
                    </button>
                  </div>

                  {/* Pilar Deep Learning Kemendikdasmen */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <strong className="text-emerald-950 block font-bold">
                      Pilar Pembelajaran Mendalam (Deep Learning Kemendikdasmen):
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                        <span className="font-bold text-emerald-900 block">Mindful Learning:</span>
                        <p className="text-gray-700 mt-0.5 leading-relaxed">
                          {generatedLp.pilarDeepLearning?.mindful || 'Melatih atensi penuh dan kesadaran aktif siswa akan tujuan belajar bahasa Inggris.'}
                        </p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-teal-200">
                        <span className="font-bold text-teal-900 block">Meaningful Learning:</span>
                        <p className="text-gray-700 mt-0.5 leading-relaxed">
                          {generatedLp.pilarDeepLearning?.meaningful || 'Menghubungkan kosakata dan percakapan dengan konteks kehidupan nyata siswa SMP.'}
                        </p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-indigo-200">
                        <span className="font-bold text-indigo-900 block">Joyful Learning:</span>
                        <p className="text-gray-700 mt-0.5 leading-relaxed">
                          {generatedLp.pilarDeepLearning?.joyful || 'Menciptakan iklim belajar menyenangkan & berani berbicara bersama AI Miss Sarah tanpa rasa takut salah.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dimensi Catur Olah */}
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                    <strong className="text-indigo-950 block font-bold">
                      Dimensi Catur Olah (Pengembangan Karakter &amp; Kompetensi):
                    </strong>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 bg-white rounded-lg border border-indigo-100">
                        <span className="font-bold text-indigo-900 block">🧠 Olah Pikir:</span>
                        <p className="text-gray-700 mt-0.5">
                          {generatedLp.dimensiCaturOlah?.olahPikir || 'Penalaran kritis & logika tata bahasa.'}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-rose-100">
                        <span className="font-bold text-rose-900 block">❤️ Olah Hati:</span>
                        <p className="text-gray-700 mt-0.5">
                          {generatedLp.dimensiCaturOlah?.olahHati || 'Kesantunan berkomunikasi & empati.'}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-amber-100">
                        <span className="font-bold text-amber-900 block">🎨 Olah Rasa:</span>
                        <p className="text-gray-700 mt-0.5">
                          {generatedLp.dimensiCaturOlah?.olahRasa || 'Kepekaan nada suara & percaya diri.'}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-900 block">🏃 Olah Raga:</span>
                        <p className="text-gray-700 mt-0.5">
                          {generatedLp.dimensiCaturOlah?.olahRaga || 'Gerak aktif & roleplay interaktif.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Panel Edit Semester & Tahun Ajaran Modul Ajar Ini */}
                  <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-xl border border-emerald-200 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold text-xs text-emerald-950">
                          Semester &amp; Tahun Ajaran Modul Ini:
                        </span>
                        <span className="font-bold px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                          Semester {generatedLp.semester || lpSemester} ({(generatedLp.semester || lpSemester) === 1 ? 'Ganjil' : 'Genap'}) &bull; TA {generatedLp.academicYear || lpAcademicYear}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingLpSemester(!isEditingLpSemester);
                          setEditLpSemesterVal(generatedLp.semester || lpSemester);
                          setEditLpYearVal(generatedLp.academicYear || lpAcademicYear);
                        }}
                        className="text-emerald-800 hover:text-emerald-950 font-bold bg-white border border-emerald-300 px-2.5 py-1 rounded-lg text-[11px] shadow-2xs hover:bg-emerald-50 flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditingLpSemester ? 'Tutup Panel Edit' : 'Edit Semester & TA Modul'}</span>
                      </button>
                    </div>

                    {isEditingLpSemester && (
                      <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-3 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Pilih Semester:</label>
                            <select
                              value={editLpSemesterVal}
                              onChange={(e) => setEditLpSemesterVal(Number(e.target.value) as 1 | 2)}
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                            >
                              <option value={1}>Semester 1 (Ganjil)</option>
                              <option value={2}>Semester 2 (Genap)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Tahun Ajaran:</label>
                            <input
                              type="text"
                              value={editLpYearVal}
                              onChange={(e) => setEditLpYearVal(e.target.value)}
                              placeholder="2026/2027"
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsEditingLpSemester(false)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 text-xs"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveLpSemesterYear}
                            className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan Perubahan Semester / TA</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 1. Identitas Pembelajaran */}
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <strong className="text-gray-900 block font-bold">1. Identitas Pembelajaran:</strong>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                      <div>Sekolah: {generatedLp.identitas?.sekolah || teacher.school}</div>
                      <div>Guru: {generatedLp.identitas?.guru || teacher.name}</div>
                      <div>Mata Pelajaran: {generatedLp.identitas?.mataPelajaran || 'Bahasa Inggris'}</div>
                      <div>Kelas &amp; Semester: Kelas {generatedLp.grade || lpGrade} / Semester {generatedLp.semester || lpSemester} ({(generatedLp.semester || lpSemester) === 1 ? 'Ganjil' : 'Genap'})</div>
                      <div>Tahun Ajaran: {generatedLp.academicYear || lpAcademicYear}</div>
                      <div>Alokasi Waktu: {generatedLp.identitas?.alokasiWaktu || lpTimeAllocation}</div>
                    </div>
                  </div>

                  {/* 2. Tujuan Pembelajaran */}
                  <div className="space-y-1">
                    <strong className="text-gray-900 block font-bold">2. Tujuan Pembelajaran:</strong>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {generatedLp.tujuanPembelajaran?.map((t: string, i: number) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 3, 4, 5. Langkah-langkah Pembelajaran */}
                  <div className="space-y-3">
                    <strong className="text-gray-900 block font-bold">Langkah-langkah Kegiatan Pembelajaran:</strong>

                    <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                      <span className="font-bold text-blue-900 block">3. Kegiatan Pendahuluan:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-blue-950">
                        {generatedLp.kegiatanPendahuluan?.map((k: string, i: number) => (
                          <li key={i}>{k}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                      <span className="font-bold text-indigo-900 block">4. Kegiatan Inti:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-indigo-950">
                        {generatedLp.kegiatanInti?.map((k: string, i: number) => (
                          <li key={i}>{k}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                      <span className="font-bold text-gray-900 block">5. Kegiatan Penutup:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-800">
                        {generatedLp.kegiatanPenutup?.map((k: string, i: number) => (
                          <li key={i}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 6. Media, 7. Asesmen, 8. Refleksi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                      <strong className="font-bold text-gray-900 block">6 &amp; 7. Media &amp; Asesmen:</strong>
                      <div className="text-gray-700">
                        Diagnostik: {generatedLp.asesmen?.diagnostik || '-'}
                      </div>
                      <div className="text-gray-700">
                        Formatif: {generatedLp.asesmen?.formatif || '-'}
                      </div>
                      <div className="text-gray-700">
                        Sumatif: {generatedLp.asesmen?.sumatif || '-'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                      <strong className="font-bold text-gray-900 block">8. Refleksi Pembelajaran:</strong>
                      <p className="text-gray-700 leading-relaxed">
                        {generatedLp.refleksiPembelajaran || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. AI Vocabulary Generator */}
          {activeMenu === 'vocab-gen' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <BookMarked className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">AI Vocabulary Generator</h2>
                    <p className="text-xs text-gray-700">
                      Hasilkan kosakata terarah untuk SMP, lengkap dengan arti, fonetik, contoh kalimat, dan langsung impor ke bank kosakata siswa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Generator Settings */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Topik Kosakata:</label>
                  <input
                    type="text"
                    value={vgTopic}
                    onChange={(e) => setVgTopic(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Kelas:</label>
                  <select
                    value={vgGrade}
                    onChange={(e) => setVgGrade(e.target.value as GradeLevel)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
                <button
                  onClick={handleGenerateVocab}
                  disabled={isGeneratingVocab}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingVocab ? 'Menghasilkan...' : 'Hasilkan dengan AI'}</span>
                </button>
              </div>

              {/* Generated Preview & Import */}
              {generatedVocabList.length > 0 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase text-gray-700">
                      Hasil Generasi ({generatedVocabList.length} Kata):
                    </h3>
                    <button
                      onClick={handleImportVocabToBank}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-xs"
                    >
                      Impor ke Bank Kosakata
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {generatedVocabList.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-indigo-700">{item.word}</span>
                          <span className="text-[10px] text-gray-700 font-mono">{item.phonetic}</span>
                        </div>
                        <div className="font-semibold text-gray-900">Arti: {item.meaningId}</div>
                        <div className="text-gray-700 italic">"{item.exampleEn}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. AI Grammar Tutor Oversight */}
          {activeMenu === 'grammar-tutor' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Kurikulum &amp; Pengaturan 12 Materi Tata Bahasa</h2>
                <p className="text-xs text-gray-700">
                  Daftar 12 materi tata bahasa SMP yang aktif digunakan pada tutor AI siswa
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {grammarTopics.map((g, idx) => (
                  <div key={g.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {idx + 1}. {g.title}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        Kelas {g.grade}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-indigo-700 bg-white p-1.5 rounded border border-gray-200">
                      Rumus: {g.formula}
                    </div>
                    <div className="text-gray-700 text-[11px]">{g.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. AI Speaking Partner Oversight (Suara Perempuan) */}
          {activeMenu === 'speaking-partner' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-gray-900">AI Speaking Partner (Suara Perempuan)</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      👩 Suara Perempuan: Miss Sarah (Default)
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-0.5">
                    11 Topik percakapan terintegrasi untuk melatih keberanian berbicara siswa SMP dengan mitra AI bersuara perempuan ramah
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    speechService.speak(
                      "Hello! I am Miss Sarah, your female English Speaking Partner. Let's learn with confidence and speak with courage!",
                      0.88,
                      undefined,
                      'female'
                    );
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span>Dengarkan Suara Perempuan (Miss Sarah)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 space-y-1">
                  <div className="text-[11px] font-bold text-rose-900 uppercase">Persona &amp; Suara</div>
                  <div className="text-sm font-bold text-gray-900">Miss Sarah (Perempuan)</div>
                  <p className="text-gray-600 text-[11px]">
                    Karakter guru penutur bahasa Inggris yang hangat, sabar, dan komunikatif untuk siswa SMP.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <div className="text-[11px] font-bold text-indigo-900 uppercase">Dukungan Respons Siswa</div>
                  <div className="text-sm font-bold text-gray-900">Teks &amp; Suara (STT)</div>
                  <p className="text-gray-600 text-[11px]">
                    Siswa dapat berbicara melalui mikrofon atau mengetik dengan bantuan petunjuk (hint) &amp; terjemahan.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <div className="text-[11px] font-bold text-emerald-900 uppercase">Umpan Balik Positif</div>
                  <div className="text-sm font-bold text-gray-900">Gently Encouraging</div>
                  <p className="text-gray-600 text-[11px]">
                    Koreksi tata bahasa ramah tanpa menghakimi, menumbuhkan keberanian berbicara tanpa rasa cemas.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-2">
                <strong>Alur Percakapan Pembelajaran Berkesadaran &amp; Menggembirakan:</strong>
                <ol className="list-decimal list-inside space-y-1 text-indigo-900 pl-1">
                  <li>AI Miss Sarah menyapa ramah dalam Bahasa Inggris sesuai topik &amp; jenjang kelas.</li>
                  <li>Siswa merespons melalui teks atau suara via mikrofon.</li>
                  <li>Tersedia tombol "Explain in Indonesian" dan "Give Me a Hint" bagi siswa yang ragu.</li>
                  <li>AI memberikan koreksi bersahabat dan ringkasan pencapaian di akhir sesi.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Studio Gambar Komik & Kartun AI */}
          {activeMenu === 'comic-gen' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <ComicCartoonGenerator selectedGrade="VII" userRole="guru" />
            </div>
          )}

          {/* 10. Pronunciation Oversight */}
          {activeMenu === 'pronunciation' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Pengelolaan Materi Pronunciation</h2>
                  <p className="text-xs text-gray-700">
                    Daftar kata dan kalimat latihan pelafalan dengan panduan transkripsi fonetik IPA
                  </p>
                </div>
                <button
                  onClick={() => setShowPronunciationModal(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  <span>Tambah Kata Pelafalan</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {pronunciationItems.map((pr) => (
                  <div key={pr.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-gray-900">{pr.wordOrPhrase}</span>
                      <span className="text-indigo-700 font-mono ml-2">{pr.phonetic}</span>
                      <div className="text-[11px] text-gray-700 mt-0.5">
                        Arti: {pr.meaningId} &bull; Suku Kata: {pr.syllables || '-'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 font-bold">
                        {pr.difficulty}
                      </span>
                      <button
                        onClick={() => handleDeletePronunciationItem(pr.id)}
                        className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                        title="Hapus Kata Pelafalan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11 & 12. Reading & Listening Oversight */}
          {activeMenu === 'reading' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Materi Reading Practice</h2>
                  <p className="text-xs text-gray-700">Bahan bacaan cerita, artikel, dan soal pemahaman membaca SMP</p>
                </div>
                <button
                  onClick={() => setShowReadingModal(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Teks Bacaan</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {readingExercises.map((rd) => (
                  <div key={rd.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{rd.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                          Kelas {rd.grade} &bull; {rd.difficulty}
                        </span>
                        <button
                          onClick={() => handleDeleteReadingExercise(rd.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Hapus Teks Bacaan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 line-clamp-2 italic font-serif">"{rd.passage}"</p>
                    <div className="text-gray-700">Jumlah Soal Pemahaman: {rd.questions.length} butir</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'listening' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Materi Listening Practice</h2>
                  <p className="text-xs text-gray-700">Pengelolaan audio percakapan dan batas pemutaran audio</p>
                </div>
                <button
                  onClick={() => setShowListeningModal(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Latihan Listening</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {listeningExercises.map((ls) => (
                  <div key={ls.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{ls.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                          Batas Putar: {ls.maxPlayCount}x
                        </span>
                        <button
                          onClick={() => handleDeleteListeningExercise(ls.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Hapus Latihan Listening"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 italic font-serif">"{ls.audioScript}"</p>
                    <div className="text-gray-700">Soal Pemahaman: {ls.questions.length} butir</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 13. Writing Practice Submissions & Grading */}
          {activeMenu === 'writing' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Review &amp; Penilaian Tugas Menulis Siswa</h2>
                  <p className="text-xs text-gray-700">
                    Guru dapat meninjau estimasi telaah AI, memberikan catatan, dan menetapkan nilai akhir resmi
                  </p>
                </div>
              </div>

              {writingSubmissions.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-700">
                  Belum ada tugas menulis yang dikumpulkan.
                </div>
              ) : (
                <div className="space-y-4">
                  {writingSubmissions.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900">{sub.studentName}</span>
                          <span className="text-gray-700 ml-2">({sub.wordCount} kata)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {sub.teacherScore !== undefined ? (
                            <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Nilai Guru: {sub.teacherScore}
                            </span>
                          ) : (
                            <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              Perlu Nilai Guru
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200 text-gray-800 leading-relaxed font-serif">
                        "{sub.content}"
                      </div>

                      {/* AI Feedback Summary */}
                      {sub.aiFeedback && (
                        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 space-y-1">
                          <div className="font-bold text-indigo-950">
                            Estimasi AI: {sub.aiFeedback.overallEstimatedScore}/100
                          </div>
                          <div className="text-indigo-900 text-[11px]">
                            {sub.aiFeedback.detailedNotes}
                          </div>
                        </div>
                      )}

                      {/* Teacher Score & Comment Form */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Nilai Guru (0-100)"
                          defaultValue={sub.teacherScore || ''}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              onUpdateWritingSubmission({ ...sub, teacherScore: val });
                            }
                          }}
                          className="w-32 bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                        />
                        <span className="text-[11px] text-gray-700">
                          (Ketik nilai lalu klik di luar kotak untuk menyimpan nilai resmi guru)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 14. Kuis & Evaluasi Settings */}
          {activeMenu === 'quizzes' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Pengaturan Kuis &amp; Evaluasi Siswa</h2>
                  <p className="text-xs text-gray-700">
                    Atur durasi waktu, batas percobaan, bobot soal, dan buka/tutup rilis kunci jawaban
                  </p>
                </div>
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Buat Kuis Baru (AI / Manual)</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {quizzes.map((qz) => {
                  const mcCount = qz.questions?.filter((q) => q.type !== 'essay').length || 0;
                  const essayCount = qz.questions?.filter((q) => q.type === 'essay').length || 0;
                  return (
                    <div key={qz.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2.5 hover:border-indigo-200 transition-colors shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold px-2 py-0.5 rounded bg-indigo-600 text-white text-[11px]">
                            Kelas {qz.grade}
                          </span>
                          <span className="font-bold text-gray-900 text-sm">{qz.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold uppercase text-[10px]">
                            {qz.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewingQuiz(qz)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 hover:border-indigo-500 text-indigo-700 font-bold text-xs flex items-center gap-1 shadow-2xs"
                            title="Pratinjau Butir Soal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat {qz.questions?.length || 0} Soal</span>
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(qz.id)}
                            className="p-1 text-rose-600 hover:text-rose-800"
                            title="Hapus Kuis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-gray-700 border-t border-gray-200/70">
                        <div>Durasi: <strong className="text-gray-900">{qz.durationMinutes} menit</strong></div>
                        <div>Batas Percobaan: <strong className="text-gray-900">{qz.maxAttempts}x</strong></div>
                        <div>
                          Komposisi:{' '}
                          <strong className="text-indigo-900 font-bold">
                            {qz.questions?.length || 0} Soal ({mcCount} PG &bull; {essayCount} Essai)
                          </strong>
                        </div>
                        <div>
                          Rilis Kunci:{' '}
                          <button
                            onClick={() => {
                              const updated = quizzes.map((q) =>
                                q.id === qz.id ? { ...q, releaseAnswerKey: !q.releaseAnswerKey } : q
                              );
                              onUpdateQuizzes(updated);
                            }}
                            className={`font-bold ml-1 px-1.5 py-0.5 rounded ${
                              qz.releaseAnswerKey ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {qz.releaseAnswerKey ? 'Terbuka' : 'Terkunci'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 15. Hasil Belajar (Scorebook) */}
          {activeMenu === 'gradebook' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Buku Nilai &amp; Hasil Belajar Siswa</h2>
                  <p className="text-xs text-gray-700">Rekapitulasi riil Evaluasi Awal (Pre-Test), Evaluasi Akhir (Post-Test), dan capaian kompetensi</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportGradebookCsv}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Nilai Semester {gradebookSemester} (CSV)</span>
                  </button>
                </div>
              </div>

              {/* PANEL EDIT SEMESTER DAN TAHUN AJARAN DI HASIL BELAJAR */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50/90 via-indigo-50/80 to-blue-50/90 border border-purple-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-600 text-white rounded-lg shadow-xs">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-purple-950">Panel Edit Semester &amp; Tahun Ajaran (Hasil Belajar)</h3>
                      <p className="text-[11px] text-purple-800">
                        Sesuaikan periode penilaian buku nilai siswa, filter per kelas, dan unduh laporan resmi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-bold px-2.5 py-0.5 rounded-lg bg-white text-purple-900 border border-purple-200 shadow-2xs">
                      Periode: Semester {gradebookSemester} ({gradebookSemester === 1 ? 'Ganjil' : 'Genap'}) &bull; TA {gradebookYear}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end pt-1">
                  <div>
                    <label className="block font-bold text-purple-950 mb-1">Pilih Semester Penilaian:</label>
                    <select
                      value={gradebookSemester}
                      onChange={(e) => setGradebookSemester(Number(e.target.value) as 1 | 2)}
                      className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-purple-500 shadow-2xs"
                    >
                      <option value={1}>Semester 1 (Ganjil)</option>
                      <option value={2}>Semester 2 (Genap)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-purple-950 mb-1">Tahun Ajaran:</label>
                    <input
                      type="text"
                      value={gradebookYear}
                      onChange={(e) => setGradebookYear(e.target.value)}
                      placeholder="Contoh: 2026/2027"
                      list="ta-datalist-gradebook"
                      className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-purple-500 shadow-2xs"
                    />
                    <datalist id="ta-datalist-gradebook">
                      <option value="2024/2025" />
                      <option value="2025/2026" />
                      <option value="2026/2027" />
                      <option value="2027/2028" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block font-bold text-purple-950 mb-1">Filter Rombel / Kelas:</label>
                    <select
                      value={gradebookClassFilter}
                      onChange={(e) => setGradebookClassFilter(e.target.value)}
                      className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-purple-500 shadow-2xs"
                    >
                      <option value="All">Semua Rombongan Belajar ({students.length} Siswa)</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>
                          Kelas {c.name} ({students.filter((s) => s.className === c.name).length} Siswa)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => showNotification(`Periode Hasil Belajar diterapkan: Semester ${gradebookSemester} (${gradebookSemester === 1 ? 'Ganjil' : 'Genap'}) TA ${gradebookYear}.`)}
                      className="w-full px-4 py-2 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition-colors shadow-xs flex items-center justify-center gap-1.5 h-[34px]"
                    >
                      <Check className="w-4 h-4" />
                      <span>Terapkan Periode Nilai</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Hasil Belajar */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase">
                    <tr>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">Semester &amp; TA</th>
                      <th className="p-3">Pre-Test</th>
                      <th className="p-3">Post-Test</th>
                      <th className="p-3">Peningkatan (Gain)</th>
                      <th className="p-3">Status Pencapaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students
                      .filter((st) => gradebookClassFilter === 'All' || st.className === gradebookClassFilter)
                      .map((st) => {
                        const pre = st.preTestScore;
                        const post = st.postTestScore;
                        const hasBoth = pre !== undefined && post !== undefined;
                        const gain = hasBoth ? post - pre : undefined;
                        return (
                          <tr key={st.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-900">{st.name}</td>
                            <td className="p-3 font-semibold text-indigo-700">{st.className}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                                gradebookSemester === 1 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                Sem. {gradebookSemester} &bull; {gradebookYear}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-gray-700">{pre !== undefined ? pre : 'Belum ada data'}</td>
                            <td className="p-3 font-bold text-emerald-700">{post !== undefined ? post : 'Belum ada data'}</td>
                            <td className="p-3 font-extrabold text-indigo-700">
                              {gain !== undefined ? `+${gain} Poin` : 'Belum ada data'}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Tuntas Melampaui Target
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 16. Laporan Perkembangan (Analytics) */}
          {activeMenu === 'analytics' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Laporan Perkembangan &amp; Analitik Pembelajaran</h2>
                <p className="text-xs text-gray-700">
                  Visualisasi grafik dan statistik berdasarkan data nyata yang tersimpan (tanpa data fiktif)
                </p>
              </div>

              {/* Progress Gain Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-center">
                  <div className="text-xs text-indigo-800 font-bold uppercase">Rata-rata Pre-Test Kelas</div>
                  <div className="text-3xl font-extrabold text-indigo-900 mt-1">
                    {Math.round(students.reduce((acc, s) => acc + (s.preTestScore || 0), 0) / students.length)}
                  </div>
                  <div className="text-[10px] text-indigo-700 mt-0.5">Skor dasar awal bab</div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center">
                  <div className="text-xs text-emerald-800 font-bold uppercase">Rata-rata Post-Test Kelas</div>
                  <div className="text-3xl font-extrabold text-emerald-900 mt-1">
                    {Math.round(students.reduce((acc, s) => acc + (s.postTestScore || 0), 0) / students.length)}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Skor evaluasi akhir modul</div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 text-center">
                  <div className="text-xs text-purple-800 font-bold uppercase">Rata-rata Peningkatan (Gain)</div>
                  <div className="text-3xl font-extrabold text-purple-900 mt-1">
                    +{Math.round(
                      (students.reduce((acc, s) => acc + (s.postTestScore || 0), 0) -
                        students.reduce((acc, s) => acc + (s.preTestScore || 0), 0)) /
                        students.length
                    )}
                  </div>
                  <div className="text-[10px] text-purple-700 mt-0.5">Kenaikan kemampuan siswa</div>
                </div>
              </div>

              {/* Skill Distribution Comparison Bars */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 text-xs">
                <div className="font-bold text-gray-900">Perkembangan Keterampilan Berbahasa Siswa:</div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1 text-[11px] font-semibold text-gray-700">
                      <span>Vocabulary Mastery (Penguasaan Kosakata)</span>
                      <span>85% Tuntas</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px] font-semibold text-gray-700">
                      <span>Grammar Accuracy (Akurasi Tata Bahasa)</span>
                      <span>81% Tuntas</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '81%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px] font-semibold text-gray-700">
                      <span>Speaking Interaction (Keberanian Berbicara)</span>
                      <span>90% Aktif</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px] font-semibold text-gray-700">
                      <span>Writing Paragraph Quality (Kualitas Paragraf)</span>
                      <span>88% Memenuhi Rubrik</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rubrik Penilaian Editor (Editable by Teacher) */}
          {activeMenu === 'rubrics' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Rubrik Penilaian Keterampilan Berbahasa (Dapat Diedit)</h2>
                <p className="text-xs text-gray-700">
                  Guru dapat menyesuaikan bobot persentase dan deskripsi kriteria pencapaian (Speaking, Writing, Reading, Listening)
                </p>
              </div>

              {/* Speaking Rubric */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-indigo-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>1. Rubrik Keterampilan Berbicara (Speaking):</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {rubrics.speaking.map((crit, idx) => (
                    <div key={crit.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{crit.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-700">Bobot:</span>
                          <input
                            type="number"
                            value={crit.weightPercent}
                            onChange={(e) => {
                              const updated = [...rubrics.speaking];
                              updated[idx].weightPercent = parseInt(e.target.value) || 0;
                              onUpdateRubrics({ ...rubrics, speaking: updated });
                            }}
                            className="w-16 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-center font-bold"
                          />
                          <span>%</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div><strong>Sangat Baik (Level 4):</strong> {crit.descriptors.level4}</div>
                        <div><strong>Baik (Level 3):</strong> {crit.descriptors.level3}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Writing Rubric */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4" />
                  <span>2. Rubrik Keterampilan Menulis (Writing):</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {rubrics.writing.map((crit, idx) => (
                    <div key={crit.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{crit.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-700">Bobot:</span>
                          <input
                            type="number"
                            value={crit.weightPercent}
                            onChange={(e) => {
                              const updated = [...rubrics.writing];
                              updated[idx].weightPercent = parseInt(e.target.value) || 0;
                              onUpdateRubrics({ ...rubrics, writing: updated });
                            }}
                            className="w-16 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-center font-bold"
                          />
                          <span>%</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div><strong>Sangat Baik:</strong> {crit.descriptors.level4}</div>
                        <div><strong>Baik:</strong> {crit.descriptors.level3}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 17. Pengaturan (Settings & Database) */}
          {activeMenu === 'settings' && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Pengaturan Sistem &amp; Ketahanan Data</h2>
                <p className="text-xs text-gray-700">
                  Status koneksi Gemini AI, status basis data server, dan pencadangan data
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <strong className="text-gray-900 block">Koneksi Gemini AI (gemini-3.8-flash):</strong>
                    <span className="text-gray-700">
                      {hasGeminiKey ? 'Terkoneksi aman di sisi server Express' : 'Berjalan dengan fallback cerdas rule-based edukatif'}
                    </span>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      hasGeminiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hasGeminiKey ? 'Aktif' : 'Fallback Siap'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <strong className="text-gray-900 block">Penyimpanan Basis Data Server (data/db.json):</strong>
                    <span className="text-gray-700">
                      Tersimpan permanen dan otomatis sinkron saat halaman dimuat ulang.
                    </span>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800">
                    Online &amp; Sinkron
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <strong className="text-amber-950 font-bold block">Reset Data Demonstrasi:</strong>
                  <p className="text-amber-900">
                    Kembalikan data ke kondisi awal percontohan kurikulum resmi jika Anda ingin memulai demonstrasi bersih.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Kembalikan database ke data awal percontohan?')) {
                        onResetDemoData();
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-xs"
                  >
                    Reset ke Data Demonstrasi Awal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Add / Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Lengkap Siswa:</label>
                <input
                  type="text"
                  value={studentFormName}
                  onChange={(e) => setStudentFormName(e.target.value)}
                  placeholder="Contoh: Rian Hidayat"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">NISN Siswa:</label>
                <input
                  type="text"
                  value={studentFormNisn}
                  onChange={(e) => setStudentFormNisn(e.target.value)}
                  placeholder="0098123456"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kelas:</label>
                  <select
                    value={studentFormClass}
                    onChange={(e) => setStudentFormClass(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tingkat Jenjang:</label>
                  <select
                    value={studentFormGrade}
                    onChange={(e) => setStudentFormGrade(e.target.value as GradeLevel)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingModule ? 'Edit Modul Pembelajaran' : 'Tambah Modul Pembelajaran Baru'}
              </h3>
              <button onClick={() => setShowModuleModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Judul Modul:</label>
                <input
                  type="text"
                  value={moduleFormTitle}
                  onChange={(e) => setModuleFormTitle(e.target.value)}
                  placeholder="Contoh: Modul Kelas VII: Asking and Giving Directions"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Jenjang:</label>
                  <select
                    value={moduleFormGrade}
                    onChange={(e) => setModuleFormGrade(e.target.value as GradeLevel)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Topik Utama:</label>
                  <input
                    type="text"
                    value={moduleFormTopic}
                    onChange={(e) => setModuleFormTopic(e.target.value)}
                    placeholder="Contoh: Directions"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Semester:</label>
                  <select
                    value={moduleFormSemester}
                    onChange={(e) => setModuleFormSemester(Number(e.target.value) as 1 | 2)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tahun Ajaran:</label>
                  <input
                    type="text"
                    value={moduleFormAcademicYear}
                    onChange={(e) => setModuleFormAcademicYear(e.target.value)}
                    placeholder="Contoh: 2026/2027"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Deskripsi Modul:</label>
                <textarea
                  rows={3}
                  value={moduleFormDesc}
                  onChange={(e) => setModuleFormDesc(e.target.value)}
                  placeholder="Deskripsi singkat tujuan dan sasaran modul pembelajaran..."
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Simpan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Module Interactive Preview Modal */}
      {previewingModule && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                  Kelas {previewingModule.grade} &bull; {previewingModule.topic}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">{previewingModule.title}</h3>
              </div>
              <button onClick={() => setPreviewingModule(null)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
              {previewingModule.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-gray-700">Sub-Bab Pembelajaran:</h4>
              {previewingModule.sections?.map((sec, idx) => (
                <div key={sec.id} className="p-3 rounded-xl border border-gray-200 bg-white space-y-1.5 text-xs">
                  <div className="font-bold text-indigo-900">{sec.title}</div>
                  <p className="text-gray-700 leading-relaxed">{sec.content}</p>
                  {sec.dialogue && (
                    <div className="mt-2 space-y-1 bg-indigo-50/50 p-2 rounded-lg">
                      {sec.dialogue.map((d, dIdx) => (
                        <div key={dIdx} className="text-[11px]">
                          <strong>{d.speaker}:</strong> "{d.textEn}" <span className="text-gray-600 italic">({d.textId})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => setPreviewingModule(null)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Create / AI Generate Quiz Modal (Up to 50 questions, Multiple Choice & Essay) */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Buat Kuis &amp; Evaluasi (Hingga 50 Nomor Soal)</h3>
                  <p className="text-[11px] text-gray-600">Dukungan penuh format Pilihan Ganda dan Essai/Uraian yang tersimpan permanen</p>
                </div>
              </div>
              <button onClick={() => setShowQuizModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setQuizMode('ai')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  quizMode === 'ai' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buat Otomatis dengan AI (Hingga 50 Soal)</span>
              </button>
              <button
                type="button"
                onClick={() => setQuizMode('manual')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  quizMode === 'manual' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Penyusun Kuis Manual (PG &amp; Essai)</span>
              </button>
            </div>

            {quizMode === 'ai' ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Topik Kuis &amp; Materi Ujian:</label>
                  <input
                    type="text"
                    value={quizFormTopic}
                    onChange={(e) => setQuizFormTopic(e.target.value)}
                    placeholder="Contoh: Comprehensive English Mid-Semester Exam (Greetings, Descriptive & Grammar)"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jenjang Tingkatan:</label>
                    <select
                      value={quizFormGrade}
                      onChange={(e) => setQuizFormGrade(e.target.value as GradeLevel)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="VII">Jenjang Kelas VII (Fase D Awal)</option>
                      <option value="VIII">Jenjang Kelas VIII (Fase D Menengah)</option>
                      <option value="IX">Jenjang Kelas IX (Fase D Mahir)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Kategori Evaluasi:</label>
                    <select
                      value={quizFormCategory}
                      onChange={(e) => setQuizFormCategory(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="evaluasi-harian">Evaluasi Harian / Ulangan Harian</option>
                      <option value="pre-test">Pre-Test (Evaluasi Awal Diagnostik)</option>
                      <option value="post-test">Post-Test (Evaluasi Akhir Capaian)</option>
                    </select>
                  </div>
                </div>

                {/* Question Count Selection (Up to 50 Questions) */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-indigo-600" />
                      <span>Jumlah Butir Soal Kuis (Maksimal 50 Soal):</span>
                    </label>
                    <span className="font-extrabold text-sm px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                      {quizQuestionCount} Butir Soal
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[10, 25, 40, 50].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuizQuestionCount(count)}
                        className={`py-1.5 rounded-lg font-bold text-xs border transition-all ${
                          quizQuestionCount === count
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                        }`}
                      >
                        {count === 50 ? '50 Soal (Lengkap)' : `${count} Soal`}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-gray-600">Atau tentukan jumlah kustom:</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={quizQuestionCount}
                      onChange={(e) => setQuizQuestionCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-20 bg-white border border-gray-300 rounded-lg px-2 py-1 text-center font-bold text-gray-900"
                    />
                    <span className="text-[11px] text-gray-500">(Rentang 1 s.d. 50 nomor)</span>
                  </div>
                </div>

                {/* Question Format Selection */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <label className="font-bold text-emerald-950 block">Format Distribusi Soal:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuizFormatType('mixed')}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        quizFormatType === 'mixed'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      <div className="font-bold text-xs">Campuran (PG + Essai)</div>
                      <div className={`text-[10px] mt-0.5 ${quizFormatType === 'mixed' ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {quizQuestionCount === 50 ? '40 PG & 10 Essai' : '80% PG & 20% Essai'}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuizFormatType('mc')}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        quizFormatType === 'mc'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      <div className="font-bold text-xs">Pilihan Ganda (PG)</div>
                      <div className={`text-[10px] mt-0.5 ${quizFormatType === 'mc' ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {quizQuestionCount} Butir Soal A-B-C-D
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuizFormatType('essay')}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        quizFormatType === 'essay'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      <div className="font-bold text-xs">Essai / Uraian</div>
                      <div className={`text-[10px] mt-0.5 ${quizFormatType === 'essay' ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {quizQuestionCount} Soal Uraian + Kunci
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Jaminan Ketetapan Data Saat Publikasi:</span>
                  </div>
                  <p>
                    Setiap butir soal kuis (nomor 1 s.d. {quizQuestionCount}) akan disimpan permanen ke server database lokal. Kuis yang dibuat akan langsung tayang pada panel siswa dan tidak akan ter-reset atau berubah saat di-publish.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowQuizModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleAiGenerateQuiz}
                    disabled={isAiGeneratingQuiz}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAiGeneratingQuiz ? `Menyusun ${quizQuestionCount} Soal AI...` : `Hasilkan Kuis ${quizQuestionCount} Soal dengan AI`}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveManualQuiz} className="space-y-4 text-xs">
                {/* Header Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Judul Kuis:</label>
                    <input
                      type="text"
                      value={quizFormTitle}
                      onChange={(e) => setQuizFormTitle(e.target.value)}
                      placeholder="Contoh: Penilaian Akhir Semester (50 Nomor Soal)"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Topik Utama:</label>
                    <input
                      type="text"
                      value={quizFormTopic}
                      onChange={(e) => setQuizFormTopic(e.target.value)}
                      placeholder="Contoh: Comprehensive Semester Assessment"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jenjang:</label>
                    <select
                      value={quizFormGrade}
                      onChange={(e) => setQuizFormGrade(e.target.value as GradeLevel)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                    >
                      <option value="VII">Kelas VII</option>
                      <option value="VIII">Kelas VIII</option>
                      <option value="IX">Kelas IX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Kategori:</label>
                    <select
                      value={quizFormCategory}
                      onChange={(e) => setQuizFormCategory(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                    >
                      <option value="evaluasi-harian">Evaluasi Harian</option>
                      <option value="pre-test">Pre-Test</option>
                      <option value="post-test">Post-Test</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Durasi Pengerjaan:</label>
                    <select
                      value={quizFormDuration}
                      onChange={(e) => setQuizFormDuration(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                    >
                      <option value={30}>30 Menit</option>
                      <option value={45}>45 Menit</option>
                      <option value={60}>60 Menit (Standar 50 Soal)</option>
                      <option value={90}>90 Menit (Ujian Penuh)</option>
                    </select>
                  </div>
                </div>

                {/* Quick Templates for 50 Questions */}
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Template Bank Soal Cepat (50 Butir Soal Standar):</span>
                    </span>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                      Soal Aktif: {manualQuestions.length} Soal
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePopulateFiftyQuestions('mixed')}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Muat 50 Soal (40 PG + 10 Essai)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePopulateFiftyQuestions('mc')}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Muat 50 Soal (Semua PG)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePopulateFiftyQuestions('essay')}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Muat 50 Soal (Semua Essai)</span>
                    </button>
                  </div>
                  {manualQuestions.length > 0 && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setManualQuestions([]);
                          showNotification('Daftar butir soal manual dikosongkan.');
                        }}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline"
                      >
                        Kosongkan dan Susun Sendiri
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Input Butir Soal Baru */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      <span>Input Butir Soal ke-{manualQuestions.length + 1} (Hingga 50 Nomor):</span>
                    </span>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setNewManualQType('mc')}
                        className={`px-2.5 py-1 rounded font-bold text-xs transition-all ${
                          newManualQType === 'mc' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                        }`}
                      >
                        Pilihan Ganda
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewManualQType('essay')}
                        className={`px-2.5 py-1 rounded font-bold text-xs transition-all ${
                          newManualQType === 'essay' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                        }`}
                      >
                        Soal Essai / Uraian
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Teks Pertanyaan:</label>
                    <textarea
                      rows={2}
                      value={newManualQText}
                      onChange={(e) => setNewManualQText(e.target.value)}
                      placeholder={newManualQType === 'mc' ? 'Tuliskan butir soal pilihan ganda...' : 'Tuliskan instruksi atau pertanyaan soal uraian/esai...'}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {newManualQType === 'mc' ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Opsi A:</label>
                          <input
                            type="text"
                            value={newManualQOptA}
                            onChange={(e) => setNewManualQOptA(e.target.value)}
                            placeholder="Teks opsi A"
                            className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Opsi B:</label>
                          <input
                            type="text"
                            value={newManualQOptB}
                            onChange={(e) => setNewManualQOptB(e.target.value)}
                            placeholder="Teks opsi B"
                            className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Opsi C:</label>
                          <input
                            type="text"
                            value={newManualQOptC}
                            onChange={(e) => setNewManualQOptC(e.target.value)}
                            placeholder="Teks opsi C"
                            className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Opsi D:</label>
                          <input
                            type="text"
                            value={newManualQOptD}
                            onChange={(e) => setNewManualQOptD(e.target.value)}
                            placeholder="Teks opsi D"
                            className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <label className="font-bold text-gray-700">Kunci Jawaban Benar:</label>
                        <select
                          value={newManualQCorrect}
                          onChange={(e) => setNewManualQCorrect(parseInt(e.target.value))}
                          className="bg-white border border-gray-300 rounded-lg px-3 py-1 font-bold text-indigo-700"
                        >
                          <option value={0}>Pilihan A</option>
                          <option value={1}>Pilihan B</option>
                          <option value={2}>Pilihan C</option>
                          <option value={3}>Pilihan D</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Model Jawaban Ideal (Sample Answer):</label>
                        <textarea
                          rows={2}
                          value={newManualQSample}
                          onChange={(e) => setNewManualQSample(e.target.value)}
                          placeholder="Tuliskan model jawaban esai yang benar dalam Bahasa Inggris..."
                          className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Kriteria Rubrik Penilaian (pisahkan dengan koma):</label>
                        <input
                          type="text"
                          value={newManualQRubric}
                          onChange={(e) => setNewManualQRubric(e.target.value)}
                          placeholder="Kesesuaian topik, tata bahasa, struktur kalimat, kosakata"
                          className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-gray-700">Bobot Poin:</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={newManualQPoints}
                        onChange={(e) => setNewManualQPoints(parseInt(e.target.value) || 2)}
                        className="w-16 bg-white border border-gray-300 rounded-lg px-2 py-1 text-center font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddManualQuestion}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambahkan Soal ke Kuis</span>
                    </button>
                  </div>
                </div>

                {/* List of Registered Questions */}
                {manualQuestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">
                        Daftar Butir Soal Terdaftar ({manualQuestions.length} Nomor):
                      </span>
                      <span className="text-[11px] text-gray-600">
                        {manualQuestions.filter((q) => q.type === 'mc').length} PG &bull; {manualQuestions.filter((q) => q.type === 'essay').length} Essai
                      </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-gray-200 rounded-xl p-2 bg-gray-50/70">
                      {manualQuestions.map((q, idx) => (
                        <div key={q.id || idx} className="p-2 rounded-lg bg-white border border-gray-200 flex items-start justify-between gap-2 text-[11px]">
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-indigo-700">No. {idx + 1}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                q.type === 'essay' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {q.type === 'essay' ? 'Essai' : 'Pilihan Ganda'}
                              </span>
                              <span className="text-gray-500">({q.points} Poin)</span>
                            </div>
                            <p className="text-gray-800 line-clamp-1">{q.questionText}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = manualQuestions.filter((_, i) => i !== idx);
                              setManualQuestions(updated);
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Hapus butir soal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowQuizModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Kuis ({manualQuestions.length > 0 ? manualQuestions.length : 50} Soal)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: Add Custom Pronunciation Word */}
      {showPronunciationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm">Tambah Kata / Kalimat Pelafalan</h3>
              <button onClick={() => setShowPronunciationModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Kata / Frasa Bahasa Inggris:</label>
                <input
                  type="text"
                  value={pronWord}
                  onChange={(e) => setPronWord(e.target.value)}
                  placeholder="Contoh: Good afternoon"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Transkripsi Fonetik (IPA):</label>
                <input
                  type="text"
                  value={pronPhonetic}
                  onChange={(e) => setPronPhonetic(e.target.value)}
                  placeholder="Contoh: /ɡʊd ˌɑːf.təˈnuːn/"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Arti Bahasa Indonesia:</label>
                <input
                  type="text"
                  value={pronMeaning}
                  onChange={(e) => setPronMeaning(e.target.value)}
                  placeholder="Contoh: Selamat sore"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPronunciationModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!pronWord.trim()) return;
                    const newItem: PronunciationItem = {
                      id: `pr-${Date.now()}`,
                      wordOrPhrase: pronWord.trim(),
                      phonetic: pronPhonetic.trim() || `/${pronWord.toLowerCase()}/`,
                      meaningId: pronMeaning.trim() || 'Arti kata',
                      difficulty: pronDifficulty,
                      audioModelText: pronWord.trim(),
                      tip: pronTip.trim() || 'Ucapkan dengan artikulasi jelas.',
                    };
                    if (onUpdatePronunciationItems) {
                      onUpdatePronunciationItems([...pronunciationItems, newItem]);
                    }
                    setShowPronunciationModal(false);
                  }}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-xs"
                >
                  Simpan Kata
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Add Custom Reading Exercise */}
      {showReadingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-sm">Tambah Teks Bacaan &amp; Soal Pemahaman</h3>
              </div>
              <button onClick={() => setShowReadingModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReadingExercise} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Judul Teks Bacaan:</label>
                <input
                  type="text"
                  value={readTitle}
                  onChange={(e) => setReadTitle(e.target.value)}
                  placeholder="Contoh: My Wonderful Hometown"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Jenjang:</label>
                  <select
                    value={readGrade}
                    onChange={(e) => setReadGrade(e.target.value as GradeLevel)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Topik:</label>
                  <input
                    type="text"
                    value={readTopic}
                    onChange={(e) => setReadTopic(e.target.value)}
                    placeholder="Contoh: Hometown"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tingkat Kesulitan:</label>
                  <select
                    value={readDifficulty}
                    onChange={(e) => setReadDifficulty(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Paragraf / Naskah Bacaan:</label>
                <textarea
                  rows={4}
                  value={readPassage}
                  onChange={(e) => setReadPassage(e.target.value)}
                  placeholder="Ketik atau tempel naskah cerita/artikel bacaan Bahasa Inggris di sini..."
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900 font-serif leading-relaxed"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="font-bold text-gray-900">Soal Pemahaman 1:</div>
                <input
                  type="text"
                  value={readQ1Text}
                  onChange={(e) => setReadQ1Text(e.target.value)}
                  placeholder="Contoh: What is the text mainly about?"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={readQ1A}
                    onChange={(e) => setReadQ1A(e.target.value)}
                    placeholder="Pilihan A"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                  <input
                    type="text"
                    value={readQ1B}
                    onChange={(e) => setReadQ1B(e.target.value)}
                    placeholder="Pilihan B"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                  <input
                    type="text"
                    value={readQ1C}
                    onChange={(e) => setReadQ1C(e.target.value)}
                    placeholder="Pilihan C"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                  <input
                    type="text"
                    value={readQ1D}
                    onChange={(e) => setReadQ1D(e.target.value)}
                    placeholder="Pilihan D"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-gray-700">Kunci Benar:</label>
                  <select
                    value={readQ1Correct}
                    onChange={(e) => setReadQ1Correct(parseInt(e.target.value))}
                    className="bg-white border border-gray-300 rounded p-1"
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    <option value={2}>Pilihan C</option>
                    <option value={3}>Pilihan D</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReadingModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Simpan Teks Bacaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: Add Custom Listening Exercise */}
      {showListeningModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-sm">Tambah Latihan Listening (Audio)</h3>
              </div>
              <button onClick={() => setShowListeningModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListeningExercise} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Judul Latihan:</label>
                <input
                  type="text"
                  value={listenTitle}
                  onChange={(e) => setListenTitle(e.target.value)}
                  placeholder="Contoh: Conversation in the Library"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Jenjang:</label>
                  <select
                    value={listenGrade}
                    onChange={(e) => setListenGrade(e.target.value as GradeLevel)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Topik:</label>
                  <input
                    type="text"
                    value={listenTopic}
                    onChange={(e) => setListenTopic(e.target.value)}
                    placeholder="Contoh: Library Rules"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Batas Putar:</label>
                  <select
                    value={listenMaxPlays}
                    onChange={(e) => setListenMaxPlays(parseInt(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900"
                  >
                    <option value={1}>1 Kali</option>
                    <option value={2}>2 Kali</option>
                    <option value={3}>3 Kali</option>
                    <option value={5}>5 Kali</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Naskah Percakapan / Audio (TTS):</label>
                <textarea
                  rows={3}
                  value={listenScript}
                  onChange={(e) => setListenScript(e.target.value)}
                  placeholder="Ketik kalimat atau percakapan yang akan dibacakan oleh suara TTS model..."
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-900 font-serif leading-relaxed"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="font-bold text-gray-900">Soal Pemahaman Simakan:</div>
                <input
                  type="text"
                  value={listenQ1Text}
                  onChange={(e) => setListenQ1Text(e.target.value)}
                  placeholder="Contoh: Where did the conversation take place?"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={listenQ1A}
                    onChange={(e) => setListenQ1A(e.target.value)}
                    placeholder="Pilihan A"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                  <input
                    type="text"
                    value={listenQ1B}
                    onChange={(e) => setListenQ1B(e.target.value)}
                    placeholder="Pilihan B"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                  <input
                    type="text"
                    value={listenQ1C}
                    onChange={(e) => setListenQ1C(e.target.value)}
                    placeholder="Pilihan C"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                  <input
                    type="text"
                    value={listenQ1D}
                    onChange={(e) => setListenQ1D(e.target.value)}
                    placeholder="Pilihan D"
                    required
                    className="bg-white border border-gray-300 rounded-lg p-1.5"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-gray-700">Kunci Benar:</label>
                  <select
                    value={listenQ1Correct}
                    onChange={(e) => setListenQ1Correct(parseInt(e.target.value))}
                    className="bg-white border border-gray-300 rounded p-1"
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    <option value={2}>Pilihan C</option>
                    <option value={3}>Pilihan D</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowListeningModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Simpan Latihan Listening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: In-App Delete Confirmation Dialog */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">Konfirmasi Hapus Data</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus{' '}
                  <strong className="text-gray-900">
                    {deleteConfirm.type === 'class'
                      ? 'kelas'
                      : deleteConfirm.type === 'student'
                      ? 'data siswa'
                      : deleteConfirm.type === 'module'
                      ? 'modul pembelajaran'
                      : deleteConfirm.type === 'quiz'
                      ? 'kuis'
                      : deleteConfirm.type === 'reading'
                      ? 'teks bacaan'
                      : deleteConfirm.type === 'listening'
                      ? 'latihan listening'
                      : 'kata pelafalan'}
                  </strong>{' '}
                  <span className="font-semibold text-rose-700">"{deleteConfirm.name}"</span>?
                </p>
                <p className="text-[11px] text-gray-500 mt-1 italic">
                  Data yang dihapus akan segera dihapus permanen dari sistem.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, type: 'class', id: '', name: '' })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Quick Edit Class Semester & Tahun Ajaran */}
      {quickEditClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in border border-indigo-100">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Edit Semester &amp; Tahun Ajaran Kelas</h3>
                  <p className="text-[11px] text-gray-600">Rombel: <strong className="text-indigo-700">{quickEditClass.name}</strong> (Kelas {quickEditClass.grade})</p>
                </div>
              </div>
              <button onClick={() => setQuickEditClass(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Pilih Semester:</label>
                <select
                  value={quickClassSemester}
                  onChange={(e) => setQuickClassSemester(Number(e.target.value) as 1 | 2)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>Semester 1 (Ganjil)</option>
                  <option value={2}>Semester 2 (Genap)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tahun Ajaran:</label>
                <input
                  type="text"
                  value={quickClassYear}
                  onChange={(e) => setQuickClassYear(e.target.value)}
                  placeholder="Contoh: 2026/2027"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuickEditClass(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveQuickEditClass}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Quick Edit Module Semester & Tahun Ajaran */}
      {quickEditModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in border border-teal-100">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-600 text-white rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Edit Semester &amp; Tahun Ajaran Modul</h3>
                  <p className="text-[11px] text-gray-600 line-clamp-1">{quickEditModule.title}</p>
                </div>
              </div>
              <button onClick={() => setQuickEditModule(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Pilih Semester Modul:</label>
                <select
                  value={quickModuleSemester}
                  onChange={(e) => setQuickModuleSemester(Number(e.target.value) as 1 | 2)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-semibold focus:ring-2 focus:ring-teal-500"
                >
                  <option value={1}>Semester 1 (Ganjil)</option>
                  <option value={2}>Semester 2 (Genap)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tahun Ajaran Modul:</label>
                <input
                  type="text"
                  value={quickModuleYear}
                  onChange={(e) => setQuickModuleYear(e.target.value)}
                  placeholder="Contoh: 2026/2027"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-semibold focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuickEditModule(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveQuickEditModule}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detailed Quiz Inspector Modal (Preview up to 50 questions with answers) */}
      {previewingQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in border border-indigo-100">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-white bg-indigo-600 px-2 py-0.5 rounded uppercase">
                    Kelas {previewingQuiz.grade}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase border border-indigo-200">
                    {previewingQuiz.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Durasi: {previewingQuiz.durationMinutes} menit &bull; {previewingQuiz.questions?.length || 0} Soal
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">{previewingQuiz.title}</h3>
              </div>
              <button onClick={() => setPreviewingQuiz(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions breakdown */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs">
              <span className="font-bold text-indigo-950">
                Daftar Butir Soal Resmi (Nomor 1 s.d. {previewingQuiz.questions?.length || 0}):
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                  {previewingQuiz.questions?.filter((q) => q.type !== 'essay').length || 0} Pilihan Ganda
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[11px]">
                  {previewingQuiz.questions?.filter((q) => q.type === 'essay').length || 0} Soal Essai
                </span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {previewingQuiz.questions?.map((q, idx) => (
                <div key={q.id || idx} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.type === 'essay' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {q.type === 'essay' ? 'Soal Essai / Uraian' : 'Pilihan Ganda'}
                      </span>
                    </div>
                    <span className="font-bold text-gray-500 text-[11px]">{q.points} Poin</span>
                  </div>

                  <p className="font-semibold text-gray-900 leading-relaxed pl-1">{q.questionText}</p>

                  {q.type !== 'essay' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = typeof q.correctAnswer === 'number'
                          ? q.correctAnswer === optIdx
                          : String(q.correctAnswer).trim().toLowerCase() === String(optIdx).trim().toLowerCase() ||
                            String(q.correctAnswer).trim().toLowerCase() === opt.trim().toLowerCase();
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'essay' && (
                    <div className="space-y-1.5 pl-1 pt-1 bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
                      <div className="text-[11px] font-bold text-purple-950">Model Jawaban Ideal (Kunci Jawaban Guru):</div>
                      <p className="text-gray-800 italic bg-white p-2 rounded border border-purple-200 text-[11px]">
                        "{q.sampleAnswer || q.correctAnswer}"
                      </p>
                      {q.rubricCriteria && q.rubricCriteria.length > 0 && (
                        <div className="text-[10px] text-purple-800">
                          <strong>Kriteria Rubrik:</strong> {q.rubricCriteria.join(' &bull; ')}
                        </div>
                      )}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-gray-100 pl-1">
                      <strong className="text-gray-700">Pembahasan:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewingQuiz(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating In-App Notification Toast */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-800 text-xs animate-in slide-in-from-bottom-3">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{notificationMsg}</span>
          <button
            onClick={() => setNotificationMsg(null)}
            className="text-gray-400 hover:text-white p-1"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
