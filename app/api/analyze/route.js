export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // ✅ safer model
        messages: [
          {
            role: "system",
            content:
              "Analyze this resume and return ONLY JSON like this: {\"score\": number (0-100), \"feedback\": \"clear suggestions\"}",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    // 🔥 HANDLE OPENAI ERROR
    if (!response.ok) {
      console.error("OpenAI Error:", data);
      return Response.json({
        error: data.error?.message || "OpenAI API failed",
      });
    }

    const result = data.choices[0].message.content;

    return Response.json({ result });

  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json({ error: error.message });
  }
        }
