import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const resumeText = formData.get("resumeText");
    const job = formData.get("job");

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text required" },
        { status: 400 }
      );
    }

    const prompt = `
Rewrite this resume professionally.

Return ONLY JSON:

{
  "name": "",
  "summary": "",
  "skills": [],
  "experience": [
    {
      "role": "",
      "company": "",
      "points": []
    }
  ]
}

RESUME:
${resumeText}

JOB:
${job || "Not provided"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
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

    return NextResponse.json({
      name: json.name || "",
      summary: json.summary || "",
      skills: json.skills || [],
      experience: json.experience || [],
    });

  } catch (err) {
    console.error("Rewrite error:", err);

    return NextResponse.json(
      { error: "Rewrite failed" },
      { status: 500 }
    );
  }
  }
