"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#020617] via-[#0f172a] to-black">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          AI-Powered Career Growth 🚀
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
        >
          Land your dream job faster with smart resume analysis,
          interview coaching, and skill gap insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link href="/login">
            <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
              Start for Free
            </button>
          </Link>

          <Link href="/pricing">
            <button className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-white/10 transition">
              View Pricing
            </button>
          </Link>
        </motion.div>

        <p className="mt-6 text-sm text-gray-500">
          Trusted by 1,000+ job seekers 🚀
        </p>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        {[
          {
            title: "📄 Resume Analyzer",
            desc: "Get instant AI feedback to improve your resume.",
          },
          {
            title: "🎤 Interview Practice",
            desc: "Practice real interview questions with AI.",
          },
          {
            title: "📉 Skill Gap Insights",
            desc: "Discover missing skills for your target role.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg"
          >
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="text-center py-20 border-t border-white/10">

        <h2 className="text-3xl font-bold">
          Start boosting your career today 🚀
        </h2>

        <p className="text-gray-400 mt-4">
          Join thousands of users improving their job success.
        </p>

        <Link href="/login">
          <button className="mt-8 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
            Get Started
          </button>
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-white/10">
        © 2026 JobBooster AI — Built for job seekers
      </footer>

    </div>
  );
                   }
