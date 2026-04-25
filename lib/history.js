import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

// ✅ SAVE HISTORY
export const saveHistory = async (userId, type, input, result) => {
  if (!userId) return;

  try {
    await addDoc(
      collection(db, "users", userId, "history"),
      {
        type,
        input,
        result,
        createdAt: Date.now(),
      }
    );
  } catch (err) {
    console.error("Save history error:", err);
  }
};

// ✅ GET HISTORY
export const getHistory = async (userId) => {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, "users", userId, "history"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Get history error:", err);
    return [];
  }
};
