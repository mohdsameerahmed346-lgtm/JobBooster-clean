"use client";

import { useState } from "react";
import TypingText from "../../../components/TypingText";

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

Analyze this resume and respond in:

1. 🔍 Issues
2. ✅ Improvements
3. 🚀 Action Steps

Resume:
${text}
`,
        }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("Something went wrong.");
    }

    setLoading(false);
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
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10">
          <TypingText text={result} />
        </div>
      )}

    </div>
  );
      }
