import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// ✅ INIT FIREBASE (SAFE)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

// 📊 GET HISTORY
export async function GET() {
  try {
    const snap = await db
      .collection("users")
      .doc("demo-user") // will upgrade later
      .collection("history")
      .orderBy("createdAt", "desc")
      .get();

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ data: [] });
  }
}
