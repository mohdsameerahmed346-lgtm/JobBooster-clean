"use client";

import { useState } from "react";
import Skeleton from "@/components/Skeleton";

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult("");

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
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <input
        placeholder="Enter role"
        className="input"
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={analyze} className="btn">
        {loading ? "⏳ Analyzing..." : "Analyze Skill Gap"}
      </button>

      {loading && (
        <div className="card space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {result && !loading && (
        <div className="card whitespace-pre-line">
          {result}
        </div>
      )}

    </div>
  );
          }
