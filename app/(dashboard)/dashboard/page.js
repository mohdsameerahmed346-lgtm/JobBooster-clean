"use client";

import Link from "next/link";

export default function Dashboard() {
  const isPremium =
    typeof window !== "undefined" &&
    localStorage.getItem("premium") === "true";

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Welcome back 👋
      </h1>

      {/* PLAN CARD */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 backdrop-blur">
        <p className="text-lg">
          Plan: {isPremium ? "💎 Premium" : "🆓 Free"}
        </p>
        <p className="text-gray-400 text-sm">
          {isPremium
            ? "Unlimited AI access"
            : "Limited usage available"}
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6">

        <Link href="/analyze" className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:scale-105 transition">
          <h2 className="text-lg mb-2">📄 Resume Analyzer</h2>
          <p className="text-gray-400 text-sm">
            Improve your resume instantly
          </p>
        </Link>

        <Link href="/interview" className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:scale-105 transition">
          <h2 className="text-lg mb-2">🎤 Interview Practice</h2>
          <p className="text-gray-400 text-sm">
            Practice with AI questions
          </p>
        </Link>

        <Link href="/skill-gap" className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:scale-105 transition">
          <h2 className="text-lg mb-2">📉 Skill Gap</h2>
          <p className="text-gray-400 text-sm">
            Find missing skills
          </p>
        </Link>

      </div>
    </div>
  );
}
