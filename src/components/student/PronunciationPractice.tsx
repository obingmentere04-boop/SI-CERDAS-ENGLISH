import React, { useState, useRef, useEffect } from 'react';
import { PronunciationItem, Student } from '../../types';
import { speechService, calculateSimilarity } from '../../services/speech';
import { 
  Volume2, 
  Mic, 
  Square, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Award, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PronunciationPracticeProps {
  items: PronunciationItem[];
  student: Student;
  onUpdatePoints: (pointsDelta: number) => void;
  onSaveAttempt?: (attempt: any) => void;
}

export const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  items,
  student,
  onUpdatePoints,
  onSaveAttempt,
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudioModel, setIsPlayingAudioModel] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);
  const [speechResultText, setSpeechResultText] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognizerRef = useRef<any>(null);

  const currentItem = items[selectedItemIndex] || items[0];

  // Reset state when switching items
  useEffect(() => {
    resetPracticeState();
  }, [selectedItemIndex]);

  const resetPracticeState = () => {
    if (isRecording) stopRecording();
    setRecordedAudioUrl(null);
    setSpeechResultText(null);
    setSimilarityScore(null);
    setEvaluationFeedback(null);
  };

  const playAudioModel = () => {
    if (!currentItem) return;
    setIsPlayingAudioModel(true);
    speechService.speak(currentItem.audioModelText, 0.82, () => {
      setIsPlayingAudioModel(false);
    });
  };

  const startRecording = async () => {
    setMicPermissionDenied(false);
    setRecordedAudioUrl(null);
    setSpeechResultText(null);
    setSimilarityScore(null);
    setEvaluationFeedback(null);
    audioChunksRef.current = [];

    // 1. Request microphone permission for MediaRecorder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 2. Also start Web Speech Recognition if available to evaluate actual spoken words
      if (speechService.isSttSupported()) {
        const recognizer = speechService.createRecognizer('en-US');
        if (recognizer) {
          speechRecognizerRef.current = recognizer;
          recognizer.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSpeechResultText(transcript);
            evaluatePronunciation(transcript);
          };
          recognizer.onerror = (err: any) => {
            console.warn('Speech recognition notice:', err.error);
            if (!speechResultText) {
              setSpeechResultText('(Suara belum tertangkap jelas oleh browser)');
              setSimilarityScore(null);
              setEvaluationFeedback(
                'Browser belum dapat mendeteksi ucapan dengan jelas. Coba dekatkan mikrofon dan bicara lebih lantang.'
              );
            }
          };
          recognizer.start();
        }
      }
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      setMicPermissionDenied(true);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    recordedAudioElementRef.current = audio;
    setIsPlayingRecordedAudio(true);
    audio.play();
    audio.onended = () => setIsPlayingRecordedAudio(false);
    audio.onerror = () => setIsPlayingRecordedAudio(false);
  };

  const evaluatePronunciation = (recognized: string) => {
    const target = currentItem.wordOrPhrase;
    const score = calculateSimilarity(target, recognized);
    setSimilarityScore(score);

    let feedback = '';
    if (score >= 85) {
      feedback = 'Luar biasa! Pengucapanmu sangat akurat dan mudah dipahami.';
      onUpdatePoints(10);
    } else if (score >= 65) {
      feedback = 'Bagus sekali! Artikulasi sudah mendekati, perhatikan penekanan suku kata.';
      onUpdatePoints(5);
    } else {
      feedback = 'Sudah mencoba dengan baik! Dengarkan kembali audio model lalu coba tirukan sekali lagi.';
      onUpdatePoints(2);
    }
    setEvaluationFeedback(feedback);

    if (onSaveAttempt) {
      onSaveAttempt({
        id: `att-${Date.now()}`,
        studentId: student.id,
        itemId: currentItem.id,
        targetText: target,
        recognizedText: recognized,
        score,
        feedback,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Title Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pronunciation Practice</h1>
          <p className="text-xs text-gray-700">
            Latihan pelafalan kata dan kalimat Bahasa Inggris dengan contoh audio dan rekaman suara
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 self-start sm:self-auto">
          Kata {selectedItemIndex + 1} dari {items.length}
        </div>
      </div>

      {/* Honest Disclaimer Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <strong className="text-amber-950 font-bold">Transparansi Penilaian Suara:</strong>
          <p>
            Penilaian otomatis ini merupakan <em>perkiraan</em> berdasarkan pengenalan suara browser,
            bukan pengganti penilaian guru atau ahli bahasa. Tidak ada skor palsu yang dibuat tanpa rekaman nyata.
          </p>
        </div>
      </div>

      {/* Main Practice Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Word Items Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-indigo-100 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Pilih Kata / Kalimat:
          </h2>
          <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedItemIndex(idx)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                  selectedItemIndex === idx
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                    : 'bg-gray-50 hover:bg-indigo-50/60 text-gray-800 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{item.wordOrPhrase}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      selectedItemIndex === idx
                        ? 'bg-indigo-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    selectedItemIndex === idx ? 'text-indigo-100' : 'text-gray-700'
                  }`}
                >
                  {item.meaningId}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Word Practice Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-indigo-100 flex flex-col justify-between space-y-6">
          {/* Target Word Hero */}
          <div className="text-center space-y-2 py-4 bg-gradient-to-b from-indigo-50/40 to-white rounded-2xl border border-indigo-50">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 bg-indigo-100/70 rounded-full">
              Target Pengucapan
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {currentItem.wordOrPhrase}
            </div>
            <div className="text-base font-medium text-indigo-700 font-mono">
              {currentItem.phonetic}
            </div>
            <div className="text-xs text-gray-700">
              Arti: <strong className="text-gray-900">{currentItem.meaningId}</strong>
            </div>

            {currentItem.syllables && (
              <div className="inline-block mt-1 px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                Pemisahan Suku Kata: <span className="text-indigo-700">{currentItem.syllables}</span>
              </div>
            )}
          </div>

          {/* Tips Section */}
          {currentItem.tip && (
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Tips Pelafalan:</strong> {currentItem.tip}
              </div>
            </div>
          )}

          {/* Action Buttons: Audio Model & Record */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Listen to Model Audio */}
              <button
                onClick={playAudioModel}
                disabled={isPlayingAudioModel}
                className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold text-xs transition-colors"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudioModel ? 'animate-bounce' : ''}`} />
                <span>
                  {isPlayingAudioModel ? 'Memutar Audio Model...' : 'Dengarkan Contoh Audio'}
                </span>
              </button>

              {/* Record Mic Button */}
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs transition-colors shadow-xs"
                >
                  <Mic className="w-4 h-4" />
                  <span>Rekam Suara Saya</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold text-xs animate-pulse transition-colors shadow-xs"
                >
                  <Square className="w-4 h-4" />
                  <span>Berhenti Merekam</span>
                </button>
              )}
            </div>

            {/* Permission Denied Alert */}
            {micPermissionDenied && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Akses mikrofon belum diizinkan oleh browser. Silakan izinkan akses mikrofon di pengaturan browser Anda.
                </span>
              </div>
            )}

            {/* Playback & Results Area */}
            {recordedAudioUrl && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Hasil Rekaman Suaramu:</span>
                  <button
                    onClick={playRecordedAudio}
                    disabled={isPlayingRecordedAudio}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs font-semibold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isPlayingRecordedAudio ? 'Memutar...' : 'Putar Rekaman Saya'}</span>
                  </button>
                </div>

                {/* Speech Recognition Comparison & Score */}
                {speechResultText && (
                  <div className="pt-2 border-t border-gray-200/80 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-gray-700">
                        Kata yang tertangkap:{' '}
                        <strong className="text-gray-900 font-mono text-sm">
                          "{speechResultText}"
                        </strong>
                      </span>
                      {similarityScore !== null && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                          <Award className="w-3.5 h-3.5" />
                          <span>Skor Perkiraan: {similarityScore}%</span>
                        </div>
                      )}
                    </div>

                    {evaluationFeedback && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs border border-emerald-200 flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>{evaluationFeedback}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation to Next Word */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setSelectedItemIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedItemIndex === 0}
              className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 disabled:opacity-30"
            >
              &larr; Kata Sebelumnya
            </button>
            <button
              onClick={() => setSelectedItemIndex((prev) => Math.min(items.length - 1, prev + 1))}
              disabled={selectedItemIndex === items.length - 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-30 transition-colors shadow-xs"
            >
              <span>Kata Selanjutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
