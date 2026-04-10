export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Analyze this resume and return ONLY JSON in this format: {\"score\": number (0-100), \"feedback\": \"detailed improvements\"}",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    const result = data.choices[0].message.content;

    return Response.json({ result });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "AI failed" });
  }
}
