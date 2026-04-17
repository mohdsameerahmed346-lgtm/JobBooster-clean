"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  const analyze = async () => {
    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        type: "skillgap",
        role,
        isPremium,
      }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div className="space-y-4">

      <input
        placeholder="Enter role"
        className="w-full p-3 bg-black border border-gray-700 rounded"
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={analyze} className="bg-purple-600 px-4 py-2 rounded">
        Analyze Skill Gap
      </button>

      {result && (
        <div className="bg-gray-900 p-4 rounded whitespace-pre-line">
          {result}
        </div>
      )}

    </div>
  );
          }
