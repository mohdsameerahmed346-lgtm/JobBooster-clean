import { NextResponse } from "next/server";

// 🔥 Firebase Admin
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// ✅ INIT FIREBASE
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
    const { text, job, isPremium } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No resume text" });
    }

    // 🧠 PROMPT
    const prompt = `
You are an AI career assistant.

Analyze the resume and job description.

Return ONLY valid JSON:

{
  "score": number,
  "feedback": "string",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."]
}
Resume:
${text}

Job Description:
${job || "Not provided"}
`;

    let aiResponse;

    // 💎 PREMIUM → OpenAI
    if (isPremium) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content;
    }

    // 🆓 FREE → OpenRouter
    else {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content;
    }

    if (!aiResponse) {
      return NextResponse.json({ error: "AI failed" });
    }

    // 🔥 SAFE JSON PARSE
    let result;
    try {
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid JSON");

      result = JSON.parse(match[0]);
    } catch (err) {
      return NextResponse.json({ error: "Parse error" });
    }

    // 🔥 SAVE HISTORY
    await db
      .collection("users")
      .doc("demo-user") // later replace with real user
      .collection("history")
      .add({
        score: result.score || 0,
        feedback: result.feedback || "",
        createdAt: Date.now(),
      });

    return NextResponse.json({ result });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
        }
