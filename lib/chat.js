import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
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

// 📥 GET ALL CHATS
export const getChats = async (userId) => {
  const snap = await getDocs(
    collection(db, "users", userId, "chats")
  );

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 📄 GET SINGLE CHAT ✅ (FIX)
export const getChat = async (userId, chatId) => {
  const ref = doc(db, "users", userId, "chats", chatId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
};

// 💾 SAVE MESSAGES (FULL ARRAY)
export const saveMessages = async (userId, chatId, messages) => {
  const ref = doc(db, "users", userId, "chats", chatId);

  await updateDoc(ref, {
    messages,
  });
};

// 💬 SAVE SINGLE MESSAGE ✅ (FIX)
export const saveMessage = async (userId, chatId, message) => {
  const chat = await getChat(userId, chatId);

  if (!chat) return;

  const updated = [...(chat.messages || []), message];

  await saveMessages(userId, chatId, updated);
};
