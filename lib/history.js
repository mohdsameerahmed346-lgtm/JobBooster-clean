import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
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
    createdAt: new Date(),
  });
};

// ✅ GET HISTORY
export const getHistory = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "history"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
