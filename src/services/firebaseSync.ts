import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, googleProvider, signInWithPopup, signOut, testConnection, firebaseConfig } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { AppDatabase, ComicStory, AnimatedVideoItem } from '../types';

export interface FirebaseSyncStatus {
  isConnected: boolean;
  projectId: string;
  databaseId: string;
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  lastSyncedAt: string | null;
  syncInProgress: boolean;
  error: string | null;
}

export const firebaseSync = {
  getProjectId() {
    return firebaseConfig.projectId;
  },

  getDatabaseId() {
    return firebaseConfig.firestoreDatabaseId;
  },

  async testOnline(): Promise<boolean> {
    return await testConnection();
  },

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Firebase Auth sign in failed:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase Auth sign out failed:', error);
      throw error;
    }
  },

  /**
   * Push current database state to Firestore
   */
  async pushToFirestore(currentDb: AppDatabase): Promise<{ success: boolean; message: string; timestamp: string }> {
    const user = auth.currentUser;
    const timestampStr = new Date().toISOString();

    const path = 'syncState';
    try {
      // 1. Sync metadata document
      const syncDocRef = doc(db, 'syncState', 'latest');
      await setDoc(syncDocRef, {
        id: 'latest',
        version: Date.now(),
        updatedAt: timestampStr,
        updatedBy: user ? user.uid : 'system',
        studentsCount: currentDb.students.length,
        classesCount: currentDb.classes.length,
        modulesCount: currentDb.modules.length,
        quizzesCount: currentDb.quizzes.length,
        vocabCount: currentDb.vocabulary.length,
        // serialize database snapshot
        snapshot: JSON.stringify(currentDb),
      }, { merge: true });

      // 2. If user is signed in, sync user profile
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          id: user.uid,
          name: user.displayName || 'Pengguna Si Cerdas',
          email: user.email || '',
          role: currentDb.teacher.email === user.email ? 'guru' : 'admin',
          grade: 'VII',
          className: 'VII-A',
          points: 100,
          streakDays: 1,
          avatarUrl: user.photoURL || '',
          updatedAt: timestampStr,
        }, { merge: true });
      }

      return {
        success: true,
        message: `Berhasil disinkronkan ke Firebase Console (${firebaseConfig.projectId})`,
        timestamp: timestampStr,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },

  /**
   * Pull database state from Firestore if available
   */
  async pullFromFirestore(): Promise<AppDatabase | null> {
    const path = 'syncState';
    try {
      const syncDocRef = doc(db, 'syncState', 'latest');
      const snap = await getDoc(syncDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.snapshot) {
          return JSON.parse(data.snapshot) as AppDatabase;
        }
      }
      return null;
    } catch (error) {
      // If permission or offline, warn without breaking
      console.warn('Could not pull from Firestore syncState:', error);
      return null;
    }
  },

  /**
   * Save a generated comic to Firestore
   */
  async saveComic(comic: ComicStory): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const path = `comics/${comic.id}`;
    try {
      const comicRef = doc(db, 'comics', comic.id);
      await setDoc(comicRef, {
        id: comic.id,
        userId: user.uid,
        title: comic.title,
        topic: comic.topic,
        style: comic.style,
        grade: comic.grade,
        panelsCount: comic.panels.length,
        createdAt: comic.createdAt,
        panels: comic.panels,
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      return false;
    }
  },

  /**
   * Save an animated cartoon video item to Firestore
   */
  async saveAnimatedVideo(video: AnimatedVideoItem): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const path = `animatedVideos/${video.id}`;
    try {
      const videoRef = doc(db, 'animatedVideos', video.id);
      await setDoc(videoRef, {
        id: video.id,
        userId: user.uid,
        title: video.title,
        prompt: video.prompt,
        aspectRatio: video.aspectRatio,
        duration: video.duration,
        modelUsed: video.modelUsed,
        createdAt: video.createdAt,
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      return false;
    }
  },
};
