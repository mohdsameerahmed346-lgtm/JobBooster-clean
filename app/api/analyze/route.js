export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a resume expert. Analyze resumes and give score out of 100 with improvements.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    return Response.json({
      result: data.choices[0].message.content,
    });
  } catch (error) {
    return Response.json({ error: "Something went wrong" });
  }
              }
