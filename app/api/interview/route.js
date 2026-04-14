import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "No role provided" });
    }

    const prompt = `
Generate 5 interview questions for ${role}.
Return as JSON array.
`;

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
    const raw = data.choices?.[0]?.message?.content;

    const match = raw.match(/\[[\s\S]*\]/);
    const questions = match ? JSON.parse(match[0]) : [];

    return NextResponse.json({ questions });

  } catch (err) {
    return NextResponse.json({ error: "Server error" });
  }
                    }
