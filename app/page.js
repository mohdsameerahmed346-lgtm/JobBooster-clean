"use client";

import Link from "next/link";
import Reveal from "../components/Reveal";

export default function LandingPage() {
  const features = [
    {
      title: "📄 Resume Analyzer",
      desc: "Improve your resume instantly with AI suggestions.",
    },
    {
      title: "🎤 Interview Practice",
      desc: "Practice real interview questions with smart feedback.",
    },
    {
      title: "📉 Skill Gap",
      desc: "Discover missing skills and improve faster.",
    },
  ];

  return (
    <div className="bg-animated text-white min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 glass sticky top-0 z-50">
        <h1 className="font-bold text-lg">🚀 JobBooster</h1>

        <div className="flex gap-6">
          <Link href="/login">Login</Link>
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative text-center py-24 px-6 overflow-hidden">

        <div className="blur-bg top-10 left-10" />

        <Reveal>
          <h1 className="text-5xl font-bold leading-tight">
            Land Your Dream Job with{" "}
            <span className="text-blue-400">AI</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Analyze resumes, practice interviews, and track your career growth.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/signup" className="btn-primary">
              Start Free
            </Link>
            <Link href="/dashboard" className="glass px-5 py-2 rounded-lg">
              View Demo
            </Link>
          </div>
        </Reveal>

      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 px-8 py-20 max-w-6xl mx-auto">

        {features.map((f, i) => (
          <Reveal key={i} delay={i * 0.15}>
            <div className="glass p-6 rounded-2xl hover-lift">
              <h2 className="text-lg font-semibold">{f.title}</h2>
              <p className="text-gray-400 mt-2">{f.desc}</p>
            </div>
          </Reveal>
        ))}

      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 text-center">

        <Reveal>
          <h2 className="text-3xl font-bold">How It Works</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">

          {["Upload Resume", "Get AI Insights", "Improve & Apply"].map(
            (step, i) => (
              <Reveal key={i} delay={i * 0.2}>
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold">
                    Step {i + 1}
                  </h3>
                  <p className="text-gray-400 mt-2">{step}</p>
                </div>
              </Reveal>
            )
          )}

        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-6 text-center">

        <Reveal>
          <h2 className="text-3xl font-bold">Pricing</h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">

          <Reveal>
            <div className="glass p-8 rounded-2xl hover-lift">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="text-3xl font-bold mt-2">₹0</p>
              <p className="text-gray-400 mt-2">Limited usage</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass p-8 rounded-2xl border border-blue-500 hover-lift relative overflow-hidden">

              <div className="blur-bg top-0 right-0" />

              <h3 className="text-xl font-semibold">
                Premium 💎
              </h3>
              <p className="text-3xl font-bold mt-2">
                ₹299/mo
              </p>
              <p className="text-gray-400 mt-2">
                Unlimited + Smart AI
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 text-center">

        <Reveal>
          <h2 className="text-3xl font-bold">What Users Say</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">

          {[
            "This improved my resume instantly!",
            "I cracked my interview using this!",
            "Best AI job tool!",
          ].map((t, i) => (
            <Reveal key={i} delay={i * 0.2}>
              <div className="glass p-6 rounded-2xl">
                "{t}"
              </div>
            </Reveal>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">

        <Reveal>
          <h2 className="text-3xl font-bold">
            Start your journey today 🚀
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <Link href="/signup" className="btn-primary mt-6 inline-block">
            Get Started
          </Link>
        </Reveal>

      </section>

    </div>
  );
        }
