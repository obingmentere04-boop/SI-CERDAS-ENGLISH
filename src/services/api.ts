import { AppDatabase } from '../types';
import { initialDatabase } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'si_cerdas_english_db';

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return {
      status: 'offline',
      appName: 'SI CERDAS ENGLISH',
      tagline: 'Learn with Confidence, Speak with Courage!',
      hasGeminiKey: false,
      model: 'gemini-3.8-flash',
    };
  },

  async loadDatabase(): Promise<AppDatabase> {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        // sync to localStorage for offline cache
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('Failed to load from server, checking local cache:', err);
    }

    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }

    return initialDatabase;
  },

  async saveDatabase(db: AppDatabase): Promise<boolean> {
    // always save to localStorage first
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db),
      });
      return res.ok;
    } catch (err) {
      console.warn('Failed to save to server, saved locally:', err);
      return true;
    }
  },

  async resetDemoData(): Promise<AppDatabase> {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    try {
      const res = await fetch('/api/data/reset-demo', { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result.data));
        return result.data;
      }
    } catch (err) {
      console.warn('Failed to reset on server, resetting locally:', err);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDatabase));
    return initialDatabase;
  },

  async sendSpeakingMessage(params: {
    messages: Array<{ sender: 'ai' | 'student'; text: string }>;
    topic: string;
    difficulty: string;
    studentName?: string;
    gender?: 'female' | 'male';
    partnerPersona?: string;
  }) {
    try {
      const res = await fetch('/api/gemini/speaking-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Speaking chat fetch error:', err);
    }
    return {
      replyEn: "That's great! Can you tell me more about your hobby?",
      translationId: 'Bagus sekali! Bisakah kamu menceritakan lebih banyak tentang hobimu?',
      friendlyCorrection: null,
      hintForStudent: 'You can say: I like it because... (Saya menyukainya karena...)',
    };
  },

  async getSpeakingSummary(params: {
    messages: Array<{ sender: 'ai' | 'student'; text: string }>;
    topic: string;
    difficulty: string;
  }) {
    try {
      const res = await fetch('/api/gemini/speaking-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Speaking summary fetch error:', err);
    }
    return {
      questionsAnswered: params.messages.filter((m) => m.sender === 'student').length,
      newVocabulary: ['Confidence', 'Courage', 'Greetings', 'Daily Routine'],
      mistakesToImprove: ['Gunakan to be yang tepat sesuai subjek.', 'Latihlah intonasi kalimat tanya.'],
      betterSentences: [],
      nextPracticeSuggestions: ['Coba latihan pengucapan di Pronunciation Practice.'],
      overallEncouragement: 'Hebat! Kamu sudah berani berbicara Bahasa Inggris. Terus berlatih!',
    };
  },

  async generateVocabulary(params: {
    topic: string;
    count: number;
    grade: string;
    difficulty: string;
  }) {
    try {
      const res = await fetch('/api/gemini/vocab-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Vocab generator error:', err);
    }
    return [];
  },

  async askGrammarTutor(params: {
    question: string;
    topic: string;
    grade: string;
  }) {
    try {
      const res = await fetch('/api/gemini/grammar-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Grammar explain error:', err);
    }
    return null;
  },

  async generateLessonPlan(params: {
    grade: string;
    semester: number;
    academicYear?: string;
    topic: string;
    timeAllocation: string;
    studentLevel: string;
    learningModel: string;
    media: string[];
    specialNeedsNotes: string;
  }) {
    try {
      const res = await fetch('/api/gemini/lesson-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Lesson planner error:', err);
    }
    return null;
  },

  async evaluateWriting(params: {
    prompt: string;
    content: string;
    grade: string;
    minWords: number;
  }) {
    try {
      const res = await fetch('/api/gemini/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Writing feedback error:', err);
    }
    return null;
  },

  async generateQuiz(params: {
    topic: string;
    grade: string;
    count?: number;
    category?: string;
    questionFormat?: 'mixed' | 'mc' | 'essay';
  }) {
    try {
      const res = await fetch('/api/gemini/quiz-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Quiz generator error:', err);
    }
    return null;
  },

  async generateComic(params: {
    topic: string;
    style?: 'comic' | 'cartoon' | 'manga';
    grade: string;
    panelsCount?: number;
    characters?: string;
  }) {
    try {
      const res = await fetch('/api/gemini/generate-comic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Generate comic error:', err);
    }
    return null;
  },

  // Animate uploaded image or comic scene into video using Gemini Omni 1.1 Flash via Interactions API
  async animateImageToVideo(params: {
    image?: string;
    mimeType?: string;
    prompt: string;
    aspectRatio: '16:9' | '9:16';
    duration?: '5s' | '10s';
  }) {
    try {
      const res = await fetch('/api/gemini/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Animate video error:', err);
    }
    return null;
  },

  // Generate high quality educational comic/cartoon panel illustration
  async generatePanelImage(params: {
    prompt: string;
    style?: 'comic' | 'cartoon' | 'manga';
    aspectRatio?: '1:1' | '16:9' | '4:3';
  }) {
    try {
      const res = await fetch('/api/gemini/generate-panel-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Generate panel image error:', err);
    }
    return null;
  },
};
