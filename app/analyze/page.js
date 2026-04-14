"use client";

import { useState } from "react";
import Menu from "@/components/Menu";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ text, job }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-6 bg-gray-900 text-white min-h-screen">
        <h1 className="text-2xl mb-4">📄 Resume Analyzer</h1>

        <textarea
          className="w-full p-3 rounded bg-gray-800 mb-3"
          placeholder="Paste Resume..."
          onChange={(e) => setText(e.target.value)}
        />

        <textarea
          className="w-full p-3 rounded bg-gray-800 mb-3"
          placeholder="Paste Job Description (optional)"
          onChange={(e) => setJob(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Analyze
        </button>

        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded">
            <h2 className="text-xl">{result.score}/100</h2>
            <p>{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
  }
