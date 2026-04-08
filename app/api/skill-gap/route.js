export async function POST(req) {
  const { resume, jobDesc } = await req.json();

  const prompt = `
Compare resume with job description.

Give:
1. Missing skills
2. Improvement suggestions
3. Priority skills to learn
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt + resume + jobDesc }],
    }),
  });

  const data = await response.json();

  return Response.json({
    result: data.choices[0].message.content,
  });
      }
