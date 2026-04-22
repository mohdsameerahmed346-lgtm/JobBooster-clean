"use client";

import { useState } from "react";
import { useAI } from "../../../lib/useAI";
import { saveHistory } from "../../../lib/history";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const { result, loading, generate } = useAI();

  const analyze = async () => {
    if (!text.trim()) {
      alert("Please paste your resume");
      return;
    }

    try {
      await generate(`Analyze this resume and give improvements:\n${text}`);

      // ✅ Save after generation (small delay ensures full text)
      setTimeout(() => {
        if (result) {
          saveHistory("analyze", text, result);
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">📄 Resume Analyzer</h1>
        <p className="text-gray-400">
          Improve your resume with AI insights
        </p>
      </div>

      {/* INPUT */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your resume here..."
        className="w-full p-4 bg-black border border-gray-700 rounded-xl h-40 focus:outline-none focus:border-blue-500"
      />

      {/* BUTTON */}
      <button
        onClick={analyze}
        className="btn-primary px-6 py-2 rounded-lg"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* OUTPUT */}
      {(loading || result) && (
        <div className="glass p-5 rounded-xl whitespace-pre-wrap min-h-[120px]">

          {loading && !result && (
            <span className="animate-pulse text-gray-400">
              🤖 AI is thinking...
            </span>
          )}

          {result}

        </div>
      )}

    </div>
  );
            }
