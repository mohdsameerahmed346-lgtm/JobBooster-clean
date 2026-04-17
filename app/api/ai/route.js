export async function POST(req) {
  const { type, input, role, answer, isPremium } = await req.json();

  const promptMap = {
    score: `
Analyze this resume and give:
- Score out of 100
- Strengths
- Weaknesses
- Improvements

Resume:
${input}
`,

    interview: `
Evaluate this answer for ${role} role.

Answer:
${answer}

Give:
- Score out of 10
- Feedback
- Better answer
`,

    skillgap: `
For role ${role}, give:
- Missing skills
- Learning roadmap
`,

    rewrite: `
Rewrite this professionally with impact:

${input}
`,

    jobmatch: `
Compare resume with job description.

Resume:
${input}

Give:
- Match %
- Missing keywords
`,
  };

  const prompt = promptMap[type];

  const response = await fetch(
    isPremium
      ? "https://api.openai.com/v1/chat/completions"
      : "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: isPremium
          ? `Bearer ${process.env.OPENAI_API_KEY}`
          : `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: isPremium ? "gpt-4o-mini" : "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  const data = await response.json();

  return Response.json({
    result: data.choices?.[0]?.message?.content || "No response",
  });
}
