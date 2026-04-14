import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "No role provided" });
    }

    // 🔥 TEMP AI (WORKING VERSION)
    const questions = [
      `What are key skills required for a ${role}?`,
      `Explain a real project you worked on as a ${role}.`,
      `What challenges do ${role}s face?`,
      `How do you stay updated in ${role}?`,
      `Why should we hire you as a ${role}?`,
    ];

    return NextResponse.json({ questions });

  } catch (err) {
    return NextResponse.json({ error: "Server error" });
  }
}
