"use client";

import { useState } from "react";
import { canUseAnalyze, increaseUsage } from "../../../lib/usage";
import { saveHistory } from "../../../lib/history";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const analyze = async () => {
  const res = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify({
      prompt: `Analyze this resume: ${text}`,
    }),
  });

  const data = await res.json();

  setResult(data.result);
};

    increaseUsage("analyze");

    const res = "Your resume is good, but improve keywords and formatting.";
    setResult(res);

    await saveHistory("analyze", text, res);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📄 Resume Analyzer</h1>

      <p className="text-sm text-gray-400">
        🆓 Free: Only 3 lifetime uses
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your resume..."
        className="w-full p-3 bg-black border border-gray-700 rounded h-40"
      />

      <button
        onClick={analyze}
        className="bg-blue-600 px-5 py-2 rounded"
      >
        Analyze
      </button>

      {result && (
        <div className="bg-gray-900 p-4 rounded">
          {result}
        </div>
      )}

    </div>
  );
    }
