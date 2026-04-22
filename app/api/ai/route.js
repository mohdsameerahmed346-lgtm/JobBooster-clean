import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      stream: true,
      messages: [
        { role: "user", content: prompt }
      ],
    }),
  });

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
