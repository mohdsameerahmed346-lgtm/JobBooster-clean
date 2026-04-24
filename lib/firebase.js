import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLxl31rdknRCR93JhGRBDofUTwONWCiNA",
  authDomain: "joobboost-ai.firebaseapp.com",
  projectId: "joobboost-ai",
  storageBucket: "joobboost-ai.firebasestorage.app",
  messagingSenderId: "113119846173",
  appId: "1:113119846173:web:2d724c027347bcb53fcbf4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
