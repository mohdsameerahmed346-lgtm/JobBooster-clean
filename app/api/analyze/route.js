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
        model: "meta-llama/llama-3-8b-instruct", // ✅ stable free model
        messages: [
          {
            role: "system",
            content: `
You are an expert HR recruiter.

Analyze this resume deeply and return ONLY JSON in this format:

{
  "score": number (0-100),
  "feedback": "detailed professional evaluation",
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["real weakness 1", "real weakness 2"],
  "improvements": ["actionable improvement 1", "actionable improvement 2"]
}

Rules:
- Do NOT copy strengths directly from resume
- Give realistic hiring-level feedback
- Be specific and critical
- Suggest measurable improvements (numbers, impact, results)
- Avoid generic words like "hardworking", "team player"
- Think like a recruiter hiring for a real job
- Return ONLY pure JSON (no extra text before or after)
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
