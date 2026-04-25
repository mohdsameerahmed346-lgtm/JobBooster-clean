import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const job = formData.get("job");
    const skillsInput = formData.get("skills"); // optional manual skills
    const file = formData.get("file"); // optional resume

    if (!job) {
      return NextResponse.json(
        { error: "Job description required" },
        { status: 400 }
      );
    }

    let resumeText = "";

    // ✅ SAFE PDF PARSE (NO BUILD ERROR)
    if (file) {
      try {
        const pdf = (await import("pdf-parse")).default;

        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdf(buffer);

        resumeText = data.text;
      } catch (e) {
        console.error("PDF parse error:", e);
      }
    }

    const prompt = `
You are an AI skill gap analyzer.

Compare USER SKILLS with JOB DESCRIPTION.

Return ONLY valid JSON:

{
  "matchPercentage": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "recommendedSkills": string[],
  "learningPlan": string[]
}

Rules:
- matchPercentage: realistic 0-100
- max 10 missingSkills
- max 6 learningPlan steps
- be practical and specific

JOB DESCRIPTION:
${job}

USER SKILLS:
${skillsInput || "Not provided"}

RESUME TEXT:
${resumeText || "Not provided"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    let text = completion.choices[0].message.content;

    let json;

    // ✅ SAFE JSON PARSE
    try {
      json = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        json = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON from AI");
      }
    }

    return NextResponse.json({
      matchPercentage: json.matchPercentage || 0,
      matchedSkills: json.matchedSkills || [],
      missingSkills: json.missingSkills || [],
      recommendedSkills: json.recommendedSkills || [],
      learningPlan: json.learningPlan || [],
    });

  } catch (err) {
    console.error("Skill gap error:", err);

    return NextResponse.json(
      { error: "Skill gap analysis failed" },
      { status: 500 }
    );
  }
        }
