import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const saveAnalysis = async (userId, data) => {
  if (!userId) return;

  try {
    await addDoc(
      collection(db, "users", userId, "analyses"),
      {
        ...data,
        createdAt: Date.now(),
      }
    );
  } catch (err) {
    console.error("Save analysis error:", err);
  }
};
