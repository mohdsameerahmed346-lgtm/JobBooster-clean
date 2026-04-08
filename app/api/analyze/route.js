import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const resume = body.resume;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a resume expert. Give short improvement tips.",
        },
        {
          role: "user",
          content: `Analyze this resume:\n${resume}`,
        },
      ],
    });

    return Response.json({
      result: completion.choices[0].message.content,
    });

  } catch (error) {
    console.log(error);

    return Response.json({
      result: "❌ AI error. Check API key or quota.",
    });
  }
      }
