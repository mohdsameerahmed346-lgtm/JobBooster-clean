"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧠 ANALYZE FUNCTION
  const handleAnalyze = async () => {
    if (!text) {
      alert("Paste resume first");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      // 💎 CHECK PREMIUM
      const isPremium = localStorage.getItem("premium") === "true";

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          text,
          isPremium,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResult(data.result);

      // 📊 SAVE HISTORY
      const history = JSON.parse(localStorage.getItem("history")) || [];

      history.push({
        score: data.result.score,
        feedback: data.result.feedback,
        date: Date.now(),
      });

      localStorage.setItem("history", JSON.stringify(history));

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-8">
        <h1 className="text-3xl font-semibold mb-6">
          📄 Resume Analyzer
        </h1>

        {/* TEXTAREA */}
        <textarea
          placeholder="Paste your resume here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-4 bg-[#020617] border border-gray-800 rounded-lg mb-4"
        />

        {/* BUTTON */}
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-8 bg-[#020617] border border-gray-800 p-6 rounded-xl">
            <h2 className="text-4xl font-bold text-green-400 mb-3">
              {result.score}/100
            </h2>

            <p className="text-gray-300 mb-4">
              {result.feedback}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div>
                <h3 className="font-semibold mb-2 text-green-400">
                  ✅ Strengths
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.strengths?.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="font-semibold mb-2 text-yellow-400">
                  ⚠️ Weaknesses
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.weaknesses?.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="font-semibold mb-2 text-blue-400">
                  🚀 Improvements
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.improvements?.map((imp, i) => (
                    <li key={i}>• {imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
    }
