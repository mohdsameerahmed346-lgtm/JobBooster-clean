export const dynamic = "force-dynamic";

export async function POST(req) {
  const { role, answer, isPremium } = await req.json();

  let model = "openai/gpt-3.5-turbo";

  if (isPremium) {
    model = "openai/gpt-4";
  }

  const prompt = `Evaluate this interview answer for a ${role}.

Answer:
${answer}

Return response in this format:
Score: X/10
Strengths: ...
Weaknesses: ...
Improvements: ...
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();

    return Response.json({
      result: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (e) {
    return Response.json({
      result: "Error generating feedback",
    });
  }
          }
