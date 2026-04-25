import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

// 📊 TOTAL STATS
export const getStats = async (userId) => {
  const snap = await getDocs(
    collection(db, "users", userId, "chats")
  );

  let totalChats = snap.size;
  let totalMessages = 0;

  snap.docs.forEach((doc) => {
    const data = doc.data();
    totalMessages += data.messages?.length || 0;
  });

  return {
    totalChats,
    totalMessages,
  };
};

// 📅 WEEKLY ANALYTICS (BASIC VERSION)
export const getWeeklyAnalytics = async () => {
  return [
    { day: "Mon", value: 2 },
    { day: "Tue", value: 4 },
    { day: "Wed", value: 1 },
    { day: "Thu", value: 5 },
    { day: "Fri", value: 3 },
  ];
};

// 🔥 STREAK (DUMMY SAFE VERSION)
export const getStreak = async () => {
  return 3;
};
