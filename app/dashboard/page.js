"use client";

import Menu from "../../components/Menu";
import Link from "next/link";

export default function Dashboard() {
  const isPremium = typeof window !== "undefined" &&
    localStorage.getItem("premium") === "true";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Menu />

      <div className="md:ml-64 p-6 md:p-8">

        <h1 className="text-3xl mb-6">Dashboard</h1>

        {/* PLAN */}
        <div className="bg-[#020617] p-5 rounded-xl mb-6">
          <p>Plan: {isPremium ? "💎 Premium" : "🆓 Free"}</p>
          <p className="text-gray-400 text-sm">
            Free users have limited access
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-6">

          <Link href="/analyze" className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
            <h2>📄 Resume Analyzer</h2>
          </Link>

          <Link href="/interview" className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
            <h2>🎤 Interview Practice</h2>
          </Link>

          <Link href="/skill-gap" className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
            <h2>📉 Skill Gap</h2>
          </Link>

        </div>
      </div>
    </div>
  );
        }
