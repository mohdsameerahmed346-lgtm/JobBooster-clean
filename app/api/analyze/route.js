import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { resume } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a resume expert. Give ATS score out of 100 and suggestions."
        },
        {
          role: "user",
          content: resume
        }
      ],
    });

    return Response.json({
      result: response.choices[0].message.content
    });

  } catch (error) {
    return Response.json({
      error: "Something went wrong"
    });
  }
  }
