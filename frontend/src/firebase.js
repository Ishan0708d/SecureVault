import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAm4lG3yAEBqyvNq29UptIWfkAa4Sb5AVM",
  authDomain: "vault-9864d.firebaseapp.com",
  projectId: "vault-9864d",
  storageBucket: "vault-9864d.firebasestorage.app",
  messagingSenderId: "897822179380",
  appId: "1:897822179380:web:5a1297dee14667f2410a61",
  measurementId: "G-DEMSCM59CN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);