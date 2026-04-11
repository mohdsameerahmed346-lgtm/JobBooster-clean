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
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are an expert HR recruiter.

Analyze this resume deeply and return ONLY JSON in this format:

{
  "score": number (0-100),
  "feedback": "detailed professional evaluation",
  "strengths": ["specific, evidence-based strength"],
  "weaknesses": ["real weakness based on resume"],
  "improvements": ["clear actionable improvement"]
}

🔥 STRICT RULES:

- Do NOT copy strengths directly from resume
- Do NOT use generic terms like "hardworking", "team player", "good communication"
- ONLY mention strengths that are clearly proven by resume content
- PRIORITIZE measurable achievements (%, numbers, impact)

- If metrics (like %, numbers, improvements) are present → MUST highlight them as strengths
- If metrics are missing → mention it as a weakness

- Do not assume missing information
- Only analyze based on given resume content
- Every weakness MUST be based on visible resume data

- Be critical but fair (like a real recruiter)
- Give practical suggestions for getting hired

⚠️ Return ONLY pure JSON (no extra text before or after)
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
