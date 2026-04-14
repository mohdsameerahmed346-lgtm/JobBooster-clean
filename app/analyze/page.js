"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text) {
      alert("Paste resume first");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-8">
        <h1 className="text-2xl mb-4">Resume Analyzer</h1>

        <textarea
          className="w-full p-4 bg-gray-800 rounded mb-4"
          placeholder="Paste resume..."
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          className="bg-blue-600 px-5 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-6 bg-gray-800 p-5 rounded">
            <h2 className="text-2xl">{result.score}/100</h2>
            <p>{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
  }
