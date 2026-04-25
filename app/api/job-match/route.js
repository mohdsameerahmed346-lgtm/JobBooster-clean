import { NextResponse } from "next/server";
import OpenAI from "openai";
import { saveAnalysis } from "@/lib/analysis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const job = formData.get("job");
    const file = formData.get("file");
    const userId = formData.get("userId");

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
You are an expert ATS resume analyzer.

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

JOB:
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
      else throw new Error("Invalid JSON");
    }

    const result = {
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
    };

    // ✅ SAVE ANALYSIS
    if (userId) {
      await saveAnalysis(userId, {
        job,
        resumeText,
        result,
      });
    }

    return NextResponse.json(result);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}
