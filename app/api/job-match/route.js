import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdf from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const job = formData.get("job");
    const file = formData.get("file");

    if (!job) {
      return NextResponse.json(
        { error: "Job description required" },
        { status: 400 }
      );
    }

    let resumeText = "";

    // 📄 READ PDF SAFELY
    if (file) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdf(buffer);
        resumeText = data.text;
      } catch (e) {
        console.error("PDF parse error:", e);
        resumeText = "";
      }
    }

    const prompt = `
You are an AI ATS analyzer.

Extract skills from RESUME and compare with JOB DESCRIPTION.

Return ONLY JSON:

{
  "matchPercentage": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "suggestions": string[]
}

Rules:
- max 10 missingSkills
- realistic matchPercentage

JOB DESCRIPTION:
${job}

RESUME:
${resumeText || "No resume provided"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    let text = completion.choices[0].message.content;

    let json;

    try {
      json = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) json = JSON.parse(match[0]);
      else throw new Error("Invalid JSON");
    }

    return NextResponse.json({
      matchPercentage: json.matchPercentage || 0,
      matchedSkills: json.matchedSkills || [],
      missingSkills: json.missingSkills || [],
      suggestions: json.suggestions || [],
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
      }
