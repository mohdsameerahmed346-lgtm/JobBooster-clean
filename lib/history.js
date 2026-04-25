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

// ✅ DASHBOARD STATS
export const getStats = async (userId) => {
  const data = await getHistory(userId);

  return {
    total: data.length,
  };
};

// ✅ WEEKLY (SAFE DUMMY)
export const getWeeklyAnalytics = async () => {
  return [
    { day: "Mon", value: 2 },
    { day: "Tue", value: 4 },
    { day: "Wed", value: 1 },
    { day: "Thu", value: 3 },
    { day: "Fri", value: 5 },
  ];
};

// ✅ STREAK (SAFE DUMMY)
export const getStreak = async () => {
  return 3;
};
