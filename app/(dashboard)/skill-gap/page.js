"use client";

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
    <div className="space-y-6">

      <input
        placeholder="Enter role"
        className="input"
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={analyze} className="btn">
        Analyze Skill Gap
      </button>

      {result && (
        <div className="card whitespace-pre-line">
          {result}
        </div>
      )}

    </div>
  );
          }
