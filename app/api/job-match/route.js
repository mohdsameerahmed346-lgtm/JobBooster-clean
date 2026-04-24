import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { job, skills } = await req.json();

    if (!job) {
      return NextResponse.json(
        { error: "Job description required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional ATS resume analyzer.

Compare the JOB DESCRIPTION and USER SKILLS.

Return ONLY valid JSON (no explanation).

Format:
{
  "matchPercentage": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "suggestions": string[]
}

Rules:
- matchPercentage must be 0–100
- max 10 missingSkills
- suggestions should be actionable

JOB DESCRIPTION:
${job}

USER SKILLS:
${skills || "Not provided"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let text = completion.choices[0].message.content;

    // 🔒 SAFE JSON PARSE
    let json;

    try {
      json = JSON.parse(text);
    } catch (e) {
      // fallback fix if AI adds text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        json = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON from AI");
      }
    }

    // 🛡️ FINAL SAFETY STRUCTURE
    return NextResponse.json({
      matchPercentage: json.matchPercentage || 0,
      matchedSkills: json.matchedSkills || [],
      missingSkills: json.missingSkills || [],
      suggestions: json.suggestions || [],
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
  }
