"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [data, setData] = useState(null);

  const analyze = async () => {
    const res = await fetch("/api/skill-gap", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const result = await res.json();
    setData(result);
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">📉 Skill Gap</h1>

      <input
        placeholder="Enter role"
        className="w-full p-3 bg-black border border-gray-800 rounded mb-4"
        onChange={(e) => setRole(e.target.value)}
      />

      <button
        onClick={analyze}
        className="bg-purple-600 px-5 py-2 rounded"
      >
        Analyze
      </button>

      {data && (
        <div className="mt-6 space-y-4">

          <div className="bg-gray-900 p-4 rounded">
            <h2 className="text-lg mb-2">📉 Missing Skills</h2>
            <p>{data.missingSkills}</p>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <h2 className="text-lg mb-2">📚 Learning Plan</h2>
            <p>{data.learningPlan}</p>
          </div>

        </div>
      )}
    </div>
  );
    }
