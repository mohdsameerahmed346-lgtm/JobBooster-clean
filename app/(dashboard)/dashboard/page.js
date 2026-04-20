"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-400 mt-1">
          Boost your career with AI tools
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <Link href="/analyze">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 hover:scale-105 transition">
            <h2 className="text-xl font-semibold mb-2">📄 Resume Analyzer</h2>
            <p className="text-gray-400 text-sm">
              Improve your resume instantly with AI
            </p>
          </div>
        </Link>

        <Link href="/interview">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 hover:scale-105 transition">
            <h2 className="text-xl font-semibold mb-2">🎤 Interview Practice</h2>
            <p className="text-gray-400 text-sm">
              Practice real interview questions
            </p>
          </div>
        </Link>

        <Link href="/skill-gap">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 hover:scale-105 transition">
            <h2 className="text-xl font-semibold mb-2">📉 Skill Gap</h2>
            <p className="text-gray-400 text-sm">
              Find missing skills for your role
            </p>
          </div>
        </Link>

      </div>

    </div>
  );
    }
