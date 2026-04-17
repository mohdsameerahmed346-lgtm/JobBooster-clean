"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("/api/skill-gap", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const result = await res.json();
    setData(result);

    setLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* INPUT */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-lg mb-3">🎯 Target Role</h2>

        <input
          placeholder="Enter role"
          className="w-full p-3 bg-black border border-gray-700 rounded"
          onChange={(e) => setRole(e.target.value)}
        />

        <button
          onClick={analyze}
          className="mt-4 bg-purple-600 px-5 py-2 rounded hover:scale-105 active:scale-95 transition"
        >
          {loading ? "⏳ AI is analyzing..." : "Analyze"}
        </button>
      </div>

      {/* OUTPUT */}
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <h2 className="text-lg mb-2">📉 Missing Skills</h2>
            <p className="text-gray-300">{data.missingSkills}</p>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <h2 className="text-lg mb-2">📚 Learning Plan</h2>
            <p className="text-gray-300">{data.learningPlan}</p>
          </div>

        </motion.div>
      )}

    </div>
  );
    }
