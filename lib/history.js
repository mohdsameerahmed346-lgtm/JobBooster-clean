import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const saveHistory = async (userId, data) => {
  if (!userId) return;

  await addDoc(collection(db, "history"), {
    userId,
    data,
    createdAt: Date.now(),
  });
};

export const getHistory = async (userId) => {
  const q = query(
    collection(db, "history"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
