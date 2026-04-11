export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: "No resume text provided" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", // ✅ FREE WORKING MODEL
        messages: [
          {
            role: "system",
            content: `
Analyze this resume deeply and return ONLY JSON:

{
  "score": number (0-100),
  "feedback": "detailed paragraph explaining overall quality",
  "strengths": ["point 1", "point 2", "point 3"],
  "weaknesses": ["point 1", "point 2"],
  "improvements": ["specific action 1", "specific action 2", "specific action 3"]
}

Rules:
- Be professional and realistic
- Score should reflect actual resume quality
- Give practical suggestions for getting a job
`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    // 🔥 HANDLE API ERRORS
    if (!response.ok) {
      console.error("API Error:", data);
      return Response.json({
        error: data.error?.message || "AI request failed",
      });
    }

    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      return Response.json({ error: "Invalid AI response" });
    }

    return Response.json({ result });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return Response.json({ error: error.message });
  }
                                 }
