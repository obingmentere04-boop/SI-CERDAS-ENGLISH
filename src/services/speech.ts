// Speech Synthesis & Recognition Services for SI CERDAS ENGLISH

// Calculate Levenshtein distance for fuzzy string comparison
export function calculateSimilarity(target: string, actual: string): number {
  const s1 = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const s2 = actual.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;

  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  const score = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));
  return score;
}

export const speechService = {
  isTtsSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  isSttSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
  },

  speak(text: string, rate: number = 0.88, onEnd?: () => void, gender: 'female' | 'male' = 'female') {
    if (!this.isTtsSupported()) {
      console.warn('Text-to-Speech not supported in this browser.');
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel any active utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate; // clear speech for SMP learners
      utterance.pitch = gender === 'female' ? 1.15 : 0.95;

      // Select an English voice with gender preference (Female prioritized for Miss Sarah)
      let voices = window.speechSynthesis.getVoices();
      let englishVoices = voices.filter((v) => v.lang.startsWith('en'));

      let selectedVoice: SpeechSynthesisVoice | undefined;

      if (gender === 'female') {
        const femaleKeywords = ['female', 'samantha', 'zira', 'victoria', 'karen', 'jenny', 'ava', 'emma', 'moira', 'tessa', 'siri', 'woman', 'kendra', 'allison'];
        selectedVoice = englishVoices.find((v) =>
          femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
        ) || englishVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) || englishVoices[0] || voices[0];
      } else {
        const maleKeywords = ['male', 'david', 'george', 'guy', 'daniel', 'alex', 'man'];
        selectedVoice = englishVoices.find((v) =>
          maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
        ) || englishVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) || englishVoices[0] || voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      onEnd?.();
    }
  },

  stopSpeaking() {
    if (this.isTtsSupported()) {
      window.speechSynthesis.cancel();
    }
  },

  createRecognizer(lang: string = 'en-US') {
    if (!this.isSttSupported()) return null;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognizer = new SpeechRecognitionClass();
    recognizer.lang = lang;
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;
    return recognizer;
  },
};
