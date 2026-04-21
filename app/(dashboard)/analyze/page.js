"use client";

import { useState } from "react";
import TypingText from "../../../components/TypingText";
import { saveHistory } from "../../../lib/history";

export default function Analyze() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `
You are a professional resume expert.

Analyze and respond in:

1. 🔍 Issues
2. ✅ Improvements
3. 🚀 Action Steps

Resume:
${text}
`,
        }),
      });

      const data = await res.json();

      // ✅ SAVE HISTORY
      await saveHistory("analyze", text, data.result);

      setTimeout(() => {
        setResult(data.result);
        setLoading(false);
      }, 500);

    } catch {
      setResult("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📄 Resume Analyzer</h1>

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

      {loading && (
        <div className="p-4 bg-white/5 border border-white/10 rounded animate-pulse">
          🤖 AI is analyzing...
        </div>
      )}

      {result && (
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
          <TypingText text={result} />
        </div>
      )}

    </div>
  );
  }
