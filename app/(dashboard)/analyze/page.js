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

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-lg mb-3">📄 Resume Analyzer</h2>

        <textarea
          className="w-full p-4 bg-black border border-gray-700 rounded"
          placeholder="Paste your resume..."
          onChange={(e) => setResume(e.target.value)}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={analyze}
            className="bg-blue-600 px-5 py-2 rounded"
          >
            {loading ? "⏳ Analyzing..." : "Analyze Resume"}
          </button>

          <button
            onClick={rewrite}
            className="bg-purple-600 px-5 py-2 rounded"
          >
            ✍️ Improve Resume
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-green-900 to-black p-6 rounded-xl border border-green-700 whitespace-pre-line">
          {result}
        </div>
      )}

    </div>
  );
      }
