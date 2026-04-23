export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pdf from "pdf-parse";

/* 🧼 CLEAN AI JSON */
function extractJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

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
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    /* 📄 SAFE PDF PARSE */
    let resumeText = "";

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdf(buffer);
      resumeText = data.text;
    } catch (err) {
      console.error("PDF ERROR:", err);

      return NextResponse.json({
        error:
          "Failed to read PDF. Please upload a text-based resume (Word/Docs).",
      });
    }

    /* 🤖 AI CALL */
    const aiRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0,
          messages: [
            {
              role: "system",
              content:
                "You are a strict JSON generator. Only return valid JSON. No explanation.",
            },
            {
              role: "user",
              content: `
Return ONLY valid JSON.

Schema:
{
  "name": string,
  "title": string,
  "summary": string,
  "skills": string[],
  "experience": [
    {
      "role": string,
      "company": string,
      "duration": string,
      "points": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string
    }
  ],
  "education": [
    {
      "degree": string,
      "college": string
    }
  ]
}

Resume:
${resumeText}
              `,
            },
          ],
        }),
      }
    );

    const json = await aiRes.json();
    const raw = json?.choices?.[0]?.message?.content || "";

    console.log("RAW AI:", raw);

    /* 🧼 EXTRACT JSON */
    const cleaned = extractJSON(raw);

    if (!cleaned) {
      return NextResponse.json({
        error: "Could not extract valid JSON from AI",
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

    /* 🛡️ SAFE STRUCTURE */
    const safeData = {
      name: parsed.name || "",
      title: parsed.title || "",
      summary: parsed.summary || "",
      skills: parsed.skills || [],
      experience: parsed.experience || [],
      projects: parsed.projects || [],
      education: parsed.education || [],
    };

    return NextResponse.json(safeData);

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json(
      { error: "Server error. Try again." },
      { status: 500 }
    );
  }
                         }
