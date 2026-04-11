export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", // ✅ WORKING MODEL
        messages: [
          {
            role: "system",
            content:
              "Analyze this resume and return ONLY JSON: {\"score\": number (0-100), \"feedback\": \"clear improvements\"}",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        error: data.error?.message || "API failed",
      });
    }

    const result = data.choices[0].message.content;

    return Response.json({ result });

  } catch (error) {
    return Response.json({ error: error.message });
  }
            }
