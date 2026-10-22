import React, { useState, useRef } from 'react';
import { GradeLevel, ComicStory, AnimatedVideoItem } from '../../types';
import { api } from '../../services/api';
import { speechService } from '../../services/speech';
import { 
  Palette, 
  Sparkles, 
  Volume2, 
  Languages, 
  Printer, 
  Download, 
  BookOpen, 
  Check, 
  Image as ImageIcon,
  Film,
  Upload,
  Play,
  Pause,
  RefreshCw,
  Video,
  Monitor,
  Smartphone,
  Eye,
  Sliders,
  AlertCircle,
  FileVideo,
  CheckCircle2,
  Trash2,
  Maximize2
} from 'lucide-react';

interface ComicCartoonGeneratorProps {
  selectedGrade?: GradeLevel;
  userRole?: 'guru' | 'siswa' | 'admin';
}

const PRESET_TOPICS = [
  { title: 'Ordering Food at Canteen', desc: 'Percakapan memesan makanan & minuman di kantin sekolah SMP' },
  { title: 'Asking Directions to Library', desc: 'Menanyakan dan memberikan petunjuk arah di lingkungan sekolah' },
  { title: 'Meeting a New Friend', desc: 'Berkenalan dengan teman baru di awal tahun ajaran baru' },
  { title: 'Talking About Hobbies', desc: 'Menceritakan kegemaran bermain musik dan olahraga di akhir pekan' },
  { title: 'A Funny Talking Cat', desc: 'Kartun lucu kucing pintar yang mengajarkan kosakata bahasa Inggris' },
];

const MOTION_PRESETS = [
  { label: '👋 Lambaian & Senyum', prompt: 'Animate character smiling gently, waving hand with friendly greeting expression in cartoon style.' },
  { label: '🍃 Angin & Gerakan Alam', prompt: 'Soft gentle breeze blowing through hair, cherry blossoms or leaves drifting in the background.' },
  { label: '💬 Percakapan Ekspresif', prompt: 'Character talking expressively with natural head tilts, lively eyes, and engaging classroom gestures.' },
  { label: '🎥 Cinematic Pan & Zoom', prompt: 'Smooth cinematic slow zoom in on character with dynamic 2D anime lighting and depth of field.' },
];

const SAMPLE_PHOTOS = [
  {
    name: 'Ruang Kelas SMP',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    desc: 'Suasana kelas belajar interaktif SMP'
  },
  {
    name: 'Siswa Belajar Bersama',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    desc: 'Siswa berdiskusi aktif dalam bahasa Inggris'
  },
  {
    name: 'Taman Sekolah Ceria',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    desc: 'Suasana santai di halaman sekolah'
  }
];

export const ComicCartoonGenerator: React.FC<ComicCartoonGeneratorProps> = ({
  selectedGrade = 'VII',
  userRole = 'siswa',
}) => {
  // Navigation Tab: 'comic' (Studio Gambar Komik & Kartun) or 'video' (Animate Images into Video)
  const [activeTab, setActiveTab] = useState<'comic' | 'video'>('comic');

  // Comic State
  const [topic, setTopic] = useState('Ordering Food at Canteen');
  const [style, setStyle] = useState<'comic' | 'cartoon' | 'manga'>('comic');
  const [grade, setGrade] = useState<GradeLevel>(selectedGrade);
  const [panelsCount, setPanelsCount] = useState<number>(4);
  const [characters, setCharacters] = useState('Rian and Maya');
  const [isLoading, setIsLoading] = useState(false);
  const [showIndonesian, setShowIndonesian] = useState(false);
  const [activeSpeechIdx, setActiveSpeechIdx] = useState<number | null>(null);
  const [regeneratingPanelIdx, setRegeneratingPanelIdx] = useState<number | null>(null);

  // Initial Comic Data with Illustrated Panels
  const [comicData, setComicData] = useState<ComicStory>({
    id: 'comic-init',
    title: 'Lunch Break at the School Canteen',
    topic: 'Ordering Food at Canteen',
    style: 'comic',
    grade: 'VII',
    characters: [
      { name: 'Rian', description: 'Siswa kelas VII yang ceria dan ramah', avatarColor: '#3B82F6' },
      { name: 'Maya', description: 'Teman sekelas Rian yang pintar', avatarColor: '#EC4899' },
      { name: 'Mrs. Ani', description: 'Ibu kantin sekolah yang ramah', avatarColor: '#10B981' },
    ],
    panels: [
      {
        panelNumber: 1,
        sceneDescription: 'Rian and Maya walk eagerly towards the school canteen during lunch break.',
        visualSceneType: 'canteen',
        speaker: 'Rian',
        speakerRole: 'student',
        dialogueEn: 'I am so hungry after math class! Let us go to the canteen, Maya.',
        dialogueId: 'Aku lapar sekali setelah pelajaran matematika! Ayo kita ke kantin, Maya.',
        caption: 'Panel 1: Lunch Break Bell Rings!',
        keywords: ['Hungry', 'Canteen'],
        imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="%23eef2ff"/><rect y="240" width="100%" height="120" fill="%23ffffff"/><circle cx="200" cy="140" r="45" fill="%233b82f6"/><circle cx="440" cy="140" r="45" fill="%23ec4899"/><text x="320" y="300" font-family="sans-serif" font-weight="bold" font-size="20" fill="%231e1b4b" text-anchor="middle">School Canteen Lunch Break</text></svg>`,
      },
      {
        panelNumber: 2,
        sceneDescription: 'Maya looks at the colorful menu on the canteen wall with excitement.',
        visualSceneType: 'canteen',
        speaker: 'Maya',
        speakerRole: 'student',
        dialogueEn: 'Me too! What would you like to eat today?',
        dialogueId: 'Aku juga! Kamu mau makan apa hari ini?',
        caption: 'Panel 2: Looking at the delicious menu.',
        keywords: ['Would like', 'Eat'],
        imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="%23fdf4ff"/><rect y="240" width="100%" height="120" fill="%23ffffff"/><circle cx="320" cy="130" r="48" fill="%23ec4899"/><rect x="220" y="210" width="200" height="40" rx="8" fill="%23fbcfe8"/><text x="320" y="235" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23831843" text-anchor="middle">Menu: Noodles &amp; Tea</text></svg>`,
      },
      {
        panelNumber: 3,
        sceneDescription: 'Rian politely orders fried noodles and cold iced tea from Mrs. Ani at the food stall.',
        visualSceneType: 'canteen',
        speaker: 'Rian',
        speakerRole: 'student',
        dialogueEn: 'Good afternoon, Mrs. Ani! May I have a plate of fried noodles and an iced tea, please?',
        dialogueId: 'Selamat siang Bu Ani! Boleh saya pesan sepiring mie goreng dan es teh manis?',
        caption: 'Panel 3: Ordering politely.',
        keywords: ['Fried noodles', 'Iced tea', 'Please'],
        imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="%23e0f2fe"/><rect y="240" width="100%" height="120" fill="%23ffffff"/><circle cx="180" cy="140" r="42" fill="%233b82f6"/><circle cx="460" cy="140" r="42" fill="%2310b981"/><text x="320" y="295" font-family="sans-serif" font-weight="bold" font-size="18" fill="%230369a1" text-anchor="middle">Polite Food Ordering</text></svg>`,
      },
      {
        panelNumber: 4,
        sceneDescription: 'Mrs. Ani hands over the freshly prepared meal with a warm smile.',
        visualSceneType: 'canteen',
        speaker: 'Mrs. Ani',
        speakerRole: 'teacher',
        dialogueEn: 'Here you are, Rian! Enjoy your lunch. Speak English with courage!',
        dialogueId: 'Ini dia, Rian! Selamat menikmati makan siang. Berbicaralah bahasa Inggris dengan berani!',
        caption: 'Panel 4: Delicious and confident!',
        keywords: ['Enjoy', 'Courage'],
        imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="%23f0fdf4"/><rect y="240" width="100%" height="120" fill="%23ffffff"/><circle cx="320" cy="130" r="50" fill="%2310b981"/><circle cx="320" cy="130" r="30" fill="%23dcfce7"/><text x="320" y="295" font-family="sans-serif" font-weight="bold" font-size="18" fill="%23166534" text-anchor="middle">Confidence &amp; Courage!</text></svg>`,
      },
    ],
    learningPoints: [
      'Gunakan ungkapan sopan "May I have..." untuk memesan makanan dalam Bahasa Inggris.',
      'Kosakata kantin: Canteen (kantin), Fried noodles (mie goreng), Iced tea (es teh).',
      'Mengucapkan kata "Please" di akhir kalimat menunjukkan kesantunan berbicara.',
    ],
    createdAt: new Date().toISOString(),
  });

  // Video Animation State (Gemini Omni 1.1 Flash via Interactions API)
  const [videoSourceImage, setVideoSourceImage] = useState<string>('');
  const [videoImageName, setVideoImageName] = useState<string>('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoDuration, setVideoDuration] = useState<'5s' | '10s'>('5s');
  const [videoMotionPrompt, setVideoMotionPrompt] = useState<string>(
    'Animate this character smiling gently, blinking, and waving hand with cheerful classroom gestures.'
  );
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgressStep, setVideoProgressStep] = useState<string>('');
  const [currentGeneratedVideo, setCurrentGeneratedVideo] = useState<string | null>(null);
  const [videoHistory, setVideoHistory] = useState<AnimatedVideoItem[]>([]);
  const [videoError, setVideoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Generate Comic Handler
  const handleGenerateComic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const result = await api.generateComic({
        topic: topic.trim(),
        style,
        grade,
        panelsCount,
        characters: characters.trim(),
      });
      if (result && result.panels) {
        setComicData(result);
      }
    } catch (err) {
      console.error('Failed to generate comic:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-generate visual for a single panel using Gemini image generation
  const handleRegeneratePanelVisual = async (panelIdx: number) => {
    const targetPanel = comicData.panels[panelIdx];
    if (!targetPanel) return;

    setRegeneratingPanelIdx(panelIdx);
    try {
      const res = await api.generatePanelImage({
        prompt: `${targetPanel.sceneDescription}. Character: ${targetPanel.speaker}. Atmosphere: ${targetPanel.visualSceneType}.`,
        style: comicData.style,
        aspectRatio: '16:9',
      });

      if (res && res.imageUrl) {
        const updatedPanels = [...comicData.panels];
        updatedPanels[panelIdx] = {
          ...targetPanel,
          imageUrl: res.imageUrl,
        };
        setComicData({ ...comicData, panels: updatedPanels });
      }
    } catch (err) {
      console.error('Error generating panel visual:', err);
    } finally {
      setRegeneratingPanelIdx(null);
    }
  };

  // Transfer panel image to Video Animator tab
  const handleAnimatePanelToVideo = (panel: any) => {
    if (panel.imageUrl) {
      setVideoSourceImage(panel.imageUrl);
      setVideoImageName(`Panel ${panel.panelNumber} - ${panel.speaker}`);
      setVideoMotionPrompt(
        `Animate ${panel.speaker} speaking dialogue: "${panel.dialogueEn}". Scene: ${panel.sceneDescription}.`
      );
    }
    setActiveTab('video');
  };

  // File Upload Handler (User uploads custom photo/illustration)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setVideoError('Harap pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    setVideoError(null);
    setVideoImageName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setVideoSourceImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Select Sample Photo
  const handleSelectSamplePhoto = async (sample: typeof SAMPLE_PHOTOS[0]) => {
    setVideoImageName(sample.name);
    setVideoMotionPrompt(`Animate ${sample.desc} with smooth camera panning, natural lighting, and subtle environmental motion.`);
    setVideoSourceImage(sample.url);
  };

  // Video Animation Generation Handler (Gemini Omni 1.1 Flash via Interactions API)
  const handleGenerateVideo = async () => {
    if (!videoSourceImage) {
      setVideoError('Harap unggah atau pilih foto terlebih dahulu.');
      return;
    }

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoProgressStep('1/3 Mempersiapkan frame gambar & orientasi video...');

    try {
      setTimeout(() => {
        setVideoProgressStep('2/3 Memanggil Gemini Omni 1.1 Flash via Interactions API...');
      }, 1200);

      const res = await api.animateImageToVideo({
        image: videoSourceImage,
        prompt: videoMotionPrompt.trim() || 'Animate this character with smooth natural motion and lively cartoon expressions.',
        aspectRatio: videoAspectRatio,
        duration: videoDuration,
      });

      setVideoProgressStep('3/3 Merender dan memproses kompresi video MP4...');

      if (res && res.videoUrl) {
        setCurrentGeneratedVideo(res.videoUrl);

        const newVideoItem: AnimatedVideoItem = {
          id: `vid-${Date.now()}`,
          title: videoImageName || 'Video Animasi Edukatif',
          sourceImage: videoSourceImage,
          videoUrl: res.videoUrl,
          prompt: videoMotionPrompt,
          aspectRatio: videoAspectRatio,
          duration: videoDuration,
          modelUsed: 'gemini-omni-1.1-flash',
          createdAt: new Date().toLocaleTimeString('id-ID'),
        };

        setVideoHistory((prev) => [newVideoItem, ...prev]);
      } else {
        setVideoError('Gagal merender video. Silakan coba kembali.');
      }
    } catch (err: any) {
      console.error('Error generating video:', err);
      setVideoError('Terjadi kendala saat menghasilkan video. Pastikan format gambar sesuai.');
    } finally {
      setIsGeneratingVideo(false);
      setVideoProgressStep('');
    }
  };

  // Play dialogue pronunciation
  const handlePlayVoice = (text: string, index: number) => {
    setActiveSpeechIdx(index);
    speechService.speak(text, 0.88, () => setActiveSpeechIdx(null), 'female');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-10 -translate-y-10">
          <Palette className="w-80 h-80" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white">
            <Palette className="w-6 h-6" />
          </span>
          <span className="text-xs uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-indigo-950 font-mono shadow-xs">
            FITUR VISUAL GAMBAR &amp; VIDIO EDUKATIF
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-900/60 text-indigo-200 border border-indigo-400/40">
            Gemini Omni 1.1 Flash &bull; Interactions API
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          AI Comic &amp; Cartoon Visual Generator
        </h1>
        <p className="text-sm text-indigo-100 max-w-2xl leading-relaxed">
          Rancang <strong>Komik Strip Berwarna</strong>, <strong>Gambar Ilustrasi Edukatif</strong>, dan <strong>Animasi Video Bergerak (Animate Image into Video)</strong> dengan Gemini Omni 1.1 Flash (Rasio 16:9 &amp; 9:16).
        </p>

        {/* Tab Navigation Switcher */}
        <div className="pt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('comic')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
              activeTab === 'comic'
                ? 'bg-white text-indigo-900 shadow-md ring-2 ring-white/50'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
            }`}
          >
            <Palette className="w-4 h-4 text-pink-500" />
            <span>1. Studio Gambar Komik &amp; Kartun</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
              activeTab === 'video'
                ? 'bg-white text-indigo-900 shadow-md ring-2 ring-white/50'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
            }`}
          >
            <Film className="w-4 h-4 text-amber-300" />
            <span>2. Animate Images into Video (Gemini Omni 1.1 Flash)</span>
            <span className="text-[10px] bg-amber-400 text-indigo-950 px-1.5 py-0.2 rounded font-extrabold uppercase">
              16:9 &bull; 9:16
            </span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: STUDIO GAMBAR KOMIK & KARTUN ================= */}
      {activeTab === 'comic' && (
        <div className="space-y-6">
          {/* Generator Form */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-indigo-100 shadow-xs space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                  Rancang Cerita Komik &amp; Ilustrasi Gambar Adegan
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                Visual Gambar Lengkap Per Panel
              </span>
            </div>

            <form onSubmit={handleGenerateComic} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Visual Style Selector */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Gaya Visual Ilustrasi:</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="comic">🎨 Komik Strip Berwarna (Speech Bubbles)</option>
                    <option value="cartoon">🎬 Kartun Animasi Edukatif (Playful 2D/3D)</option>
                    <option value="manga">📖 Manga / Webtoon Style</option>
                  </select>
                </div>

                {/* Grade Selector */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tingkat Kelas SMP:</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeLevel)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="VII">Kelas VII (Fase D Awal)</option>
                    <option value="VIII">Kelas VIII (Fase D Menengah)</option>
                    <option value="IX">Kelas IX (Fase D Lanjutan)</option>
                  </select>
                </div>

                {/* Panels Count */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Jumlah Panel Adegan:</label>
                  <select
                    value={panelsCount}
                    onChange={(e) => setPanelsCount(parseInt(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={2}>2 Panel Percakapan Singkat</option>
                    <option value={4}>4 Panel Komik Strip Lengkap (Rekomendasi)</option>
                  </select>
                </div>

                {/* Characters */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nama Tokoh Karakter:</label>
                  <input
                    type="text"
                    value={characters}
                    onChange={(e) => setCharacters(e.target.value)}
                    placeholder="Contoh: Rian and Maya"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Topik / Skenario Cerita Komik:</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Buying stationery at bookstore, Meeting a tourist, etc."
                    required
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isLoading ? 'Sedang Merancang Cerita & Gambar...' : 'Hasilkan Komik & Gambar AI'}</span>
                  </button>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-gray-700">Rekomendasi Topik Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TOPICS.map((pt) => (
                    <button
                      key={pt.title}
                      type="button"
                      onClick={() => setTopic(pt.title)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        topic === pt.title
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {pt.title}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Generated Comic Strip Display */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-md space-y-6 print:shadow-none print:border-none">
            {/* Title Bar & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-gray-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-600 text-white uppercase tracking-wider font-mono">
                    {comicData.style.toUpperCase()} STRIP &bull; KELAS {comicData.grade}
                  </span>
                  <span className="text-xs text-gray-700 font-semibold">&bull; Topik: {comicData.topic}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1 font-sans">
                  {comicData.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <button
                  onClick={() => setShowIndonesian(!showIndonesian)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    showIndonesian
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{showIndonesian ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
              </div>
            </div>

            {/* Comic Strip Grid Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comicData.panels.map((panel, idx) => {
                const isSpeakingThis = activeSpeechIdx === idx;
                const isRegenerating = regeneratingPanelIdx === idx;
                return (
                  <div
                    key={panel.panelNumber}
                    className="rounded-2xl border-4 border-indigo-300 bg-gradient-to-b from-blue-50/70 via-white to-indigo-50/40 p-4 flex flex-col justify-between shadow-xs space-y-3 relative overflow-hidden"
                  >
                    {/* Panel Header Caption */}
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-black/80 text-white px-2 py-0.5 rounded font-mono shadow-xs">
                        PANEL {panel.panelNumber}
                      </span>
                      {panel.caption && (
                        <span className="text-[11px] font-serif italic text-gray-700 bg-white/80 px-2 py-0.5 rounded border border-black/10">
                          {panel.caption}
                        </span>
                      )}
                    </div>

                    {/* Illustrated Graphic Artwork for Panel */}
                    <div className="rounded-xl overflow-hidden border border-indigo-200 bg-white shadow-2xs relative group">
                      {panel.imageUrl ? (
                        <img
                          src={panel.imageUrl}
                          alt={`Panel ${panel.panelNumber}: ${panel.sceneDescription}`}
                          className="w-full h-44 object-cover object-center"
                        />
                      ) : (
                        <div className="h-44 bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-xs text-indigo-700 font-semibold p-4 text-center">
                          "{panel.sceneDescription}"
                        </div>
                      )}

                      {/* Quick Overlay Action Buttons */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={() => handleRegeneratePanelVisual(idx)}
                          disabled={isRegenerating}
                          className="px-3 py-1.5 bg-white text-indigo-800 rounded-lg text-xs font-bold shadow-md hover:bg-indigo-50 flex items-center gap-1 transition-all"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                          <span>{isRegenerating ? 'Membuat Gambar...' : 'Generate Gambar Baru'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAnimatePanelToVideo(panel)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-1 transition-all"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Animasikan ke Video</span>
                        </button>
                      </div>
                    </div>

                    {/* Scene Narrative Note */}
                    <div className="text-[11px] text-gray-700 italic bg-white/90 p-2 rounded-lg border border-indigo-100 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="line-clamp-2">"{panel.sceneDescription}"</span>
                    </div>

                    {/* Comic Speech Bubble */}
                    <div className="relative">
                      <div className="bg-white border-2 border-black rounded-2xl p-3.5 shadow-md relative z-10 space-y-1.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                            {panel.speaker[0]}
                          </span>
                          <span className="font-extrabold text-xs text-gray-900">{panel.speaker}</span>
                          <span className="text-[10px] text-gray-500">({panel.speakerRole})</span>
                        </div>

                        {/* English Dialogue */}
                        <div className="font-bold text-sm text-gray-900 font-sans leading-snug">
                          "{panel.dialogueEn}"
                        </div>

                        {/* Indonesian Translation */}
                        {showIndonesian && (
                          <div className="text-xs text-gray-600 italic border-t border-gray-100 pt-1 font-serif">
                            {panel.dialogueId}
                          </div>
                        )}

                        {/* Speech Bubble Controls */}
                        <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handlePlayVoice(panel.dialogueEn, idx)}
                            className={`inline-flex items-center gap-1 font-bold ${
                              isSpeakingThis ? 'text-pink-600 animate-pulse' : 'text-indigo-600 hover:text-indigo-800'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isSpeakingThis ? 'Sedang Bersuara...' : 'Dengar Pengucapan'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAnimatePanelToVideo(panel)}
                            className="inline-flex items-center gap-1 font-bold text-pink-600 hover:text-pink-800"
                            title="Animasikan adegan ini ke video"
                          >
                            <Film className="w-3.5 h-3.5" />
                            <span>Buat Video</span>
                          </button>
                        </div>
                      </div>
                      {/* Speech pointer tail */}
                      <div className="w-4 h-4 bg-white border-r-2 border-b-2 border-black transform rotate-45 ml-6 -mt-2 relative z-0" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Educational Takeaways & Learning Points */}
            {comicData.learningPoints && comicData.learningPoints.length > 0 && (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-950 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Poin Pembelajaran Bahasa Inggris dari Komik Ini:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-indigo-900 pl-1 leading-relaxed">
                  {comicData.learningPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: ANIMATE IMAGES INTO VIDEO (GEMINI OMNI 1.1 FLASH) ================= */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-tr from-amber-500 to-pink-500 text-white rounded-xl shadow-xs">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">
                    Animate Images into Video
                  </h2>
                  <p className="text-xs text-gray-600">
                    Unggah foto atau pilih gambar ilustrasi untuk dianimasikan menjadi video gerak dengan model <strong>gemini-omni-1.1-flash</strong>
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                Interactions API &bull; Omni Flash
              </span>
            </div>

            {/* Photo Upload & Source Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-800">
                1. Unggah Foto atau Pilih Gambar Sumber:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Card / Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] space-y-2 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs text-indigo-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-indigo-900 block">
                      Klik untuk Unggah Foto dari Perangkat
                    </span>
                    <span className="text-[11px] text-gray-500">Mendukung format PNG, JPG, JPEG, WebP</span>
                  </div>
                </div>

                {/* Preview Box of Selected Source */}
                <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50/70 flex flex-col justify-between min-h-[170px]">
                  {videoSourceImage ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                        <span className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">{videoImageName || 'Foto Terpilih'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoSourceImage('');
                            setVideoImageName('');
                          }}
                          className="text-rose-500 hover:text-rose-700 text-[11px] underline shrink-0"
                        >
                          Ganti
                        </button>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-gray-200 max-h-32 bg-black/5 flex items-center justify-center">
                        <img
                          src={videoSourceImage}
                          alt="Preview Source"
                          className="max-h-32 w-auto object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 text-gray-500">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <p className="text-xs">Belum ada foto yang dipilih. Unggah foto atau pilih salah satu contoh di bawah.</p>
                    </div>
                  )}

                  {/* Sample selection shortcuts */}
                  <div className="pt-2 border-t border-gray-200/80">
                    <span className="text-[10px] font-bold text-gray-600 block mb-1">Pilihan Cepat Contoh:</span>
                    <div className="flex flex-wrap gap-1">
                      {SAMPLE_PHOTOS.map((sample) => (
                        <button
                          key={sample.name}
                          type="button"
                          onClick={() => handleSelectSamplePhoto(sample)}
                          className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-semibold text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                        >
                          {sample.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Configuration: Aspect Ratio & Duration */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-800">
                2. Pilih Rasio Aspek Video (Aspect Ratio):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* 16:9 Landscape Card */}
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('16:9')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                    videoAspectRatio === '16:9'
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-600'
                      : 'border-gray-200 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${videoAspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-gray-900">16:9 (Landscape)</span>
                      {videoAspectRatio === '16:9' && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      Format Layar Lebar standar untuk YouTube, proyektor kelas, presentasi modul guru, dan laptop.
                    </p>
                  </div>
                </button>

                {/* 9:16 Portrait Card */}
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('9:16')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                    videoAspectRatio === '9:16'
                      ? 'border-pink-600 bg-pink-50/60 shadow-xs ring-1 ring-pink-600'
                      : 'border-gray-200 bg-white hover:border-pink-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${videoAspectRatio === '9:16' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-gray-900">9:16 (Portrait)</span>
                      {videoAspectRatio === '9:16' && <Check className="w-4 h-4 text-pink-600" />}
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      Format Vertikal ramah smartphone untuk YouTube Shorts, Instagram Reels, dan materi belajar mobile.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Motion Prompt & Duration */}
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800">
                  3. Instruksi Animasi Gerakan (Motion Prompt):
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-semibold text-[11px]">Durasi:</span>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value as any)}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-900"
                  >
                    <option value="5s">5 Detik</option>
                    <option value="10s">10 Detik</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={3}
                value={videoMotionPrompt}
                onChange={(e) => setVideoMotionPrompt(e.target.value)}
                placeholder="Contoh: Animasikan karakter tersenyum, melambaikan tangan dengan riang, daun berguguran lembut di latar belakang..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />

              {/* Preset Motion Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-bold text-gray-600 mr-1">Preset Gerakan:</span>
                {MOTION_PRESETS.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setVideoMotionPrompt(m.prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-gray-700 transition-colors font-medium"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {videoError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{videoError}</span>
              </div>
            )}

            {/* Progress Status During Generation */}
            {isGeneratingVideo && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span>Gemini Omni 1.1 Flash sedang merender video animasi...</span>
                  </span>
                  <span className="text-indigo-600 font-mono text-[11px]">{videoAspectRatio}</span>
                </div>
                <div className="w-full bg-indigo-200/70 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
                </div>
                <p className="text-[11px] text-indigo-800 font-medium">
                  {videoProgressStep}
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !videoSourceImage}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 via-pink-600 to-indigo-600 hover:from-amber-600 hover:via-pink-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                <Film className="w-4 h-4 text-amber-200" />
                <span>
                  {isGeneratingVideo ? 'Memproses Video Animasi...' : `Generate Video (${videoAspectRatio}) dengan Gemini Omni`}
                </span>
              </button>
            </div>
          </div>

          {/* Video Result Player Section */}
          {currentGeneratedVideo && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-xs">
                    <FileVideo className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Hasil Video Animasi</h3>
                    <p className="text-xs text-gray-600">
                      Rasio: <strong>{videoAspectRatio}</strong> &bull; Model: <strong>gemini-omni-1.1-flash</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={currentGeneratedVideo}
                    download={`animated-${videoAspectRatio.replace(':', '-')}-${Date.now()}.mp4`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Video MP4</span>
                  </a>
                </div>
              </div>

              {/* Video Player Display Container based on aspect ratio */}
              <div className="bg-black/95 rounded-2xl p-3 flex items-center justify-center overflow-hidden">
                <div
                  className={`relative overflow-hidden rounded-xl ${
                    videoAspectRatio === '9:16'
                      ? 'w-full max-w-xs aspect-[9/16]'
                      : 'w-full max-w-2xl aspect-video'
                  }`}
                >
                  <video
                    ref={videoPlayerRef}
                    src={currentGeneratedVideo}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Video Metadata Footer */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-gray-900">Instruksi Gerakan:</span>
                  <p className="text-gray-600 italic">"{videoMotionPrompt}"</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Siap Diputar &amp; Diunduh
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Session Video History Gallery */}
          {videoHistory.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-600" />
                  <span>Galeri Video Animasi Tersimpan ({videoHistory.length} Video)</span>
                </h3>
                <span className="text-xs text-gray-500">Sesi Belajar Aktif</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videoHistory.map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 truncate">{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-extrabold uppercase">
                        {item.aspectRatio}
                      </span>
                    </div>

                    <div className="rounded-lg overflow-hidden bg-black/90 aspect-video flex items-center justify-center">
                      <video src={item.videoUrl} controls className="w-full h-full object-contain" />
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-gray-500">{item.createdAt}</span>
                      <a
                        href={item.videoUrl}
                        download={`video-${item.id}.mp4`}
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
