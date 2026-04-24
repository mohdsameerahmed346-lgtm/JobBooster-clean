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

    // 📄 SAFE PDF PARSE
    if (file) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdf(buffer);
        resumeText = data.text;
      } catch (e) {
        console.error("PDF parse failed:", e);
      }
    }

    const prompt = `
You are an expert ATS resume analyzer.

Analyze the RESUME against the JOB DESCRIPTION.

Return ONLY valid JSON:

{
  "matchPercentage": number,
  "resumeScore": number,
  "atsScore": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "suggestions": string[],
  "rewriteSuggestions": {
    "summary": string,
    "experience": string,
    "skills": string
  }
}

Rules:
- Scores must be 0–100
- missingSkills max 10
- suggestions must be practical
- rewriteSuggestions must improve clarity and ATS optimization

JOB DESCRIPTION:
${job}

RESUME:
${resumeText || "Not provided"}
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
      else throw new Error("Invalid JSON from AI");
    }

    return NextResponse.json({
      matchPercentage: json.matchPercentage || 0,
      resumeScore: json.resumeScore || 0,
      atsScore: json.atsScore || 0,
      matchedSkills: json.matchedSkills || [],
      missingSkills: json.missingSkills || [],
      suggestions: json.suggestions || [],
      rewriteSuggestions: json.rewriteSuggestions || {
        summary: "",
        experience: "",
        skills: "",
      },
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
         }
