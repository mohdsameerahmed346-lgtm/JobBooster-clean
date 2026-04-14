import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" });
    }

    // 🔥 TEMP WORKING AI (no external API)
    const result = {
      score: Math.floor(Math.random() * 40) + 60,
      feedback: "Your resume is decent but can be improved with better structure.",
      strengths: ["Clear formatting", "Relevant skills"],
      weaknesses: ["Lacks metrics", "Generic summary"],
      improvements: ["Add numbers", "Customize for job"],
    };

    return NextResponse.json({ result });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
      }
