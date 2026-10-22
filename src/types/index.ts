export type UserRole = 'guru' | 'siswa' | 'admin';

export type GradeLevel = 'VII' | 'VIII' | 'IX';

export interface TeacherProfile {
  id: string;
  name: string;
  nip: string;
  school: string;
  subject: string;
  classesTaught: string[];
  email: string;
  avatarUrl: string;
  bio: string;
  phone?: string;
}

export interface Student {
  id: string;
  name: string;
  nisn: string;
  grade: GradeLevel;
  className: string;
  avatarUrl: string;
  points: number;
  streakDays: number;
  completedLessonsCount: number;
  preTestScore?: number;
  postTestScore?: number;
  vocabMasteredCount: number;
  grammarAccuracy: number;
  speakingSessionsCount: number;
  writingSubmissionsCount: number;
  lastActive: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g., 'VII-A'
  grade: GradeLevel;
  academicYear: string;
  semester?: 1 | 2;
  studentCount: number;
  description: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaningId: string; // Indonesian meaning
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'pronoun' | 'preposition';
  phonetic: string;
  exampleEn: string;
  exampleId: string;
  topic: string;
  grade: GradeLevel;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate';
}

export interface GrammarTopic {
  id: string;
  title: string;
  titleId: string;
  grade: GradeLevel;
  category: string;
  summary: string;
  formula: string;
  explanation: string;
  examples: Array<{
    en: string;
    id: string;
    note?: string;
  }>;
  commonMistakes: Array<{
    wrong: string;
    right: string;
    explanation: string;
  }>;
  exercises: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface SpeakingMessage {
  id: string;
  sender: 'ai' | 'student';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
  correction?: string;
  translationId?: string;
  hint?: string;
}

export interface SpeakingSessionSummary {
  questionsAnswered: number;
  newVocabulary: string[];
  mistakesToImprove: string[];
  betterSentences: Array<{ original: string; improved: string; reason: string }>;
  nextPracticeSuggestions: string[];
  overallEncouragement: string;
}

export interface PronunciationItem {
  id: string;
  wordOrPhrase: string;
  phonetic: string;
  meaningId: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
  audioModelText: string;
  syllables?: string;
  tip?: string;
}

export interface PronunciationAttempt {
  id: string;
  studentId: string;
  itemId: string;
  targetText: string;
  recognizedText: string;
  score: number; // 0 - 100 estimated
  feedback: string;
  timestamp: string;
}

export interface ReadingExercise {
  id: string;
  title: string;
  grade: GradeLevel;
  topic: string;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate';
  passage: string;
  glossary: Array<{ word: string; meaning: string }>;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface ListeningExercise {
  id: string;
  title: string;
  grade: GradeLevel;
  topic: string;
  audioScript: string;
  maxPlayCount: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface WritingTask {
  id: string;
  title: string;
  grade: GradeLevel;
  type: string;
  prompt: string;
  guideQuestions: string[];
  minWords: number;
  rubricFocus: string[];
}

export interface WritingSubmission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  content: string;
  wordCount: number;
  submittedAt: string;
  status: 'pending' | 'graded';
  aiFeedback?: {
    grammarScore: number;
    vocabularyScore: number;
    spellingScore: number;
    structureScore: number;
    organizationScore: number;
    overallEstimatedScore: number;
    strengths: string[];
    improvements: string[];
    sampleCorrection: string;
    detailedNotes: string;
  };
  teacherScore?: number;
  teacherComment?: string;
}

export type QuestionType = 'mc' | 'tf' | 'fill' | 'match' | 'dialog' | 'unscramble' | 'essay';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[]; // for mc, dialog
  correctAnswer: string | number | boolean; // string for fill/unscramble/match/essay, number for mc index, boolean for tf
  sampleAnswer?: string; // for essay
  rubricCriteria?: string[]; // for essay assessment
  minWords?: number; // minimum recommended words for essay
  matchingPairs?: Array<{ left: string; right: string }>;
  scrambledWords?: string[];
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  grade: GradeLevel;
  topic: string;
  category: 'pre-test' | 'post-test' | 'evaluasi-harian';
  durationMinutes: number;
  maxAttempts: number;
  releaseAnswerKey: boolean;
  questions: QuizQuestion[];
  isPublished: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  score: number;
  maxScore: number;
  percentage: number;
  answers: Record<string, any>;
  completedAt: string;
  feedback?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  weightPercent: number;
  descriptors: {
    level4: string; // Sangat Baik (86-100)
    level3: string; // Baik (71-85)
    level2: string; // Cukup (56-70)
    level1: string; // Perlu Bimbingan (<56)
  };
}

export interface SkillRubrics {
  speaking: RubricCriterion[];
  writing: RubricCriterion[];
  reading: RubricCriterion[];
  listening: RubricCriterion[];
}

export interface LessonPlan {
  id: string;
  title: string;
  grade: GradeLevel;
  semester: 1 | 2;
  academicYear?: string;
  subject: string;
  topic: string;
  timeAllocation: string;
  studentLevel: string;
  learningModel: string;
  media: string[];
  specialNeedsNotes: string;
  identitas: {
    sekolah: string;
    guru: string;
    mataPelajaran: string;
    kelasSemester: string;
    alokasiWaktu: string;
  };
  tujuanPembelajaran: string[];
  kegiatanPendahuluan: string[];
  kegiatanInti: string[];
  kegiatanPenutup: string[];
  mediaDanSumber: string[];
  aktivitasSiswa: string[];
  asesmen: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
  };
  pendekatanPembelajaran?: string; // Deep Learning Kemendikdasmen (Mindful, Meaningful, Joyful)
  pilarDeepLearning?: {
    mindful: string; // Pembelajaran Berkesadaran
    meaningful: string; // Pembelajaran Bermakna
    joyful: string; // Pembelajaran Menggembirakan
  };
  dimensiCaturOlah?: {
    olahPikir: string; // Kognitif & Berpikir Kritis
    olahHati: string; // Karakter & Budi Pekerti
    olahRasa: string; // Estetika & Kepekaan Sosial
    olahRaga: string; // Kinestetik & Keaktifan Fisik
  };
  rubrikPenilaian: string;
  refleksiPembelajaran: string;
  createdAt: string;
}

export interface ComicPanel {
  panelNumber: number;
  sceneDescription: string;
  visualSceneType: 'canteen' | 'classroom' | 'library' | 'street' | 'park' | 'home' | 'village' | 'school' | string;
  speaker: string;
  speakerRole: string;
  dialogueEn: string;
  dialogueId: string;
  caption?: string;
  keywords: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface ComicStory {
  id: string;
  title: string;
  topic: string;
  style: 'comic' | 'cartoon' | 'manga';
  grade: GradeLevel;
  characters: Array<{ name: string; description: string; avatarColor?: string }>;
  panels: ComicPanel[];
  learningPoints: string[];
  createdAt: string;
}

export interface AnimatedVideoItem {
  id: string;
  title: string;
  sourceImage: string;
  videoUrl: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  duration: '5s' | '10s';
  modelUsed: string;
  createdAt: string;
}

export interface LearningModule {
  id: string;
  title: string;
  grade: GradeLevel;
  topic: string;
  description: string;
  isDemoModule?: boolean;
  semester?: 1 | 2;
  academicYear?: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    dialogue?: Array<{ speaker: string; textEn: string; textId: string }>;
    audioScript?: string;
    vocabularyIds?: string[];
  }>;
}

export interface AppDatabase {
  teacher: TeacherProfile;
  classes: ClassRoom[];
  students: Student[];
  modules: LearningModule[];
  vocabulary: VocabularyItem[];
  grammarTopics: GrammarTopic[];
  pronunciationItems: PronunciationItem[];
  pronunciationAttempts: PronunciationAttempt[];
  readingExercises: ReadingExercise[];
  listeningExercises: ListeningExercise[];
  writingTasks: WritingTask[];
  writingSubmissions: WritingSubmission[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  rubrics: SkillRubrics;
  lessonPlans: LessonPlan[];
}
