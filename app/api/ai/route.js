export const dynamic = "force-dynamic";
export async function POST(req) {
  const { resume, jobDesc } = await req.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume optimizer. Improve resumes for ATS and job matching.",
          },
          {
            role: "user",
            content: `
Resume:
${resume}

Job Description:
${jobDesc}

Give:
1. Improved resume
2. Missing keywords
3. Suggestions
4. ATS score out of 100
            `,
          },
        ],
      }),
    });

    const data = await response.json();

    return Response.json({
      result: data.choices[0].message.content,
    });
  } catch (err) {
    return Response.json({ error: "AI failed" }, { status: 500 });
  }
}
