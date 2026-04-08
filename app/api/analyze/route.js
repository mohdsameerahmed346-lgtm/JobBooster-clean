import OpenAI from "openai";

export async function POST(req) {
  try {
    const { resume } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Give ATS score, strengths, weaknesses, and improvements for this resume:\n${resume}`,
        },
      ],
    });

    const result =
      response.choices?.[0]?.message?.content ||
      "No response from AI";

    return Response.json({ result });

  } catch (error) {
    console.log(error);

    return Response.json({
      result: "❌ AI error. Check API key or quota.",
    });
  }
                }
