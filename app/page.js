"use client";

import Link from "next/link";
import Reveal from "../components/Reveal";
import CursorSpotlight from "../components/CursorSpotlight";
import MagneticButton from "../components/MagneticButton";
import Parallax from "../components/Parallax";

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
    <div className="bg-animated text-white min-h-screen relative overflow-hidden">

      {/* 🌟 GLOBAL EFFECTS */}
      <CursorSpotlight />
      <Parallax />

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 glass sticky top-0 z-50">
        <h1 className="font-bold text-lg">🚀 JobBooster</h1>

        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>

          <MagneticButton>
            <Link href="/signup">Get Started</Link>
          </MagneticButton>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative text-center py-28 px-6 overflow-hidden">

        {/* PARALLAX BLOBS */}
        <div className="parallax absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="parallax absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

        <Reveal>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Land Your Dream Job with{" "}
            <span className="text-blue-400">AI</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 text-gray-400 max-w-xl mx-auto">
            Analyze resumes, practice interviews, and track your growth — all in one powerful platform.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-8 flex justify-center gap-4">
            <MagneticButton>
              <Link href="/signup">Start Free</Link>
            </MagneticButton>

            <Link
              href="/dashboard"
              className="glass px-6 py-2 rounded-lg hover:opacity-80"
            >
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

          {/* FREE */}
          <Reveal>
            <div className="glass p-8 rounded-2xl hover-lift">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="text-3xl font-bold mt-2">₹0</p>
              <p className="text-gray-400 mt-2">Limited usage</p>
            </div>
          </Reveal>

          {/* PREMIUM */}
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
      <section className="py-24 text-center">

        <Reveal>
          <h2 className="text-3xl font-bold">
            Start your AI career journey 🚀
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-6">
            <MagneticButton>
              <Link href="/signup">Get Started</Link>
            </MagneticButton>
          </div>
        </Reveal>

      </section>

    </div>
  );
        }
