"use client";

import { useEffect, useState } from "react";
import { getStats } from "../../../lib/history";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    analyze: 0,
    interview: 0,
    skill: 0,
    job: 0,
  });

  useEffect(() => {
    const load = async () => {
      const data = await getStats();
      setStats(data);
    };
    load();
  }, []);

  const chartData = [
    { name: "Analyze", value: stats.analyze },
    { name: "Interview", value: stats.interview },
    { name: "Skill", value: stats.skill },
    { name: "Job", value: stats.job },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">
          Your real AI usage insights 📊
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">

        {Object.entries(stats).map(([key, value], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-5 rounded-2xl card-hover"
          >
            <p className="text-gray-400 capitalize">{key}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
          </motion.div>
        ))}

      </div>

      {/* CHART */}
      <div className="glass p-6 rounded-2xl">

        <h2 className="mb-4 font-semibold">Usage Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
     }
