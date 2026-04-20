"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>
        <p className="text-gray-300 mt-2">
          Boost your career with AI-powered tools
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* CARD */}
        <Link href="/analyze">
          <div className="group relative bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl transition hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl cursor-pointer">

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>

            <h2 className="text-xl font-semibold mb-2">
              📄 Resume Analyzer
            </h2>
            <p className="text-gray-400 text-sm">
              Improve your resume instantly with AI
            </p>
          </div>
        </Link>

        {/* CARD */}
        <Link href="/interview">
          <div className="group relative bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl transition hover:scale-105 hover:shadow-purple-500/20 hover:shadow-xl cursor-pointer">

            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>

            <h2 className="text-xl font-semibold mb-2">
              🎤 Interview Practice
            </h2>
            <p className="text-gray-400 text-sm">
              Practice real interview questions
            </p>
          </div>
        </Link>

        {/* CARD */}
        <Link href="/skill-gap">
          <div className="group relative bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl transition hover:scale-105 hover:shadow-cyan-500/20 hover:shadow-xl cursor-pointer">

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>

            <h2 className="text-xl font-semibold mb-2">
              📉 Skill Gap
            </h2>
            <p className="text-gray-400 text-sm">
              Find missing skills for your role
            </p>
          </div>
        </Link>

      </div>

    </div>
  );
        }
