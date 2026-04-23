import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 📄 Extract text from PDF
    const data = await pdf(buffer);
    const resumeText = data.text;

    // 🤖 Send to AI (OpenRouter or OpenAI)
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a career coach AI.",
          },
          {
            role: "user",
            content: `
Analyze this resume and return:

1. Missing skills
2. Strengths
3. Recommended learning path

Resume:
${resumeText}
            `,
          },
        ],
      }),
    });

    const json = await aiRes.json();

    const result =
      json.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ result });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
          }
