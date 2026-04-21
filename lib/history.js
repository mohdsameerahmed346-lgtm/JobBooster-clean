import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/* ================= SAVE HISTORY ================= */
export const saveHistory = async (type, input, output) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "history"), {
      uid: user.uid,
      type, // "analyze" | "interview" | "skill" | "job"
      input,
      output,
      createdAt: Date.now(),
    });
  } catch (err) {
    console.error("Error saving history:", err);
  }
};

/* ================= GET USER HISTORY ================= */
export const getHistory = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const q = query(
      collection(db, "history"),
      where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Error fetching history:", err);
    return [];
  }
};

/* ================= FEATURE STATS ================= */
export const getStats = async () => {
  const data = await getHistory();

  const stats = {
    analyze: 0,
    interview: 0,
    skill: 0,
    job: 0,
  };

  data.forEach((item) => {
    if (item.type === "analyze") stats.analyze++;
    if (item.type === "interview") stats.interview++;
    if (item.type === "skill") stats.skill++;
    if (item.type === "job") stats.job++;
  });

  return stats;
};

/* ================= WEEKLY ANALYTICS ================= */
export const getWeeklyAnalytics = async () => {
  const data = await getHistory();

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  let thisWeek = 0;
  let lastWeek = 0;

  data.forEach((item) => {
    const diff = now - item.createdAt;

    if (diff <= 7 * oneDay) {
      thisWeek++;
    } else if (diff <= 14 * oneDay) {
      lastWeek++;
    }
  });

  // ✅ Growth %
  let growth = 0;
  if (lastWeek > 0) {
    growth = ((thisWeek - lastWeek) / lastWeek) * 100;
  }

  return {
    thisWeek,
    lastWeek,
    growth: Math.round(growth),
  };
};

/* ================= STREAK SYSTEM ================= */
export const getStreak = async () => {
  const data = await getHistory();

  const daysUsed = new Set();

  data.forEach((item) => {
    const day = new Date(item.createdAt).toDateString();
    daysUsed.add(day);
  });

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dayStr = currentDate.toDateString();

    if (daysUsed.has(dayStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
