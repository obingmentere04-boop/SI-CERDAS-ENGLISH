import React, { useState, useEffect } from 'react';
import { AppDatabase } from '../../types';
import { 
  ShieldCheck, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  Lock, 
  Cloud, 
  ExternalLink, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { firebaseSync } from '../../services/firebaseSync';

interface AdminViewProps {
  database: AppDatabase;
  hasGeminiKey: boolean;
  onResetDemo: () => void;
  onOpenFirebaseModal: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  database,
  hasGeminiKey,
  onResetDemo,
  onOpenFirebaseModal,
}) => {
  const [isFirebaseOnline, setIsFirebaseOnline] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const projectId = firebaseSync.getProjectId();
  const databaseId = firebaseSync.getDatabaseId();

  useEffect(() => {
    firebaseSync.testOnline().then((online) => {
      setIsFirebaseOnline(online);
    }).catch(() => {
      setIsFirebaseOnline(false);
    });
  }, []);

  const handleQuickSync = async () => {
    setIsSyncing(true);
    setSyncFeedback('Menyinkronkan data ke Cloud Firestore...');
    try {
      const res = await firebaseSync.pushToFirestore(database);
      setSyncFeedback(res.message);
      setIsFirebaseOnline(true);
    } catch (err: any) {
      setSyncFeedback(`Gagal: ${err?.message || 'Periksa koneksi'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(database, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `si_cerdas_english_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/databases/${databaseId}/data`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Panel Administrator Sistem</h1>
              <p className="text-xs text-gray-700">
                Pusat Diagnostik SI CERDAS ENGLISH &bull; Keamanan Data &amp; Integrasi Eksternal
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFirebaseModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl text-xs font-bold hover:from-orange-700 hover:to-amber-700 shadow-xs transition-colors"
          >
            <Cloud className="w-4 h-4" />
            <span>Kelola Firebase</span>
          </button>
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Cadangkan JSON</span>
          </button>
        </div>
      </div>

      {/* Firebase Cloud Console Integration Card */}
      <div className="bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 rounded-2xl p-6 border border-orange-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Integrasi Firebase Console &amp; Cloud Firestore</h2>
              <p className="text-xs text-gray-700">Penyimpanan cloud terdistribusi dengan aturan keamanan ABAC Zero-Trust</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
            isFirebaseOnline 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isFirebaseOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isFirebaseOnline ? 'Tersambung ke Cloud Firestore' : 'Menghubungkan ke Cloud...'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white/80 p-3.5 rounded-xl border border-orange-100 space-y-1.5">
            <div className="text-gray-700">Project ID di Firebase Console:</div>
            <div className="font-mono font-bold text-orange-950 text-sm bg-orange-50/80 px-2 py-1 rounded border border-orange-200">
              {projectId}
            </div>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-orange-100 space-y-1.5">
            <div className="text-gray-700">Firestore Database ID:</div>
            <div className="font-mono text-gray-800 text-[11px] truncate bg-gray-50 px-2 py-1 rounded border border-gray-200" title={databaseId}>
              {databaseId}
            </div>
          </div>
        </div>

        {syncFeedback && (
          <div className="p-3 bg-white border border-orange-200 rounded-xl text-xs text-orange-900 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleQuickSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Singkronkan Data Sekarang'}</span>
          </button>
          
          <button
            onClick={onOpenFirebaseModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-300 hover:bg-orange-50 text-orange-900 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>Buka Dialog Sinkronisasi Lengkap</span>
          </button>

          <a
            href={firebaseConsoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-orange-700 hover:text-orange-900 hover:underline ml-auto"
          >
            <span>Buka di Firebase Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Security & Student Data Protection Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-900">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Kepatuhan Perlindungan Privasi Data Siswa SMP:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-emerald-900 leading-relaxed">
          <li>Pengumpulan data pribadi diminimalkan (hanya nama panggilan, kelas, dan catatan capaian belajar).</li>
          <li>Data suara mikrofon diproses secara lokal di browser dan tidak disimpan sembarangan tanpa izin.</li>
          <li>Kunci API Google Gemini tersimpan di sisi server (Express) dan tidak pernah diekspos ke frontend.</li>
          <li>Penyimpanan data server disimpan di <code>data/db.json</code> dan tersinkronisasi ke Cloud Firestore.</li>
        </ul>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gemini AI Integration Status */}
        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Status Gemini AI Generatif</h3>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                hasGeminiKey
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {hasGeminiKey ? 'Terkoneksi' : 'Fallback Edukatif Aktif'}
            </span>
          </div>

          <div className="text-xs text-gray-700 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div>Model: <strong>gemini-3.8-flash &amp; gemini-omni-1.1-flash</strong></div>
            <div>Endpoint Server: <code>/api/gemini/*</code></div>
            <div>Fitur Terhubung: Speaking Partner, Cartoon Animation, Comic Generator, Lesson Planner, Vocab Generator</div>
          </div>
        </div>

        {/* Database Persistence Status */}
        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Status Database Server</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Aktif &bull; data/db.json
            </span>
          </div>

          <div className="text-xs text-gray-700 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div>Total Modul: <strong>{database.modules.length}</strong></div>
            <div>Total Kosakata: <strong>{database.vocabulary.length}</strong></div>
            <div>Total Siswa: <strong>{database.students.length}</strong></div>
            <div>Tugas Menulis: <strong>{database.writingSubmissions.length}</strong></div>
            <div>Percobaan Kuis: <strong>{database.quizAttempts.length}</strong></div>
          </div>
        </div>
      </div>

      {/* Reset & Maintenance */}
      <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Pemulihan Data Demonstrasi Awal</h3>
          <p className="text-xs text-gray-700">
            Mengembalikan seluruh data kelas, modul, kuis, dan kosakata ke konfigurasi standar demonstrasi.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset basis data ke data awal?')) {
              onResetDemo();
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset ke Data Awal</span>
        </button>
      </div>
    </div>
  );
};
