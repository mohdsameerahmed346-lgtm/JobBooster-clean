"use client";

import { useState } from "react";
import Skeleton from "@/components/Skeleton";

export default function Analyze() {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult("");

    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        type: "score",
        input: resume,
        isPremium,
      }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <div className="card">
        <h2 className="text-lg mb-3">📄 Resume Analyzer</h2>

        <textarea
          className="input"
          placeholder="Paste your resume..."
          onChange={(e) => setResume(e.target.value)}
        />

        <button onClick={analyze} className="btn mt-4">
          {loading ? "⏳ Processing..." : "Analyze Resume"}
        </button>
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="card space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {/* RESULT */}
      {result && !loading && (
        <div className="card whitespace-pre-line">
          <h2 className="text-green-400 mb-2">📊 Analysis Result</h2>
          {result}
        </div>
      )}

    </div>
  );
    }
