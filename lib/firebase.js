import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLxl31rdknRCR93JhGRBDofUTwONWCiNA",
  authDomain: "joobboost-ai.firebaseapp.com",
  projectId: "joobboost-ai",
  storageBucket: "joobboost-ai.firebasestorage.app",
  messagingSenderId: "113119846173",
  appId: "1:113119846173:web:2d724c027347bcb53fcbf4",
  measurementId: "G-VGGWSB3MFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  authDomain: "joobboost-ai.firebaseapp.com",
  projectId: "joobboost-ai",
  storageBucket: "joobboost-ai.appspot.com",
  messagingSenderId: "113119846173",
  appId: "PASTE_NEW_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
