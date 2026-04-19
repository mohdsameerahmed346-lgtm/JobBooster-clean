import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    const { userId, type, content } = body;

    await addDoc(collection(db, "history"), {
      userId,
      type,
      content,
      createdAt: serverTimestamp(),
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message });
  }
}
