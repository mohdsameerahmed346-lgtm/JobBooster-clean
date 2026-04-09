// lib/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "joobboost-ai.firebaseapp.com",
  projectId: "joobboost-ai",
  storageBucket: "joobboost-ai.firebasestorage.app",
  messagingSenderId: "113119846173",
  appId: "1:113119846173:web:2d724c027347bcb53fcbf4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB
export const db = getFirestore(app);
