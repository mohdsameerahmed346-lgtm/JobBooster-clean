import { NextResponse } from "next/server";
import OpenAI from "openai";
import { saveHistory } from "@/lib/history";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const job = formData.get("job");
    const skillsInput = formData.get("skills");
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!job) {
      return NextResponse.json(
        { error: "Job description required" },
        { status: 400 }
      );
    }

    let resumeText = "";

    // ✅ SAFE PDF PARSE (NO BUILD CRASH)
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

Return ONLY valid JSON:

{
  "matchPercentage": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "recommendedSkills": string[],
  "learningPlan": string[]
}

JOB:
${job}

USER SKILLS:
${skillsInput || "Not provided"}

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
      json = match ? JSON.parse(match[0]) : {};
    }

    const result = {
      matchPercentage: json.matchPercentage || 0,
      matchedSkills: json.matchedSkills || [],
      missingSkills: json.missingSkills || [],
      recommendedSkills: json.recommendedSkills || [],
      learningPlan: json.learningPlan || [],
    };

    // ✅ SAVE TO FIREBASE (IMPORTANT)
    if (userId) {
      await saveHistory(userId, "skill-gap", { job, skillsInput }, result);
    }

    return NextResponse.json(result);

  } catch (err) {
    console.error("Skill gap error:", err);

    return NextResponse.json(
      { error: "Skill gap analysis failed" },
      { status: 500 }
    );
  }
      }
