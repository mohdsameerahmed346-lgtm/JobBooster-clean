export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pdf from "pdf-parse";

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
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    let resumeText = "";

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdf(buffer);
      resumeText = data.text;
    } catch {
      return NextResponse.json({
        error: "Upload a proper text-based PDF (Word/Docs).",
      });
    }

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: "Return only valid JSON.",
          },
          {
            role: "user",
            content: `
Analyze this resume for ATS optimization.

Return ONLY JSON:

{
  "score": number,
  "ats": number,
  "strengths": string[],
  "missingKeywords": string[],
  "sectionFeedback": {
    "skills": string,
    "experience": string,
    "projects": string
  },
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
    });

    const json = await aiRes.json();
    const raw = json?.choices?.[0]?.message?.content || "";

    const cleaned = extractJSON(raw);

    if (!cleaned) {
      return NextResponse.json({ error: "AI failed", raw });
    }

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Parse failed", cleaned });
    }

    return NextResponse.json({
      score: parsed.score || 0,
      ats: parsed.ats || 0,
      strengths: parsed.strengths || [],
      missingKeywords: parsed.missingKeywords || [],
      sectionFeedback: parsed.sectionFeedback || {},
      name: parsed.name || "",
      title: parsed.title || "",
      summary: parsed.summary || "",
      skills: parsed.skills || [],
      experience: parsed.experience || [],
      projects: parsed.projects || [],
      education: parsed.education || [],
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
