export const dynamic = "force-dynamic";

import { db } from "@/lib/firebaseAdmin";

// SAVE HISTORY
export async function POST(req) {
  try {
    const { type, content } = await req.json();

    await db.collection("history").add({
      type,
      content,
      createdAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}

// GET HISTORY
export async function GET() {
  try {
    const snapshot = await db
      .collection("history")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(data);
  } catch (e) {
    return Response.json([]);
  }
      }
