import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Cloud sign-in/sync is optional: until VITE_FIREBASE_* env vars are set, the app
// keeps working entirely offline against localStorage (see useSavedDocuments).
export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = firebaseEnabled ? (getApps()[0] ?? initializeApp(firebaseConfig)) : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
