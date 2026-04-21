"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="bg-animated text-white min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 glass sticky top-0 z-50">
        <h1 className="font-bold text-lg">🚀 JobBooster</h1>

        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Land Your Dream Job with <span className="text-blue-400">AI</span>
        </motion.h1>

        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Resume analysis, interview coaching, and skill tracking — all powered by AI to boost your career faster.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link href="/signup" className="btn-primary">
            Start for Free
          </Link>
          <Link href="/dashboard" className="glass px-5 py-2 rounded-lg">
            View Demo
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 px-8 py-16 max-w-6xl mx-auto">
        {[
          {
            title: "📄 Resume Analyzer",
            desc: "Improve your resume instantly with AI suggestions.",
          },
          {
            title: "🎤 Interview Practice",
            desc: "Practice real questions with smart feedback.",
          },
          {
            title: "📉 Skill Gap Insights",
            desc: "Discover missing skills and improve faster.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            className="glass p-6 rounded-2xl card-hover"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold">{f.title}</h2>
            <p className="text-gray-400 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
          {[
            "Upload your resume",
            "Get AI insights instantly",
            "Improve and land jobs faster",
          ].map((step, i) => (
            <div key={i} className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold">Step {i + 1}</h3>
              <p className="text-gray-400 mt-2">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold">Pricing</h2>

        <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">

          {/* FREE */}
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-3xl font-bold mt-2">₹0</p>

            <ul className="text-gray-400 mt-4 space-y-2">
              <li>✔ Limited usage</li>
              <li>✔ Basic AI</li>
            </ul>

            <Link href="/signup" className="btn-primary mt-6 inline-block">
              Get Started
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="glass p-8 rounded-2xl border border-blue-500">
            <h3 className="text-xl font-semibold">Premium 💎</h3>
            <p className="text-3xl font-bold mt-2">₹299/mo</p>

            <ul className="text-gray-400 mt-4 space-y-2">
              <li>✔ Unlimited usage</li>
              <li>✔ Smart AI responses</li>
              <li>✔ Priority features</li>
            </ul>

            <Link href="/pricing" className="btn-primary mt-6 inline-block">
              Upgrade
            </Link>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold">What Users Say</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {[
            "This app improved my resume instantly!",
            "Interview practice helped me crack my job.",
            "Best AI tool for job preparation!",
          ].map((t, i) => (
            <div key={i} className="glass p-6 rounded-2xl">
              <p>"{t}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">
          Start your AI career journey today 🚀
        </h2>

        <Link href="/signup" className="btn-primary mt-6 inline-block">
          Get Started for Free
        </Link>
      </section>

    </div>
  );
    }
