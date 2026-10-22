import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass databaseId from firebaseConfig
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Validate Connection to Firestore on startup
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Any other error (like document not found) still proves connection reached server
    return true;
  }
}

// Initial test trigger
testConnection().catch((err) => {
  console.warn('Initial Firebase ping:', err);
});

export { firebaseConfig, signInWithPopup, signOut };
