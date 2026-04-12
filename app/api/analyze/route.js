import { NextResponse } from "next/server";

// 🔥 Firebase Admin
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// ✅ INIT FIREBASE ADMIN (SAFE FOR VERCEL + LOCAL)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.includes("\\n")
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : process.env.FIREBASE_PRIVATE_KEY,
    }),
  });
}

const db = getFirestore();

// 🚀 MAIN API
export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No resume text provided" });
    }

    // 🔥 AI CALL
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-app.vercel.app", // optional but recommended
        "X-Title": "JobBooster",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are a professional resume analyzer.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT include explanations outside JSON
- Do not assume missing information
- Only analyze based on given resume content
- Every weakness MUST be based on visible evidence

FORMAT:
{
  "score": number,
  "feedback": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvements": ["string"]
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

    // ❌ HANDLE API FAILURE
    if (!aiRes.ok) {
      console.error("AI API ERROR:", await aiRes.text());
      return NextResponse.json({ error: "AI service failed" });
    }

    const aiData = await aiRes.json();

    const raw = aiData?.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: "Empty AI response" });
    }

    // 🔥 SAFE JSON PARSE
    let result;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json({ error: "Invalid AI JSON format" });
      }

      result = JSON.parse(match[0]);
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);
      return NextResponse.json({ error: "AI response parsing failed" });
    }

    // 🔥 SAVE HISTORY (TEMP USER)
    await db
      .collection("users")
      .doc("demo-user") // 🔁 later replace with real user.uid
      .collection("history")
      .add({
        score: result.score || 0,
        feedback: result.feedback || "",
        createdAt: Date.now(),
      });

    // ✅ FINAL RESPONSE
    return NextResponse.json({ result });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "Server error" });
  }
        }
