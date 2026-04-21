"use client";

import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="space-y-10">

      {/* 🚀 HERO SECTION */}
      <div className="glass p-8 rounded-3xl relative overflow-hidden">

        {/* gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight">
            Build your career with <span className="text-blue-400">AI</span>
          </h1>

          <p className="mt-3 text-gray-400 max-w-xl">
            Analyze resumes, practice interviews, and track your growth — all in one powerful dashboard.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="btn-primary">Start Improving</button>
            <button className="glass px-5 py-2 rounded-lg">View History</button>
          </div>
        </div>
      </div>

      {/* 📊 STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        {[
          { title: "This Week", value: "12", color: "from-blue-500 to-indigo-500" },
          { title: "Growth", value: "+35%", color: "from-green-500 to-emerald-500" },
          { title: "Streak", value: "5 days", color: "from-orange-500 to-yellow-500" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl relative overflow-hidden card-hover"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10`} />

            <div className="relative z-10">
              <p className="text-gray-400">{card.title}</p>
              <h2 className="text-3xl font-bold">{card.value}</h2>
            </div>
          </motion.div>
        ))}

      </div>

      {/* ⚡ FEATURE CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        <FeatureCard
          title="📄 Resume Analyzer"
          desc="Get AI suggestions instantly"
        />

        <FeatureCard
          title="🎤 Interview Practice"
          desc="Practice real interview questions"
        />

        <FeatureCard
          title="📉 Skill Gap"
          desc="Find what you’re missing"
        />

        <FeatureCard
          title="🎯 Job Match"
          desc="Match jobs to your profile"
        />

      </div>

    </div>
  );
}

/* COMPONENT */
function FeatureCard({ title, desc }) {
  return (
    <div className="glass p-6 rounded-2xl card-hover">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-400 mt-2">{desc}</p>
    </div>
  );
    }
