import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { mode, text } = await req.json();

    if (!mode || !text) {
      return NextResponse.json({ error: "Missing input" });
    }

    let prompt = "";

    // 🧠 MODE SWITCH
    if (mode === "resume") {
      prompt = `
You are a resume analyzer.

Return ONLY valid JSON.

Rules:
- Do not assume missing information
- Only analyze based on given resume
- Every weakness must be based on resume evidence

Format:
{
  "score": number,
  "feedback": "string",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."]
}

Resume:
${text}
`;
    }

    else if (mode === "interview") {
      prompt = `
You are an interview expert.

Generate 5 real interview questions.

Return ONLY JSON:

{
  "questions": ["...", "...", "..."]
}

Job Role:
${text}
`;
    }

    else if (mode === "improve") {
      prompt = `
You are a resume writing expert.

Improve the given resume bullet.

Return ONLY JSON:

{
  "improved": "better version"
}

Text:
${text}
`;
    }

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: "You always return valid JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await aiRes.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: "AI failed" });
    }

    // ✅ SAFE JSON PARSE
    let result;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      result = JSON.parse(match[0]);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from AI" });
    }

    return NextResponse.json({ result });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
          }
