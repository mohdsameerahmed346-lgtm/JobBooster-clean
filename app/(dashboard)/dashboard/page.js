"use client";

import { useEffect, useState } from "react";
import { getStats, getWeeklyAnalytics, getStreak } from "../../../lib/history";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [weekly, setWeekly] = useState({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const load = async () => {
      const s = await getStats();
      const w = await getWeeklyAnalytics();
      const st = await getStreak();

      setStats(s);
      setWeekly(w);
      setStreak(st);
    };

    load();
  }, []);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">
          Track your AI productivity 🚀
        </p>
      </div>

      {/* MAIN STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <Card title="This Week" value={weekly.thisWeek} />
        <Card title="Last Week" value={weekly.lastWeek} />
        <Card
          title="Growth"
          value={`${weekly.growth || 0}%`}
          highlight
        />

      </div>

      {/* STREAK */}
      <motion.div
        className="glass p-6 rounded-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-lg font-semibold">🔥 Daily Streak</h2>
        <p className="text-3xl font-bold mt-2">
          {streak} days
        </p>
        <p className="text-gray-400 mt-1">
          Keep going! Consistency wins 💪
        </p>
      </motion.div>

      {/* FEATURE USAGE */}
      <div className="grid md:grid-cols-4 gap-6">

        {Object.entries(stats).map(([key, value], i) => (
          <motion.div
            key={key}
            className="glass p-5 rounded-2xl card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-gray-400 capitalize">{key}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
          </motion.div>
        ))}

      </div>

    </div>
  );
}

/* SMALL COMPONENT */
function Card({ title, value, highlight }) {
  return (
    <div
      className={`glass p-6 rounded-2xl text-center ${
        highlight ? "premium-glow" : ""
      }`}
    >
      <p className="text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value || 0}</h2>
    </div>
  );
        }
