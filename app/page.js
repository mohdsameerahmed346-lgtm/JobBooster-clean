"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center px-6 py-10">

      {/* HERO */}
      <section className="text-center max-w-3xl">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          🚀 AI-Powered Career Growth
        </motion.h1>

        <p className="text-gray-400 mb-6 text-lg">
          Land your dream job faster with smart resume analysis, interview coaching, and skill gap insights.
        </p>

        {/* CTA */}
        <div className="flex gap-4 justify-center flex-wrap">
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

        {/* SOCIAL PROOF */}
        <p className="text-gray-500 text-sm mt-6">
          Trusted by 1,000+ job seekers 🚀
        </p>

      </section>

      {/* NOTICE */}
      <section className="mt-12 bg-gray-900 border border-gray-800 p-5 rounded-xl max-w-2xl w-full">
        <h2 className="text-lg font-semibold mb-2">⚠️ Important Notice</h2>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Free users have limited usage</li>
          <li>• AI responses may not be 100% accurate</li>
          <li>• Premium users get better AI models</li>
        </ul>
      </section>

      {/* FEATURES */}
      <section className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl w-full">

        {/* CARD 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
        >
          <h3 className="text-lg mb-2">📄 Resume Analyzer</h3>
          <p className="text-gray-400 text-sm">
            Analyze your resume and improve it instantly with AI suggestions.
          </p>
        </motion.div>

        {/* CARD 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
        >
          <h3 className="text-lg mb-2">🎤 Interview Practice</h3>
          <p className="text-gray-400 text-sm">
            Get real interview questions and AI-powered feedback.
          </p>
        </motion.div>

        {/* CARD 3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
        >
          <h3 className="text-lg mb-2">📉 Skill Gap Insights</h3>
          <p className="text-gray-400 text-sm">
            Discover missing skills and improve your job readiness.
          </p>
        </motion.div>

      </section>

      {/* FINAL CTA */}
      <section className="mt-16 text-center">
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
