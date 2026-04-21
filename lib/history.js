import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth } from "./firebase";

// ✅ SAVE HISTORY
export const saveHistory = async (type, input, output) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "history"), {
    uid: user.uid,
    type,
    input,
    output,
    createdAt: Date.now(),
  });
};

// ✅ GET USER HISTORY
export const getHistory = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "history"),
    where("uid", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data());
};

// ✅ GET STATS (🔥 NEW)
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
