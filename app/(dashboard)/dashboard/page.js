"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Mic,
  BarChart,
  Target,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Resumes Analyzed",
      value: "120+",
      icon: FileText,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Interviews Practiced",
      value: "80+",
      icon: Mic,
      gradient: "from-pink-500 to-purple-500",
    },
    {
      title: "Skill Reports",
      value: "60+",
      icon: BarChart,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Job Matches",
      value: "45+",
      icon: Target,
      gradient: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-400">
          Track your progress and boost your career with AI 🚀
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 card-hover relative overflow-hidden"
            >
              {/* GRADIENT GLOW */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10`}
              />

              <div className="relative z-10 flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-400">
                    {item.title}
                  </p>
                  <h2 className="text-2xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div className="p-3 rounded-xl bg-white/10">
                  <Icon size={20} />
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FEATURE CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="glass p-6 rounded-2xl card-hover">
          <h2 className="text-lg font-semibold mb-2">📄 Resume Analyzer</h2>
          <p>Improve your resume instantly with AI suggestions.</p>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <h2 className="text-lg font-semibold mb-2">🎤 Interview Practice</h2>
          <p>Practice real interview questions with AI feedback.</p>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <h2 className="text-lg font-semibold mb-2">📉 Skill Gap</h2>
          <p>Discover missing skills and improve your profile.</p>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <h2 className="text-lg font-semibold mb-2">🎯 Job Match</h2>
          <p>Find jobs that match your skills perfectly.</p>
        </div>

      </div>

    </div>
  );
    }
