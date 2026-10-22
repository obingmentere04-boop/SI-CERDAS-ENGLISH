import React, { useState, useEffect, useRef } from 'react';
import { Student, SpeakingMessage, SpeakingSessionSummary } from '../../types';
import { api } from '../../services/api';
import { speechService } from '../../services/speech';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  HelpCircle, 
  Languages, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  MessageSquare, 
  Info,
  ChevronRight
} from 'lucide-react';

interface SpeakingPartnerProps {
  student: Student;
  onUpdatePoints: (pointsDelta: number) => void;
  onSessionComplete: () => void;
}

const TOPICS = [
  'Introducing Yourself',
  'Greetings and Partings',
  'Talking About Family',
  'My Daily Activities',
  'My Hobbies',
  'At School',
  'Asking for Directions',
  'Shopping',
  'Ordering Food',
  'Talking About My Village',
  'Talking About My Dreams',
];

export const SpeakingPartner: React.FC<SpeakingPartnerProps> = ({
  student,
  onUpdatePoints,
  onSessionComplete,
}) => {
  const [topic, setTopic] = useState('Introducing Yourself');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Elementary' | 'Intermediate'>('Beginner');
  const [partnerVoiceGender, setPartnerVoiceGender] = useState<'female' | 'male'>('female');
  const [messages, setMessages] = useState<SpeakingMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SpeakingSessionSummary | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSpeakingTts, setIsSpeakingTts] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<any>(null);

  const partnerName = partnerVoiceGender === 'female' ? 'Miss Sarah' : 'Alex';

  // Initialize conversation when topic, difficulty, or partner voice gender changes
  useEffect(() => {
    startNewConversation();
  }, [topic, difficulty, partnerVoiceGender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeHint, activeExplanation]);

  const startNewConversation = async () => {
    setActiveHint(null);
    setActiveExplanation(null);
    setSessionSummary(null);
    setShowSummaryModal(false);
    setIsAiLoading(true);

    let initialAiGreeting = `Hello! My name is ${partnerName}. What is your name?`;
    let initialTranslation = `Halo! Nama saya ${partnerName}. Siapa namamu?`;
    let initialHint = `You can say: Hello ${partnerName}, my name is ${student.name}.`;

    if (topic === 'Greetings and Partings') {
      initialAiGreeting = `Good morning! It is great to see you today. How are you feeling?`;
      initialTranslation = `Selamat pagi! Senang sekali bertemu denganmu hari ini. Bagaimana perasaanmu?`;
      initialHint = `You can say: Good morning ${partnerName}, I am feeling happy!`;
    } else if (topic === 'Talking About Family') {
      initialAiGreeting = `Hi! Tell me, how many people are there in your family?`;
      initialTranslation = `Hai! Ceritakan padaku, ada berapa orang dalam keluargamu?`;
      initialHint = `You can say: There are four people in my family: my father, my mother, my brother, and me.`;
    } else if (topic === 'Talking About My Village') {
      initialAiGreeting = `Hello! Where do you live, and what do you like about your village or town?`;
      initialTranslation = `Halo! Di mana kamu tinggal, dan apa yang kamu sukai dari desamu atau kotamu?`;
      initialHint = `You can say: I live in a quiet village. I like the green rice fields.`;
    } else if (topic === 'Ordering Food') {
      initialAiGreeting = `Welcome to the cafeteria! What delicious Indonesian food would you like to order today?`;
      initialTranslation = `Selamat datang di kafetaria! Makanan Indonesia lezat apa yang ingin kamu pesan hari ini?`;
      initialHint = `You can say: I would like a plate of fried rice and iced tea, please.`;
    }

    const firstMsg: SpeakingMessage = {
      id: 'msg-init',
      sender: 'ai',
      text: initialAiGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      translationId: initialTranslation,
      hint: initialHint,
    };

    setMessages([firstMsg]);
    setIsAiLoading(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiLoading) return;

    setChatError(null);
    setLastFailedText('');
    const userMsg: SpeakingMessage = {
      id: `usr-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setActiveHint(null);
    setActiveExplanation(null);
    setIsAiLoading(true);

    try {
      const response = await api.sendSpeakingMessage({
        messages: newMessages.map((m) => ({ sender: m.sender, text: m.text })),
        topic,
        difficulty,
        studentName: student.name,
        gender: partnerVoiceGender,
        partnerPersona: partnerName,
      });

      const aiMsg: SpeakingMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.replyEn || "That is interesting! What else can you tell me?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        translationId: response.translationId,
        correction: response.friendlyCorrection || undefined,
        hint: response.hintForStudent,
      };

      setMessages([...newMessages, aiMsg]);
      // Reward small points for speaking turn
      onUpdatePoints(5);

      // Auto play audio for AI speech with selected gender voice
      speechService.speak(aiMsg.text, 0.88, undefined, partnerVoiceGender);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setChatError(`Terjadi kendala jaringan saat menghubungi ${partnerName}. Anda dapat mencoba mengirim ulang.`);
      setLastFailedText(text);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Microphone STT handling
  const toggleListening = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!speechService.isSttSupported()) {
      alert(
        'Pengenalan suara browser (Speech Recognition) belum didukung pada browser ini. Anda tetap dapat mengetik jawaban di kotak teks!'
      );
      return;
    }

    try {
      const recognizer = speechService.createRecognizer('en-US');
      if (!recognizer) return;

      recognizerRef.current = recognizer;
      setIsListening(true);

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognizer.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognizer.start();
    } catch (err) {
      console.error('Microphone error:', err);
      setIsListening(false);
    }
  };

  const playAiVoice = (text: string) => {
    setIsSpeakingTts(true);
    speechService.speak(text, 0.88, () => setIsSpeakingTts(false), partnerVoiceGender);
  };

  const handleEndSession = async () => {
    setIsAiLoading(true);
    try {
      const summary = await api.getSpeakingSummary({
        messages: messages.map((m) => ({ sender: m.sender, text: m.text })),
        topic,
        difficulty,
      });
      setSessionSummary(summary);
      setShowSummaryModal(true);
      onUpdatePoints(25);
      onSessionComplete();
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl ${partnerVoiceGender === 'female' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">AI Speaking Partner</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${partnerVoiceGender === 'female' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-indigo-100 text-indigo-800'}`}>
                  {partnerVoiceGender === 'female' ? '👩 Suara Perempuan (Miss Sarah)' : '👨 Suara Laki-Laki (Alex)'}
                </span>
              </div>
              <p className="text-xs text-gray-700">
                Berlatih percakapan santai &amp; percaya diri bersama {partnerName} ({partnerVoiceGender === 'female' ? 'Suara Perempuan' : 'Suara Laki-laki'})
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Gender Switcher */}
          <div className="flex bg-rose-50/80 p-0.5 rounded-lg border border-rose-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPartnerVoiceGender('female')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                partnerVoiceGender === 'female' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-rose-600 hover:text-rose-900'
              }`}
              title="Aktifkan Suara Perempuan (Miss Sarah)"
            >
              <span>👩 Suara Perempuan</span>
            </button>
            <button
              type="button"
              onClick={() => setPartnerVoiceGender('male')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                partnerVoiceGender === 'male' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Aktifkan Suara Laki-Laki (Alex)"
            >
              <span>👨 Suara Laki-Laki</span>
            </button>
          </div>

          {/* Topic Select */}
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:ring-2 focus:ring-indigo-500"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Difficulty Select */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-semibold">
            {(['Beginner', 'Elementary', 'Intermediate'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-2 py-1 rounded-md transition-all ${
                  difficulty === lvl ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Test Voice Button */}
          <button
            type="button"
            onClick={() => {
              playAiVoice(`Hello ${student.name}! I am Miss Sarah, your friendly female English Speaking Partner. Let's practice speaking English together with courage!`);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Dengarkan Contoh Suara Perempuan Miss Sarah"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Uji Suara Perempuan</span>
          </button>

          <button
            onClick={startNewConversation}
            title="Mulai Ulang Percakapan"
            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Honest Disclaimer Banner */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl px-3.5 py-2 text-[11px] text-blue-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Catatan Pembelajaran:</strong> Fitur ini melatih keberanian dan responsif berbicara.
          Penilaian otomatis dan umpan balik adalah perkiraan simulasi, bukan pengganti evaluasi lisan tatap muka oleh guru Anda.
        </div>
      </div>

      {/* Chat Messages Screen */}
      <div className="bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col h-[480px]">
        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                {msg.sender === 'ai' && (
                  <div className={`w-8 h-8 rounded-full ${partnerVoiceGender === 'female' ? 'bg-gradient-to-tr from-rose-500 to-pink-600' : 'bg-gradient-to-tr from-indigo-600 to-blue-500'} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-xs`}>
                    {partnerVoiceGender === 'female' ? 'Sarah' : 'Alex'}
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'student'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-gray-100 text-gray-900 rounded-bl-xs border border-gray-200'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Audio TTS button for AI messages */}
                  {msg.sender === 'ai' && (
                    <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => playAiVoice(msg.text)}
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${partnerVoiceGender === 'female' ? 'text-rose-700 hover:text-rose-900' : 'text-indigo-700 hover:text-indigo-900'}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan ({partnerVoiceGender === 'female' ? 'Suara Perempuan' : 'Suara Laki-Laki'})</span>
                      </button>

                      {msg.translationId && (
                        <button
                          onClick={() =>
                            setActiveExplanation(
                              activeExplanation === msg.translationId ? null : (msg.translationId || null)
                            )
                          }
                          className="inline-flex items-center gap-1 text-gray-700 hover:text-indigo-700 text-[11px]"
                        >
                          <Languages className="w-3 h-3" />
                          <span>Arti Bahasa Indonesia</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Gentle Friendly Correction */}
                  {msg.correction && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Tips Santai:</strong> {msg.correction}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'student' && (
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-indigo-200"
                  />
                )}
              </div>

              <span className="text-[10px] text-gray-600 mt-1 px-10">
                {msg.sender === 'student' ? student.name : `${partnerName} (Speaking Partner)`} &bull; {msg.timestamp}
              </span>
            </div>
          ))}

          {isAiLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 italic pl-10">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{partnerName} sedang memikirkan respons yang ramah...</span>
            </div>
          )}

          {chatError && (
            <div className="p-2.5 mx-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
              <span>{chatError}</span>
              {lastFailedText && (
                <button
                  type="button"
                  onClick={() => handleSendMessage(lastFailedText)}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px] hover:bg-rose-700"
                >
                  Kirim Ulang
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Support Tools (Indonesian Translation & Hint) */}
        {(activeExplanation || activeHint) && (
          <div className="px-4 py-2 bg-indigo-50/70 border-t border-indigo-100 space-y-1.5 text-xs">
            {activeExplanation && (
              <div className="flex items-start gap-2 text-indigo-900">
                <Languages className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-950">Artinya dalam Bahasa Indonesia:</strong>
                  <p className="mt-0.5 text-indigo-800">{activeExplanation}</p>
                </div>
              </div>
            )}
            {activeHint && (
              <div className="flex items-start gap-2 text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-950">Petunjuk Menjawab (Hint):</strong>
                  <p className="mt-0.5 text-amber-800 font-medium">{activeHint}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Action Helpers */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {lastAiMsg?.translationId && (
              <button
                onClick={() =>
                  setActiveExplanation(
                    activeExplanation === lastAiMsg.translationId ? null : (lastAiMsg.translationId || null)
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Explain in Indonesian</span>
              </button>
            )}

            {lastAiMsg?.hint && (
              <button
                onClick={() =>
                  setActiveHint(
                    activeHint === lastAiMsg.hint ? null : (lastAiMsg.hint || null)
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-800 hover:bg-amber-50 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Give Me a Hint</span>
              </button>
            )}
          </div>

          <button
            onClick={handleEndSession}
            disabled={messages.length < 3 || isAiLoading}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Selesai &amp; Rangkuman Sesi</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
              title={isListening ? 'Berhenti merekam' : 'Bicara dengan mikrofon'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Mendengarkan ucapanmu...'
                  : 'Ketik jawabanmu dalam Bahasa Inggris... (atau klik ikon mic)'
              }
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isAiLoading}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 font-semibold text-sm flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Kirim</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummaryModal && sessionSummary && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Award className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Rangkuman Latihan Percakapan</h2>
                  <p className="text-xs text-gray-700">Topik: {topic} &bull; Level: {difficulty}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-gray-600 hover:text-gray-900 text-sm font-bold p-1"
              >
                Tutup
              </button>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-100 font-bold">
                  Pencapaian Hari Ini
                </div>
                <div className="text-lg font-extrabold mt-0.5">
                  Berani Berbicara +25 Poin!
                </div>
                <div className="text-xs text-emerald-100 mt-1">
                  Total giliran percakapan: {sessionSummary.questionsAnswered} pertanyaan
                </div>
              </div>
              <Sparkles className="w-10 h-10 text-emerald-200" />
            </div>

            {/* Overall Encouragement */}
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs leading-relaxed text-indigo-900">
              <strong className="block text-indigo-950 font-bold mb-1">
                Apresiasi dari Alex:
              </strong>
              {sessionSummary.overallEncouragement}
            </div>

            {/* 1. New Vocabulary */}
            {sessionSummary.newVocabulary?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Kosakata Baru Terkait Topik:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {sessionSummary.newVocabulary.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs rounded-lg font-medium border border-indigo-200"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Better Sentences */}
            {sessionSummary.betterSentences?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Contoh Kalimat yang Lebih Tepat &amp; Alami:
                </h3>
                <div className="space-y-2">
                  {sessionSummary.betterSentences.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                      <div className="text-rose-700 line-through">
                        &bull; Kalimatmu: "{s.original}"
                      </div>
                      <div className="text-emerald-700 font-bold">
                        &bull; Lebih tepat: "{s.improved}"
                      </div>
                      <div className="text-gray-700 italic">
                        Alasan: {s.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Mistakes to improve */}
            {sessionSummary.mistakesToImprove?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Catatan untuk Diingat:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                  {sessionSummary.mistakesToImprove.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Next Practice suggestions */}
            {sessionSummary.nextPracticeSuggestions?.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Saran Latihan Selanjutnya:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {sessionSummary.nextPracticeSuggestions.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors"
              >
                Lanjutkan Belajar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
