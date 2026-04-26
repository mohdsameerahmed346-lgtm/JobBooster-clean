import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// ➕ CREATE CHAT
export const createChat = async (userId) => {
  const ref = await addDoc(
    collection(db, "users", userId, "chats"),
    {
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    }
  );
  return ref.id;
};

// 📥 GET CHATS
export const getChats = async (userId) => {
  const snap = await getDocs(
    collection(db, "users", userId, "chats")
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

// 💾 SAVE MESSAGES
export const saveMessages = async (userId, chatId, messages) => {
  const ref = doc(db, "users", userId, "chats", chatId);

  await updateDoc(ref, {
    messages,
  });
};

// 🧠 UPDATE TITLE
export const updateChatTitle = async (userId, chatId, title) => {
  const ref = doc(db, "users", userId, "chats", chatId);

  await updateDoc(ref, {
    title: title.slice(0, 40),
  });
};

// ❌ DELETE CHAT
export const deleteChat = async (userId, chatId) => {
  const ref = doc(db, "users", userId, "chats", chatId);
  await deleteDoc(ref);
};

// ✏️ RENAME CHAT
export const renameChat = async (userId, chatId, title) => {
  const ref = doc(db, "users", userId, "chats", chatId);

  await updateDoc(ref, {
    title: title.slice(0, 40),
  });
};
