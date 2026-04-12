import { NextResponse } from "next/server";

// 🔥 IMPORTANT: use your firebase ADMIN (not client)
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// ✅ INIT FIREBASE ADMIN (ONLY ONCE)
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

// 🚀 MAIN API
export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No resume text" });
    }

    // 🔥 AI CALL (OpenRouter example)
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are a resume analyzer.

Return ONLY valid JSON.

Rules:
- Do not assume missing information
- Only analyze based on given resume
- Every weakness must be based on resume evidence

Format:
{
  "score": number,
  "feedback": "string",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."]
}
            `,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const aiData = await aiRes.json();

    const raw = aiData.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: "AI failed" });
    }

    // 🔥 SAFE JSON EXTRACT
    let result;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json({ error: "Invalid AI format" });
      }

      result = JSON.parse(match[0]);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "JSON parse failed" });
    }

    // 🔥 SAVE HISTORY (THIS IS THE CORRECT PLACE)
    await db
      .collection("users")
      .doc("demo-user") // ⚠️ replace later with real user.uid
      .collection("history")
      .add({
        score: result.score || 0,
        feedback: result.feedback || "",
        createdAt: Date.now(),
      });

    // ✅ RETURN RESULT
    return NextResponse.json({ result });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
            }
