export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);
    const resumeText = data.text;

    console.log("✅ PDF extracted");

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Analyze this resume and return JSON with score, ats, strengths, missing, improvements, rewritten:\n\n${resumeText}`,
          },
        ],
      }),
    });

    const json = await aiRes.json();

    console.log("🤖 AI response:", json);

    const content = json?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No AI response" });
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      // fallback if AI gives text instead of JSON
      return NextResponse.json({
        error: "AI returned invalid JSON",
        raw: content,
      });
    }

    return NextResponse.json(parsed);

  } catch (err) {
    console.error("❌ ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
                           }
