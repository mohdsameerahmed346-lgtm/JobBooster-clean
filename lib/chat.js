import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// ➕ CREATE CHAT
export const createChat = async (userId) => {
  const ref = await addDoc(
    collection(db, "users", userId, "chats"),
    {
      title: "New Chat",
      createdAt: Date.now(),
      messages: [],
    }
  );

  return ref.id;
};

// 📥 GET CHATS
export const getChats = async (userId) => {
  const snap = await getDocs(
    collection(db, "users", userId, "chats")
  );

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 💾 SAVE MESSAGE
export const saveMessages = async (userId, chatId, messages) => {
  const ref = doc(db, "users", userId, "chats", chatId);
  await updateDoc(ref, { messages });
};
