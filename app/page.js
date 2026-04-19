"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* HERO SECTION */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          🚀 AI-Powered Career Growth
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Land your dream job faster with smart resume analysis, interview coaching,
          and skill gap insights.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 px-6 py-3 rounded-lg font-medium hover:scale-105 transition"
          >
            Start for Free
          </Link>

          <Link
            href="/pricing"
            className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            View Pricing
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Trusted by 1,000+ job seekers 🚀
        </p>
      </section>

      {/* NOTICE */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-xl text-sm text-yellow-300">
          ⚠️ Important Notice
          <ul className="mt-2 space-y-1 text-yellow-200">
            <li>• Free users have limited usage</li>
            <li>• AI responses may not be 100% accurate</li>
            <li>• Premium users get better AI models</li>
          </ul>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">

        {/* Resume */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition">
          <h2 className="text-lg font-semibold mb-2">📄 Resume Analyzer</h2>
          <p className="text-gray-400 text-sm">
            Analyze your resume and improve it instantly with AI suggestions.
          </p>
        </div>

        {/* Interview */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-green-500 transition relative">

          <span className="absolute top-3 right-3 text-xs bg-blue-600 px-2 py-1 rounded">
            💎 Premium
          </span>

          <h2 className="text-lg font-semibold mb-2">🎤 Interview Practice</h2>
          <p className="text-gray-400 text-sm">
            Get real interview questions and AI-powered feedback.
          </p>
        </div>

        {/* Skill Gap */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition relative">

          <span className="absolute top-3 right-3 text-xs bg-blue-600 px-2 py-1 rounded">
            💎 Premium
          </span>

          <h2 className="text-lg font-semibold mb-2">📉 Skill Gap Insights</h2>
          <p className="text-gray-400 text-sm">
            Discover missing skills and improve your job readiness.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">
          Start boosting your career today 🚀
        </h2>

        <Link
          href="/dashboard"
          className="bg-blue-600 px-6 py-3 rounded-lg hover:scale-105 transition"
        >
          Go to Dashboard
        </Link>
      </section>

    </div>
  );
    }
