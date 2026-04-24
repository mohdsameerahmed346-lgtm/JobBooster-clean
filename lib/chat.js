import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

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

export const getChats = async (userId) => {
  const snap = await getDocs(
    collection(db, "users", userId, "chats")
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const saveMessages = async (userId, chatId, messages) => {
  const ref = doc(db, "users", userId, "chats", chatId);
  await updateDoc(ref, { messages });
};
