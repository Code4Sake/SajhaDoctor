import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDf-0ECPx3spJ2uqRNLpjR3Pox7FKZPc50",
  authDomain: "sajhadoctor.firebaseapp.com",
  projectId: "sajhadoctor",
  storageBucket: "sajhadoctor.firebasestorage.app",
  messagingSenderId: "550066506717",
  appId: "1:550066506717:web:bfb17a1be91ef7dd8e0434",
  measurementId: "G-JR219LWB6J"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
