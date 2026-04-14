import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { role, isPremium } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "No role provided" });
    }

    let aiResponse;

    const prompt = `
Generate 5 realistic and advanced interview questions for a ${role}.
Return ONLY JSON array like:
["question1","question2","question3"]
`;

    // 💎 PREMIUM → OpenAI
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
    }

    // 🆓 FREE → OpenRouter
    else {
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

    // 🔥 SAFE PARSE
    let questions;
    try {
      const match = aiResponse.match(/\[[\s\S]*\]/);
      questions = JSON.parse(match[0]);
    } catch {
      return NextResponse.json({ error: "AI parsing failed" });
    }

    return NextResponse.json({ questions });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
        }
