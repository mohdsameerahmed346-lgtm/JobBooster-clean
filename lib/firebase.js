import { initializeApp } from "firebase/app";

// ✅ FORCE BROWSER VERSION
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
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

// 🔥 CRITICAL
setPersistence(auth, browserLocalPersistence);

export const provider = new GoogleAuthProvider();
