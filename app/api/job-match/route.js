import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { job, skills } = await req.json();

    // 🧠 SIMPLE KEYWORD EXTRACTION (STABLE VERSION)
    const jobWords = job.toLowerCase().split(/\W+/);
    const skillWords = (skills || "").toLowerCase().split(/\W+/);

    const uniqueJobSkills = [...new Set(jobWords)].filter(w => w.length > 3);

    const matchedSkills = uniqueJobSkills.filter(s =>
      skillWords.includes(s)
    );

    const missingSkills = uniqueJobSkills.filter(
      s => !skillWords.includes(s)
    );

    const matchPercentage = Math.min(
      100,
      Math.floor((matchedSkills.length / uniqueJobSkills.length) * 100)
    );

    const suggestions = missingSkills.slice(0, 5).map(
      (s) => `Learn ${s} and add it to your resume`
    );

    return NextResponse.json({
      matchPercentage,
      matchedSkills,
      missingSkills: missingSkills.slice(0, 10),
      suggestions,
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
                             }
