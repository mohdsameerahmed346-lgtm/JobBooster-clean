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
          role: "system",
          content:
            "You are an expert ATS resume analyzer. Give:\n1. ATS score out of 100\n2. Strengths\n3. Weaknesses\n4. Improvements\nMake it clean and structured."
        },
        {
          role: "user",
          content: resume
        }
      ],
    });

    return Response.json({
      result: response.choices[0].message.content,
    });

  } catch (error) {
    return Response.json({
      result: "Error analyzing resume. Check API key or try again."
    });
  }
      }
