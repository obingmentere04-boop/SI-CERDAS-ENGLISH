import React, { useState, useMemo } from 'react';
import { VocabularyItem, Student } from '../../types';
import { speechService } from '../../services/speech';
import { 
  Volume2, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  BookMarked, 
  Layers, 
  Shuffle, 
  Check, 
  Brain, 
  HelpCircle,
  Award
} from 'lucide-react';

interface VocabularyBuilderProps {
  vocabulary: VocabularyItem[];
  student: Student;
  onUpdatePoints: (delta: number) => void;
}

type PracticeMode = 'flashcards' | 'matching' | 'fill' | 'unscramble' | 'mc' | 'riddle';

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({
  vocabulary,
  student,
  onUpdatePoints,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('flashcards');
  const [missedWordIds, setMissedWordIds] = useState<Set<string>>(new Set());

  // Filtered vocabulary list
  const filteredWords = useMemo(() => {
    let list = vocabulary;
    if (selectedTopic !== 'All') {
      list = list.filter((v) => v.topic === selectedTopic);
    }
    return list;
  }, [vocabulary, selectedTopic]);

  const topicsList = useMemo(() => {
    const set = new Set(vocabulary.map((v) => v.topic));
    return ['All', ...Array.from(set)];
  }, [vocabulary]);

  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const currentWord = filteredWords[cardIndex] || filteredWords[0];

  const handleNextCard = (markMastered: boolean) => {
    if (currentWord) {
      if (markMastered) {
        setMasteredIds((prev) => new Set(prev).add(currentWord.id));
        setMissedWordIds((prev) => {
          const next = new Set(prev);
          next.delete(currentWord.id);
          return next;
        });
        onUpdatePoints(5);
      } else {
        setMissedWordIds((prev) => new Set(prev).add(currentWord.id));
      }
    }
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  // Matching Game State
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());

  const matchingPool = useMemo(() => {
    const sample = filteredWords.slice(0, 6);
    const enList = sample.map((item) => ({ id: item.id, text: item.word }));
    const idList = sample.map((item) => ({ id: item.id, text: item.meaningId }));
    // Shuffle lists
    return {
      en: enList.sort(() => Math.random() - 0.5),
      id: idList.sort(() => Math.random() - 0.5),
    };
  }, [filteredWords]);

  const handleSelectMatchingItem = (type: 'en' | 'id', id: string) => {
    if (type === 'en') {
      setSelectedEn(id);
      if (selectedId) {
        checkMatch(id, selectedId);
      }
    } else {
      setSelectedId(id);
      if (selectedEn) {
        checkMatch(selectedEn, id);
      }
    }
  };

  const checkMatch = (enId: string, idId: string) => {
    if (enId === idId) {
      setMatchedPairs((prev) => new Set(prev).add(enId));
      onUpdatePoints(10);
    } else {
      setMissedWordIds((prev) => new Set(prev).add(enId));
    }
    setSelectedEn(null);
    setSelectedId(null);
  };

  // Unscramble Game State
  const [unscrambleAnswer, setUnscrambleAnswer] = useState<string[]>([]);
  const [unscrambleFeedback, setUnscrambleFeedback] = useState<boolean | null>(null);

  const lettersPool = useMemo(() => {
    if (!currentWord) return [];
    const letters = currentWord.word.toUpperCase().split('');
    return letters.sort(() => Math.random() - 0.5);
  }, [currentWord]);

  const [mcQuestionIndex, setMcQuestionIndex] = useState(0);
  const [selectedMcOption, setSelectedMcOption] = useState<number | null>(null);
  const [mcSubmitted, setMcSubmitted] = useState(false);

  // Fill in the blank state
  const [fillInput, setFillInput] = useState('');
  const [fillFeedback, setFillFeedback] = useState<boolean | null>(null);

  // Context Riddle state
  const [riddleInput, setRiddleInput] = useState('');
  const [riddleFeedback, setRiddleFeedback] = useState<boolean | null>(null);
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);

  const activeMcWord = filteredWords[mcQuestionIndex] || filteredWords[0];
  const mcOptions = useMemo(() => {
    if (!activeMcWord) return [];
    const others = vocabulary
      .filter((w) => w.id !== activeMcWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const all = [activeMcWord, ...others].sort(() => Math.random() - 0.5);
    return all;
  }, [activeMcWord, vocabulary]);

  const handleMcSubmit = (idx: number) => {
    setSelectedMcOption(idx);
    setMcSubmitted(true);
    const chosen = mcOptions[idx];
    if (chosen.id === activeMcWord.id) {
      onUpdatePoints(8);
      setMissedWordIds((prev) => {
        const next = new Set(prev);
        next.delete(activeMcWord.id);
        return next;
      });
    } else {
      setMissedWordIds((prev) => new Set(prev).add(activeMcWord.id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Vocabulary Builder</h1>
          <p className="text-xs text-gray-700">
            Perkaya kosakata Bahasa Inggris SMP dengan 6 variasi bentuk latihan interaktif
          </p>
        </div>

        {/* Topic Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Topik:</label>
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCardIndex(0);
            }}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:ring-2 focus:ring-indigo-500"
          >
            {topicsList.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold">
        {[
          { id: 'flashcards', label: '1. Flashcards' },
          { id: 'matching', label: '2. Mencocokkan Kata' },
          { id: 'unscramble', label: '3. Menyusun Huruf' },
          { id: 'mc', label: '4. Kuis Pilihan Ganda' },
          { id: 'fill', label: '5. Melengkapi Kalimat' },
          { id: 'riddle', label: '6. Tebak Konteks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPracticeMode(tab.id as PracticeMode)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              practiceMode === tab.id
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-700 hover:text-indigo-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Missed words notification if any */}
      {missedWordIds.size > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-amber-600" />
            <span>
              Ada <strong>{missedWordIds.size} kosakata</strong> yang perlu kamu latih ulang agar makin hafal!
            </span>
          </div>
          <button
            onClick={() => {
              // Jump card index to first missed word
              const firstMissed = filteredWords.findIndex((w) => missedWordIds.has(w.id));
              if (firstMissed !== -1) {
                setCardIndex(firstMissed);
                setPracticeMode('flashcards');
              }
            }}
            className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
          >
            Latih Sekarang &rarr;
          </button>
        </div>
      )}

      {/* 1. Flashcard Mode */}
      {practiceMode === 'flashcards' && currentWord && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-indigo-100 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-between w-full text-xs font-semibold text-gray-700">
            <span>
              Kartu {cardIndex + 1} dari {filteredWords.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
              {currentWord.topic} &bull; {currentWord.difficulty}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-md min-h-[260px] bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 border-2 border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:border-indigo-400 transition-all select-none"
          >
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 bg-indigo-100 rounded">
                  {currentWord.partOfSpeech}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  {currentWord.word}
                </div>
                <div className="text-sm font-mono text-indigo-600 font-medium">
                  {currentWord.phonetic}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speechService.speak(currentWord.word, 0.85);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-semibold hover:bg-indigo-200 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengar Pelafalan</span>
                </button>
                <p className="text-[11px] text-gray-700 pt-3">
                  (Klik kartu untuk melihat arti &amp; contoh kalimat)
                </p>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in zoom-in duration-150">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 px-2 py-0.5 bg-emerald-100 rounded">
                  Arti Bahasa Indonesia
                </span>
                <div className="text-2xl font-bold text-gray-900">
                  {currentWord.meaningId}
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-left space-y-1">
                  <div className="text-gray-900 font-semibold italic">
                    "{currentWord.exampleEn}"
                  </div>
                  <div className="text-gray-700">
                    "{currentWord.exampleId}"
                  </div>
                </div>
                <p className="text-[11px] text-gray-700">
                  (Klik lagi untuk kembali ke kata Bahasa Inggris)
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNextCard(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 font-bold text-xs transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              <span>Perlu Diulang Nanti</span>
            </button>
            <button
              onClick={() => handleNextCard(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sudah Hafal (+5 Poin)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Matching Game Mode */}
      {practiceMode === 'matching' && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-4">
          <div className="text-xs text-gray-700">
            Jodohkan kata Bahasa Inggris (kolom kiri) dengan artinya dalam Bahasa Indonesia (kolom kanan):
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* English Column */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-indigo-700 mb-1">
                Bahasa Inggris
              </div>
              {matchingPool.en.map((item) => {
                const isMatched = matchedPairs.has(item.id);
                const isSelected = selectedEn === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSelectMatchingItem('en', item.id)}
                    className={`w-full p-3 rounded-xl text-xs font-bold transition-all border text-left ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 opacity-60'
                        : isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-indigo-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.text}</span>
                      {isMatched && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Indonesian Column */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-blue-700 mb-1">
                Arti Bahasa Indonesia
              </div>
              {matchingPool.id.map((item) => {
                const isMatched = matchedPairs.has(item.id);
                const isSelected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSelectMatchingItem('id', item.id)}
                    className={`w-full p-3 rounded-xl text-xs font-bold transition-all border text-left ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 opacity-60'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-blue-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.text}</span>
                      {isMatched && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-right text-xs font-bold text-emerald-600">
            Terjodohkan: {matchedPairs.size} dari {matchingPool.en.length} pasang
          </div>
        </div>
      )}

      {/* 3. Unscramble Letters Mode */}
      {practiceMode === 'unscramble' && currentWord && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-6 text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Menyusun Huruf (Word Scramble)
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-1">
              Arti: "{currentWord.meaningId}"
            </h2>
            <p className="text-xs text-gray-700 mt-0.5">
              Klik huruf di bawah secara berurutan untuk menyusun kata yang tepat!
            </p>
          </div>

          {/* Answer Box */}
          <div className="min-h-[50px] p-3 rounded-xl bg-gray-50 border-2 border-dashed border-indigo-300 flex items-center justify-center gap-2">
            {unscrambleAnswer.length === 0 ? (
              <span className="text-xs text-gray-600 italic">
                Huruf yang dipilih akan muncul di sini
              </span>
            ) : (
              unscrambleAnswer.map((char, i) => (
                <span
                  key={i}
                  className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs"
                >
                  {char}
                </span>
              ))
            )}
          </div>

          {/* Letter Tiles to Click */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {lettersPool.map((letter, i) => (
              <button
                key={i}
                onClick={() => setUnscrambleAnswer([...unscrambleAnswer, letter])}
                className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-base hover:bg-indigo-100 active:scale-95 transition-all shadow-xs"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Check and Reset buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setUnscrambleAnswer([]);
                setUnscrambleFeedback(null);
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
            >
              Hapus Susunan
            </button>
            <button
              onClick={() => {
                const formed = unscrambleAnswer.join('').toUpperCase();
                const target = currentWord.word.toUpperCase();
                const isCorrect = formed === target;
                setUnscrambleFeedback(isCorrect);
                if (isCorrect) onUpdatePoints(10);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs"
            >
              Periksa Jawaban
            </button>
            <button
              onClick={() => {
                setUnscrambleAnswer([]);
                setUnscrambleFeedback(null);
                setCardIndex((prev) => (prev + 1) % filteredWords.length);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100"
            >
              Kata Berikutnya &rarr;
            </button>
          </div>

          {unscrambleFeedback !== null && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                unscrambleFeedback
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {unscrambleFeedback ? (
                <span>Tepat sekali! Jawabannya adalah "{currentWord.word}". +10 Poin!</span>
              ) : (
                <span>Kurang tepat, coba susun kembali atau cek arti katanya.</span>
              )}
              <button
                onClick={() => {
                  setUnscrambleAnswer([]);
                  setUnscrambleFeedback(null);
                  setCardIndex((prev) => (prev + 1) % filteredWords.length);
                }}
                className="underline ml-2"
              >
                Lanjut &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Multiple Choice Mode */}
      {practiceMode === 'mc' && activeMcWord && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>
              Soal {mcQuestionIndex + 1} dari {filteredWords.length}
            </span>
            <span className="font-bold text-indigo-600">Pilihan Ganda</span>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900">
              Apa arti dari kata Bahasa Inggris berikut:{' '}
              <span className="text-indigo-600 text-lg underline font-mono">
                "{activeMcWord.word}"
              </span>
              ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mcOptions.map((opt, idx) => {
              const isSelected = selectedMcOption === idx;
              const isCorrect = opt.id === activeMcWord.id;
              let btnClass = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-indigo-50/60';
              if (mcSubmitted) {
                if (isCorrect) btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                else if (isSelected) btnClass = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
              } else if (isSelected) {
                btnClass = 'bg-indigo-600 text-white border-indigo-600';
              }

              return (
                <button
                  key={opt.id}
                  disabled={mcSubmitted}
                  onClick={() => handleMcSubmit(idx)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${btnClass}`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt.meaningId}</span>
                </button>
              );
            })}
          </div>

          {mcSubmitted && (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-700">
                Contoh kalimat: <em>"{activeMcWord.exampleEn}"</em>
              </span>
              <button
                onClick={() => {
                  setSelectedMcOption(null);
                  setMcSubmitted(false);
                  setMcQuestionIndex((prev) => (prev + 1) % filteredWords.length);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
              >
                Soal Berikutnya &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Fill-in-the-blank Mode (Interactive) */}
      {practiceMode === 'fill' && currentWord && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="uppercase tracking-wider text-indigo-600">
              Melengkapi Kalimat Berdasarkan Konteks
            </span>
            <span className="text-gray-500">
              Kata {cardIndex + 1} dari {filteredWords.length}
            </span>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-sm text-gray-900 leading-relaxed font-serif">
            {currentWord.exampleEn.replace(new RegExp(currentWord.word, 'gi'), '__________')}
          </div>
          <p className="text-xs text-gray-700 italic">
            Petunjuk Terjemahan: "{currentWord.exampleId}" (Arti kata: {currentWord.meaningId})
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={fillInput}
              onChange={(e) => setFillInput(e.target.value)}
              placeholder="Ketik kata bahasa Inggris yang tepat..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => {
                const isCorrect = fillInput.trim().toLowerCase() === currentWord.word.toLowerCase();
                setFillFeedback(isCorrect);
                if (isCorrect) {
                  onUpdatePoints(10);
                  setMissedWordIds((prev) => {
                    const next = new Set(prev);
                    next.delete(currentWord.id);
                    return next;
                  });
                } else {
                  setMissedWordIds((prev) => new Set(prev).add(currentWord.id));
                }
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs"
            >
              Periksa Jawaban
            </button>
          </div>

          {fillFeedback !== null && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                fillFeedback
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {fillFeedback ? (
                <span>Tepat sekali! Kata yang benar adalah "{currentWord.word}". +10 Poin!</span>
              ) : (
                <span>Kurang tepat. Kata yang benar adalah "{currentWord.word}".</span>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => {
                setFillInput('');
                setFillFeedback(null);
                setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600"
            >
              &larr; Kata Sebelumnya
            </button>
            <button
              onClick={() => {
                setFillInput('');
                setFillFeedback(null);
                setCardIndex((prev) => (prev + 1) % filteredWords.length);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
            >
              Kata Berikutnya &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 6. Context Riddle Mode (Interactive) */}
      {practiceMode === 'riddle' && currentWord && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 text-indigo-700 uppercase">
              <Brain className="w-4 h-4" />
              <span>Tebak Kata Berdasarkan Petunjuk Konteks (Riddle)</span>
            </div>
            <span className="text-gray-500">
              Kata {cardIndex + 1} dari {filteredWords.length}
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
            <div>
              <strong>Petunjuk 1 (Part of Speech):</strong> {currentWord.partOfSpeech}
            </div>
            <div>
              <strong>Petunjuk 2 (Topik):</strong> {currentWord.topic}
            </div>
            <div>
              <strong>Petunjuk 3 (Contoh Penggunaan):</strong> "{currentWord.exampleEn.replace(new RegExp(currentWord.word, 'gi'), '???')}"
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={riddleInput}
              onChange={(e) => setRiddleInput(e.target.value)}
              placeholder="Tebak kata rahasia..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => {
                const isCorrect = riddleInput.trim().toLowerCase() === currentWord.word.toLowerCase();
                setRiddleFeedback(isCorrect);
                if (isCorrect) {
                  onUpdatePoints(10);
                  setShowRiddleAnswer(true);
                }
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs"
            >
              Periksa Tebakan
            </button>
            <button
              onClick={() => setShowRiddleAnswer(!showRiddleAnswer)}
              className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
            >
              {showRiddleAnswer ? 'Sembunyikan Kunci' : 'Buka Kunci'}
            </button>
          </div>

          {riddleFeedback !== null && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                riddleFeedback
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {riddleFeedback ? (
                <span>Tebakanmu Tepat Sekali! +10 Poin!</span>
              ) : (
                <span>Belum tepat, coba perhatikan petunjuk contoh kalimatnya lagi.</span>
              )}
            </div>
          )}

          {showRiddleAnswer && (
            <div className="text-center p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xs text-gray-600 block mb-0.5">Kata rahasianya adalah:</span>
              <span className="text-2xl font-extrabold text-indigo-700 font-mono tracking-wider">
                {currentWord.word}
              </span>
              <span className="text-xs text-gray-700 block mt-1 font-semibold">
                Arti: {currentWord.meaningId}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => {
                setRiddleInput('');
                setRiddleFeedback(null);
                setShowRiddleAnswer(false);
                setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600"
            >
              &larr; Kata Sebelumnya
            </button>
            <button
              onClick={() => {
                setRiddleInput('');
                setRiddleFeedback(null);
                setShowRiddleAnswer(false);
                setCardIndex((prev) => (prev + 1) % filteredWords.length);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
            >
              Kata Berikutnya &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
