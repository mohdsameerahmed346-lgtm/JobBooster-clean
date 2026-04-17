"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* HERO */}
      <div className="text-center py-20 px-6">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          🚀 JobBooster AI
        </motion.h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-6">
          Prepare for jobs with AI-powered resume analysis, interview coaching,
          and skill gap insights.
        </p>

        <div className="flex justify-center gap-4">

          <Link href="/dashboard">
            <button className="bg-blue-600 px-6 py-3 rounded-lg hover:scale-105 active:scale-95 transition">
              Get Started
            </button>
          </Link>

          <Link href="/pricing">
            <button className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              View Pricing
            </button>
          </Link>

        </div>
      </div>

      {/* NOTICE */}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <div className="bg-yellow-900/20 border border-yellow-700 p-5 rounded-xl">
          <h2 className="mb-2 font-semibold">⚠️ Important Notice</h2>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Free users have limited usage</li>
            <li>• AI responses may not be 100% accurate</li>
            <li>• Premium users get better AI models</li>
          </ul>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-20">

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800"
        >
          <h2 className="text-lg mb-2">📄 Resume Analyzer</h2>
          <p className="text-gray-400 text-sm">
            Analyze your resume and improve it instantly.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800"
        >
          <h2 className="text-lg mb-2">🎤 Interview Practice</h2>
          <p className="text-gray-400 text-sm">
            Get real interview questions and AI feedback.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800"
        >
          <h2 className="text-lg mb-2">📉 Skill Gap</h2>
          <p className="text-gray-400 text-sm">
            Discover missing skills for your dream job.
          </p>
        </motion.div>

      </div>

      {/* CTA */}
      <div className="text-center pb-20">
        <h2 className="text-2xl font-semibold mb-4">
          Start boosting your career today 🚀
        </h2>

        <Link href="/dashboard">
          <button className="bg-green-600 px-6 py-3 rounded-lg hover:scale-105 transition">
            Go to Dashboard
          </button>
        </Link>
      </div>

    </div>
  );
    }
