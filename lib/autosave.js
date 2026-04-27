import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// 💾 SAVE FULL STATE
export async function saveResumeState(userId, data) {
  try {
    await setDoc(doc(db, "resumes", userId), {
      ...data,
      updatedAt: Date.now(),
    });
  } catch (e) {
    console.error("Autosave error:", e);
  }
}
