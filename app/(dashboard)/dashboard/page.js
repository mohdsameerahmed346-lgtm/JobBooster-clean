"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back 👋</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ANALYZE */}
        <Link href="/analyze">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 hover:scale-[1.02] transition cursor-pointer">
            <h2 className="text-lg mb-2">📄 Resume Analyzer</h2>
            <p className="text-gray-400 text-sm">
              Improve your resume instantly
            </p>
          </div>
        </Link>

        {/* INTERVIEW */}
        <Link href="/interview">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-green-500 hover:scale-[1.02] transition cursor-pointer">
            <h2 className="text-lg mb-2">🎤 Interview Practice</h2>
            <p className="text-gray-400 text-sm">
              Practice with AI questions
            </p>
          </div>
        </Link>

        {/* SKILL GAP */}
        <Link href="/skill-gap">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-purple-500 hover:scale-[1.02] transition cursor-pointer">
            <h2 className="text-lg mb-2">📉 Skill Gap</h2>
            <p className="text-gray-400 text-sm">
              Find missing skills
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
    }
