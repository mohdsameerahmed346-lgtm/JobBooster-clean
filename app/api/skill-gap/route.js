export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pdf from "pdf-parse";

/* 🧼 CLEAN AI RESPONSE */
function extractJSON(text) {
  try {
    // remove ```json ``` or ``` blocks
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // find first { and last }
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    return cleaned.slice(start, end + 1);
  } catch {
    return null;
  }
}

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
        temperature: 0, // 🔥 important for stable output
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON generator. Always return valid JSON only. No explanation.",
          },
          {
            role: "user",
            content: `
Return ONLY valid JSON. No text, no explanation.

Schema:
{
  "score": number,
  "ats": number,
  "strengths": string[],
  "missing": string[],
  "improvements": string[],
  "rewritten": string
}

Resume:
${resumeText}
            `,
          },
        ],
      }),
    });

    const json = await aiRes.json();
    const raw = json?.choices?.[0]?.message?.content || "";

    console.log("RAW AI:", raw);

    // 🧼 Extract clean JSON
    const cleaned = extractJSON(raw);

    if (!cleaned) {
      return NextResponse.json({
        error: "Could not extract JSON",
        raw,
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      return NextResponse.json({
        error: "JSON parse failed",
        cleaned,
      });
    }

    // 🛡️ FINAL SAFETY (ensure all fields exist)
    const safeData = {
      score: parsed.score || 0,
      ats: parsed.ats || 0,
      strengths: parsed.strengths || [],
      missing: parsed.missing || [],
      improvements: parsed.improvements || [],
      rewritten: parsed.rewritten || "",
    };

    return NextResponse.json(safeData);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
      }
