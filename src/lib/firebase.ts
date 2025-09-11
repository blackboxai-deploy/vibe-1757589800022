import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { FirebaseConfig } from '@/types';

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Check if we're already connected to emulators
  if (!auth.app.options?.projectId?.includes('demo-')) {
    try {
      // Only connect if not already connected
      if (window.location.hostname === 'localhost') {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectDatabaseEmulator(database, 'localhost', 9000);
        connectStorageEmulator(storage, 'localhost', 9199);
      }
    } catch (error) {
      // Emulators already connected or not available
      console.log('Firebase emulators connection skipped:', error);
    }
  }
}

export default app;

// Firebase helper functions
export const createUserProfile = async (uid: string, userData: any) => {
  const { ref, set } = await import('firebase/database');
  const userRef = ref(database, `users/${uid}`);
  
  const userProfile = {
    ...userData,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      theme: 'system',
      language: 'en',
      notifications: true,
      soundEffects: true,
      preferredSubjects: []
    }
  };
  
  await set(userRef, userProfile);
  return userProfile;
};

export const updateUserProfile = async (uid: string, updates: any) => {
  const { ref, update } = await import('firebase/database');
  const userRef = ref(database, `users/${uid}`);
  
  await update(userRef, {
    ...updates,
    lastUpdated: new Date().toISOString()
  });
};

export const getUserProfile = async (uid: string) => {
  const { ref, get } = await import('firebase/database');
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);
  
  return snapshot.exists() ? snapshot.val() : null;
};

export const saveTestAttempt = async (attempt: any) => {
  const { ref, push } = await import('firebase/database');
  const attemptsRef = ref(database, `testAttempts/${attempt.userId}`);
  
  const attemptData = {
    ...attempt,
    createdAt: new Date().toISOString()
  };
  
  const newAttemptRef = await push(attemptsRef, attemptData);
  return newAttemptRef.key;
};

export const updateTestAttempt = async (userId: string, attemptId: string, updates: any) => {
  const { ref, update } = await import('firebase/database');
  const attemptRef = ref(database, `testAttempts/${userId}/${attemptId}`);
  
  await update(attemptRef, {
    ...updates,
    lastUpdated: new Date().toISOString()
  });
};

export const getUserTestAttempts = async (userId: string, limit?: number) => {
  const { ref, query, orderByKey, limitToLast, get } = await import('firebase/database');
  const attemptsRef = ref(database, `testAttempts/${userId}`);
  
  let attemptsQuery = query(attemptsRef, orderByKey());
  if (limit) {
    attemptsQuery = query(attemptsRef, orderByKey(), limitToLast(limit));
  }
  
  const snapshot = await get(attemptsQuery);
  
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([key, value]) => ({
      id: key,
      ...value as any
    }));
  }
  
  return [];
};

export const saveTest = async (test: any) => {
  const { ref, push } = await import('firebase/database');
  const testsRef = ref(database, 'tests');
  
  const testData = {
    ...test,
    createdAt: new Date().toISOString()
  };
  
  const newTestRef = await push(testsRef, testData);
  return newTestRef.key;
};

export const getTest = async (testId: string) => {
  const { ref, get } = await import('firebase/database');
  const testRef = ref(database, `tests/${testId}`);
  const snapshot = await get(testRef);
  
  return snapshot.exists() ? { id: testId, ...snapshot.val() } : null;
};

export const getPublicTests = async (subject?: string, limit?: number) => {
  const { ref, query, orderByChild, equalTo, limitToLast, get } = await import('firebase/database');
  const testsRef = ref(database, 'tests');
  
  let testsQuery = query(testsRef, orderByChild('isPublic'), equalTo(true));
  
  if (limit) {
    testsQuery = query(testsRef, orderByChild('isPublic'), equalTo(true), limitToLast(limit));
  }
  
  const snapshot = await get(testsQuery);
  
  if (snapshot.exists()) {
    let tests = Object.entries(snapshot.val()).map(([key, value]) => ({
      id: key,
      ...value as any
    }));
    
    if (subject) {
      tests = tests.filter(test => test.subject === subject);
    }
    
    return tests;
  }
  
  return [];
};

export const saveFlashcardDeck = async (deck: any) => {
  const { ref, push } = await import('firebase/database');
  const decksRef = ref(database, `flashcardDecks/${deck.createdBy}`);
  
  const deckData = {
    ...deck,
    createdAt: new Date().toISOString()
  };
  
  const newDeckRef = await push(decksRef, deckData);
  return newDeckRef.key;
};

export const saveFlashcards = async (userId: string, cards: any[]) => {
  const { ref, push } = await import('firebase/database');
  const cardsRef = ref(database, `flashcards/${userId}`);
  
  const promises = cards.map(async (card) => {
    const cardData = {
      ...card,
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      confidence: 3
    };
    
    const newCardRef = await push(cardsRef, cardData);
    return { id: newCardRef.key, ...cardData };
  });
  
  return Promise.all(promises);
};

export const saveMindMap = async (mindMap: any) => {
  const { ref, push } = await import('firebase/database');
  const mindMapsRef = ref(database, `mindMaps/${mindMap.createdBy}`);
  
  const mindMapData = {
    ...mindMap,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  const newMindMapRef = await push(mindMapsRef, mindMapData);
  return newMindMapRef.key;
};

export const updateUserAnalytics = async (userId: string, analyticsData: any) => {
  const { ref, update } = await import('firebase/database');
  const analyticsRef = ref(database, `analytics/${userId}`);
  
  await update(analyticsRef, {
    ...analyticsData,
    lastUpdated: new Date().toISOString()
  });
};

export const getUserAnalytics = async (userId: string) => {
  const { ref, get } = await import('firebase/database');
  const analyticsRef = ref(database, `analytics/${userId}`);
  const snapshot = await get(analyticsRef);
  
  return snapshot.exists() ? snapshot.val() : null;
};