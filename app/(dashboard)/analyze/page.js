"use client";

import { useState } from "react";

export default function Analyze() {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);

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

  const rewrite = async () => {
    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        type: "rewrite",
        input: resume,
        isPremium,
      }),
    });

    const data = await res.json();
    setResult(data.result);
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

        <div className="flex gap-3 mt-4">
          <button onClick={analyze} className="btn">
            {loading ? "⏳ Analyzing..." : "Analyze Resume"}
          </button>

          <button onClick={rewrite} className="bg-purple-600 px-5 py-2 rounded-lg">
            ✍️ Improve Resume
          </button>
        </div>
      </div>

      {result && (
        <div className="card whitespace-pre-line">
          <h2 className="text-green-400 mb-2">📊 Analysis Result</h2>
          {result}
        </div>
      )}

    </div>
  );
}
