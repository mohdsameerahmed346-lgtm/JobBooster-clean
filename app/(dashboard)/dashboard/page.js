"use client";

import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Welcome back 👋
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-6">

        {[
          { title: "📄 Resume Analyzer", desc: "Improve your resume instantly" },
          { title: "🎤 Interview Practice", desc: "Practice with AI questions" },
          { title: "📉 Skill Gap", desc: "Find missing skills" },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="card cursor-pointer"
          >
            <h2 className="text-lg mb-2">{item.title}</h2>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}

      </div>

    </div>
  );
          }
