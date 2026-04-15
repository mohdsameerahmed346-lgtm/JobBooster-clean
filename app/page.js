"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HERO */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <h1 className="text-4xl font-bold mb-4">
          🚀 JobBooster AI
        </h1>

        <p className="text-gray-400 mb-6">
          Prepare for jobs with AI-powered resume analysis,
          interview questions, and skill gap insights.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/dashboard" className="bg-blue-600 px-6 py-2 rounded">
            Get Started
          </Link>

          <Link href="/pricing" className="bg-gray-800 px-6 py-2 rounded">
            View Pricing
          </Link>
        </div>
      </div>

      {/* WARNING */}
      <div className="max-w-3xl mx-auto mt-12 bg-yellow-900/20 border border-yellow-700 p-5 rounded-lg">
        <h2 className="text-yellow-400 font-semibold mb-2">
          ⚠️ Important Notice
        </h2>

        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Free users have limited usage</li>
          <li>• AI responses may not be 100% accurate</li>
          <li>• Premium users get better AI models</li>
        </ul>
      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-[#020617] p-6 rounded-xl">
          <h3 className="text-lg mb-2">📄 Resume Analyzer</h3>
          <p className="text-gray-400 text-sm">
            Analyze your resume and improve it instantly.
          </p>
        </div>

        <div className="bg-[#020617] p-6 rounded-xl">
          <h3 className="text-lg mb-2">🎤 Interview Practice</h3>
          <p className="text-gray-400 text-sm">
            Get real interview questions and feedback.
          </p>
        </div>

        <div className="bg-[#020617] p-6 rounded-xl">
          <h3 className="text-lg mb-2">📉 Skill Gap</h3>
          <p className="text-gray-400 text-sm">
            Discover missing skills for your dream job.
          </p>
        </div>
      </div>
    </div>
  );
}
