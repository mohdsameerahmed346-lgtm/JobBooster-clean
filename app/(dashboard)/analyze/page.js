export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const analyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">📄 Resume Analyzer</h1>

      <textarea
        placeholder="Paste your resume..."
        className="w-full p-4 bg-[#020617] border border-gray-800 rounded mb-4"
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={analyze} className="bg-blue-600 px-6 py-2 rounded">
        Analyze
      </button>

      {result && (
        <div className="mt-6 bg-gray-900 p-5 rounded">
          {result}
        </div>
      )}
    </div>
  );
    }
