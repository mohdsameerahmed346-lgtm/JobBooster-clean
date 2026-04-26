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

        resumeText = data.text || "";
      } catch (e) {
        console.error("PDF parse error:", e);
      }
    }

    // 🧠 IMPROVED PROMPT (MORE ACCURATE)
    const prompt = `
You are an expert AI career coach and ATS analyzer.

Analyze the job, user skills, and resume.

Return ONLY valid JSON:

{
  "matchPercentage": number,
  "resumeScore": number,
  "atsScore": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "recommendedSkills": string[],
  "learningPlan": string[]
}

Rules:
- matchPercentage = how well user fits job
- resumeScore = resume quality (0-100)
- atsScore = ATS compatibility (0-100)
- missingSkills = critical missing job skills
- recommendedSkills = what to learn next
- learningPlan = 3-5 short actionable steps

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

    let text = completion.choices[0].message.content || "";

    // ✅ ULTRA SAFE JSON PARSE
    let json = {};

    try {
      json = JSON.parse(text);
    } catch {
      try {
        const match = text.match(/\{[\s\S]*\}/);
        json = match ? JSON.parse(match[0]) : {};
      } catch {
        json = {};
      }
    }

    // ✅ FINAL SAFE STRUCTURE
    const result = {
      matchPercentage: Number(json.matchPercentage) || 0,
      resumeScore: Number(json.resumeScore) || 0,
      atsScore: Number(json.atsScore) || 0,

      matchedSkills: Array.isArray(json.matchedSkills)
        ? json.matchedSkills
        : [],

      missingSkills: Array.isArray(json.missingSkills)
        ? json.missingSkills
        : [],

      recommendedSkills: Array.isArray(json.recommendedSkills)
        ? json.recommendedSkills
        : [],

      learningPlan: Array.isArray(json.learningPlan)
        ? json.learningPlan
        : [],
    };

    // ✅ SAVE TO FIREBASE (UNCHANGED BUT SAFE)
    if (userId) {
      try {
        await saveHistory(userId, "skill-gap", { job, skillsInput }, result);
      } catch (e) {
        console.error("History save error:", e);
      }
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
