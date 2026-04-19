import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveHistory = async (type, input, output) => {
  const user = auth.currentUser;

  if (!user) return;

  await addDoc(collection(db, "history"), {
    userId: user.uid,
    type,
    input,
    output,
    createdAt: serverTimestamp(),
  });
};
