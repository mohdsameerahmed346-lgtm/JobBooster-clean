import { db } from "@/lib/firebase-admin";

export async function POST(req) {
  const { id, data } = await req.json();

  await db.collection("shared_resumes").doc(id).set({
    ...data,
    createdAt: Date.now(),
  });

  return Response.json({ success: true });
    }
