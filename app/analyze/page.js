"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ text, isPremium: false }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-8">
        <h1 className="text-2xl font-semibold mb-6">Resume Analyzer</h1>

        <textarea
          className="w-full bg-[#020617] border border-gray-800 p-4 rounded-lg mb-4"
          placeholder="Paste your resume..."
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {result && (
          <div className="mt-6 bg-[#020617] border border-gray-800 p-6 rounded-xl">
            <h2 className="text-3xl font-bold text-green-400">
              {result.score}/100
            </h2>
            <p className="mt-2 text-gray-300">{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
            }
