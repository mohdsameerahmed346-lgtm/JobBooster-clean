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

Analyze the resume and respond clearly in this format:

1. 🔍 Key Issues
- ...

2. ✅ Improvements
- ...

3. 🚀 Action Steps
- ...

Resume:
${text}
`,
        }),
      });

      const data = await res.json();

      // slight delay = feels like AI thinking
      setTimeout(() => {
        setResult(data.result);
        setLoading(false);
      }, 500);

    } catch (err) {
      setResult("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold">📄 Resume Analyzer</h1>

      {/* INPUT */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your resume here..."
        className="w-full p-3 bg-black border border-gray-700 rounded h-40"
      />

      {/* BUTTON */}
      <button
        onClick={analyze}
        className="bg-blue-600 px-5 py-2 rounded"
      >
        Analyze
      </button>

      {/* LOADING */}
      {loading && (
        <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
          🤖 AI is analyzing your resume...
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10">
          <TypingText text={result} />
        </div>
      )}

    </div>
  );
                  }
