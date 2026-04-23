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
            role: "system",
            content: "You are a resume expert.",
          },
          {
            role: "user",
            content: `
Analyze and improve this resume.

Return ONLY JSON:

{
  "score": number,
  "ats": number,
  "strengths": [],
  "missing": [],
  "improvements": [],
  "rewritten": "Full improved resume"
}

Resume:
${resumeText}
            `,
          },
        ],
      }),
    });

    const json = await aiRes.json();
    const raw = json.choices?.[0]?.message?.content;

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { error: "AI parsing failed", raw };
    }

    return NextResponse.json(parsed);

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
        }
