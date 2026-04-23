"use client";

import { useState } from "react";

export default function SkillGap() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) return alert("Upload a resume");

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/skillgap", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📉 Skill Gap Analyzer</h1>

      {/* Upload */}
      <div className="glass p-6 rounded-xl space-y-4">

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />

        <button
          onClick={analyze}
          className="bg-blue-600 px-5 py-2 rounded"
        >
          Analyze Resume
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-400">Analyzing resume...</div>
      )}

      {/* Result */}
      {result && (
        <div className="glass p-6 rounded-xl whitespace-pre-wrap">
          {result}
        </div>
      )}

    </div>
  );
    }
