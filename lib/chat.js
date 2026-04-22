import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// 🔥 CREATE NEW CHAT
export async function createChat() {
  const user = auth.currentUser;
  if (!user) return;

  const ref = await addDoc(
    collection(db, "users", user.uid, "chats"),
    {
      title: "New Chat",
      messages: [],
      createdAt: serverTimestamp(),
    }
  );

  return ref.id;
}

// 📥 GET ALL CHATS
export async function getChats() {
  const user = auth.currentUser;
  if (!user) return [];

  const snap = await getDocs(
    collection(db, "users", user.uid, "chats")
  );

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// 📄 GET SINGLE CHAT
export async function getChat(chatId) {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid, "chats", chatId);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
}

// 💾 SAVE MESSAGE
export async function saveMessage(chatId, messages) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "chats", chatId);

  await updateDoc(ref, {
    messages,
  });
}

// ✏️ RENAME CHAT
export async function renameChat(chatId, title) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "chats", chatId);

  await updateDoc(ref, { title });
}

// 🗑 DELETE CHAT
export async function deleteChat(chatId) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "chats", chatId);

  await deleteDoc(ref);
}
