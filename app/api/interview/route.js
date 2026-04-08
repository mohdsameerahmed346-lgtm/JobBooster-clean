export async function POST(req) {
  const { role } = await req.json();

  const prompt = `
Generate interview questions for ${role} fresher.
Include:
- Technical
- HR
- Scenario questions
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  return Response.json({
    result: data.choices[0].message.content,
  });
}
