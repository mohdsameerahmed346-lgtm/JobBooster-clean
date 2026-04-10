"use client"; // 🔥 VERY IMPORTANT

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

// 🔥 FORCE CLIENT-SIDE AUTH
export const auth =
  typeof window !== "undefined" ? getAuth(app) : null;

// 🔥 PERSIST LOGIN
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence);
}

export const provider = new GoogleAuthProvider();
