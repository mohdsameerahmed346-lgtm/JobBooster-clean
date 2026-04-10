"use client";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLxl31rdknRCR93JhGRBDofUTwONWCiNA",
  authDomain: "joobboost-ai.firebaseapp.com",
  projectId: "joobboost-ai",
  storageBucket: "joobboost-ai.appspot.com",
  messagingSenderId: "113119846173",
  appId: "1:113119846173:web:2d724c027347bcb53fcbf4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 🔥 FIX: WAIT for persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set");
  })
  .catch((err) => {
    console.error("Persistence error:", err);
  });

export const provider = new GoogleAuthProvider();
