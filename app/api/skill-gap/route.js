export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { role, isPremium } = await req.json();

    const prompt = `For a ${role}, list missing skills and improvements in JSON:
    { "missing": [], "suggestions": [] }`;

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

    const result = JSON.parse(aiResponse);

    return NextResponse.json(result);

  } catch {
    return NextResponse.json({ error: "Failed" });
  }
        }
