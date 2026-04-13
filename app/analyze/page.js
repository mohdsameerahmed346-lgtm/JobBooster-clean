"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function AnalyzePage() {
  const [mode, setMode] = useState("resume");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) {
      alert("Enter input");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ mode, text: input }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Menu />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-6">
          🧠 AI Job Toolkit
        </h1>

        {/* MODE SWITCH */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => setMode("resume")} className="bg-slate-800 px-4 py-2 rounded">
            Resume Analysis
          </button>

          <button onClick={() => setMode("interview")} className="bg-slate-800 px-4 py-2 rounded">
            Interview Questions
          </button>

          <button onClick={() => setMode("improve")} className="bg-slate-800 px-4 py-2 rounded">
            Improve Bullet
          </button>
        </div>

        {/* INPUT */}
        <textarea
          placeholder={
            mode === "resume"
              ? "Paste your resume..."
              : mode === "interview"
              ? "Enter job role..."
              : "Paste resume bullet..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 bg-slate-900 rounded-lg mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 px-5 py-2 rounded"
        >
          {loading ? "Processing..." : "Run AI"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6 bg-slate-900 p-5 rounded-lg">
            {/* Resume */}
            {mode === "resume" && (
              <>
                <h2 className="text-xl">{result.score}/100</h2>
                <p>{result.feedback}</p>

                <h3>✅ Strengths</h3>
                <ul>{result.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>

                <h3>⚠️ Weaknesses</h3>
                <ul>{result.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}</ul>

                <h3>🚀 Improvements</h3>
                <ul>{result.improvements?.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
              </>
            )}

            {/* Interview */}
            {mode === "interview" && (
              <>
                <h2>🎯 Questions</h2>
                <ul>{result.questions?.map((q, i) => <li key={i}>{q}</li>)}</ul>
              </>
            )}

            {/* Improve */}
            {mode === "improve" && (
              <>
                <h2>✨ Improved Version</h2>
                <p>{result.improved}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
    }
