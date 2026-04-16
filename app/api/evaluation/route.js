export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { question, answer, isPremium } = await req.json();

    const prompt = `
Evaluate this interview answer.

Question: ${question}
Answer: ${answer}

Return JSON:
{
  "score": number,
  "feedback": "string",
  "improvement": "string"
}
`;

    let aiResponse;

    if (isPremium) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content;
    } else {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content;
    }

    const match = aiResponse.match(/\{[\s\S]*\}/);
    const result = JSON.parse(match[0]);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed" });
  }
                      }
