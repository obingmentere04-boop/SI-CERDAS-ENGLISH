import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  User, 
  LogIn, 
  LogOut, 
  X, 
  ShieldCheck, 
  Database,
  Layers
} from 'lucide-react';
import { firebaseSync } from '../../services/firebaseSync';
import { auth } from '../../lib/firebase';
import { AppDatabase } from '../../types';

interface FirebaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: AppDatabase;
  onDatabaseUpdate: (newDb: AppDatabase) => void;
}

export const FirebaseSyncModal: React.FC<FirebaseSyncModalProps> = ({
  isOpen,
  onClose,
  database,
  onDatabaseUpdate,
}) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => {
    return localStorage.getItem('last_firebase_sync_time');
  });

  const projectId = firebaseSync.getProjectId();
  const databaseId = firebaseSync.getDatabaseId();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Test Firestore connection
    firebaseSync.testOnline().then((online) => {
      setIsOnline(online);
    }).catch(() => {
      setIsOnline(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignInGoogle = async () => {
    try {
      setSyncStatusMsg('Membuka autentikasi Google...');
      const user = await firebaseSync.signInWithGoogle();
      setCurrentUser(user);
      setSyncStatusMsg(`Berhasil login sebagai ${user.displayName || user.email}`);
    } catch (err: any) {
      setSyncStatusMsg(`Gagal login: ${err?.message || 'Akses dibatalkan'}`);
    }
  };

  const handleSignOutGoogle = async () => {
    try {
      await firebaseSync.signOut();
      setCurrentUser(null);
      setSyncStatusMsg('Berhasil logout dari akun Google Firebase');
    } catch (err: any) {
      setSyncStatusMsg(`Gagal logout: ${err?.message}`);
    }
  };

  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Menyinkronkan data ke Cloud Firestore...');
    try {
      const res = await firebaseSync.pushToFirestore(database);
      setSyncStatusMsg(res.message);
      setLastSyncedTime(new Date().toLocaleTimeString('id-ID'));
      localStorage.setItem('last_firebase_sync_time', new Date().toLocaleTimeString('id-ID'));
    } catch (err: any) {
      setSyncStatusMsg(`Gagal menyinkronkan: ${err?.message || 'Periksa koneksi internet'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromFirestore = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Mengambil data terbaru dari Cloud Firestore...');
    try {
      const pulledDb = await firebaseSync.pullFromFirestore();
      if (pulledDb) {
        onDatabaseUpdate(pulledDb);
        setSyncStatusMsg('Data berhasil ditarik dan diperbarui dari Firebase!');
      } else {
        setSyncStatusMsg('Belum ada snapshot data di Firestore. Lakukan singkronisasi terlebih dahulu.');
      }
    } catch (err: any) {
      setSyncStatusMsg(`Gagal menarik data: ${err?.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/databases/${databaseId}/data`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-indigo-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Sinkronisasi Firebase Console</h2>
              <p className="text-xs text-orange-100">Google Cloud Firestore &amp; Firebase Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Box */}
          <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-orange-600" />
                Informasi Proyek Firebase
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isOnline 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {isOnline ? 'Firestore Online & Terkoneksi' : 'Memeriksa Koneksi...'}
              </span>
            </div>

            <div className="text-xs font-mono bg-white/80 p-2.5 rounded-xl border border-orange-200 text-gray-700 space-y-1">
              <div>Project ID: <strong className="text-orange-900">{projectId}</strong></div>
              <div>Database ID: <strong className="text-gray-900">{databaseId}</strong></div>
              {lastSyncedTime && (
                <div className="text-emerald-700">Terakhir disinkronkan: <strong>{lastSyncedTime}</strong></div>
              )}
            </div>
          </div>

          {/* User Account Session */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || ''} 
                  className="w-10 h-10 rounded-full border-2 border-indigo-300" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-gray-900">
                  {currentUser ? currentUser.displayName || 'Akun Firebase' : 'Belum Login Akun Google'}
                </div>
                <div className="text-[11px] text-gray-700">
                  {currentUser ? currentUser.email : 'Login untuk mengamankan data dengan akun Anda'}
                </div>
              </div>
            </div>

            {currentUser ? (
              <button
                onClick={handleSignOutGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={handleSignInGoogle}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk dengan Google</span>
              </button>
            )}
          </div>

          {/* Status Message */}
          {syncStatusMsg && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleSyncToFirestore}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Singkronkan ke Firebase</span>
            </button>

            <button
              onClick={handlePullFromFirestore}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Tarik dari Firebase</span>
            </button>
          </div>

          {/* Direct Firebase Console Link */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-700">Buka database di browser:</span>
            <a
              href={consoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold hover:underline"
            >
              <span>Buka Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
