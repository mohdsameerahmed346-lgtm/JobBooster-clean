export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, isPremium } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" });
    }

    let aiResponse;

    // 💎 PREMIUM → OPENAI
    if (isPremium) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a resume analyzer. Return JSON only.",
            },
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });

      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content;
    }

    // 🆓 FREE → OPENROUTER
    else {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "system",
              content: "You are a resume analyzer. Return JSON only.",
            },
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });

      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content;
    }

    // 🔥 SAFE PARSE
    let result;
    try {
      const match = aiResponse.match(/\{[\s\S]*\}/);
      result = JSON.parse(match[0]);
    } catch {
      return NextResponse.json({ error: "Invalid AI response" });
    }

    return NextResponse.json({ result });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
          }
