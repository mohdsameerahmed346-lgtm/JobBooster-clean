import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// 🔥 INIT FIREBASE ADMIN
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

export async function POST(req) {
  try {
    const { role, skills, answer, question } = await req.json();

    if (!role || !skills) {
      return NextResponse.json({ error: "Missing job details" });
    }

    // 🧠 PROMPT
    const prompt = `
You are an AI interview coach.

Job Role: ${role}
Skills: ${skills}

${question ? `Question: ${question}\nUser Answer: ${answer}` : ""}

TASK:
${question ? "Evaluate the answer." : "Generate 5 interview questions."}

STRICT RULES:
- Do NOT assume missing information
- Only use given job details

RETURN JSON:

${
  question
    ? `{
  "score": number,
  "feedback": "string",
  "improvements": ["..."]
}`
    : `{
  "questions": ["..."]
}`
}
`;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: "You are a helpful AI." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const aiData = await aiRes.json();
    const raw = aiData.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: "AI failed" });
    }

    let result;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      result = JSON.parse(match[0]);
    } catch {
      return NextResponse.json({ error: "Invalid AI JSON" });
    }

    // 🔥 SAVE HISTORY
    await db.collection("users").doc("demo-user").collection("history").add({
      role,
      skills,
      ...result,
      createdAt: Date.now(),
    });

    return NextResponse.json({ result });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
  }
