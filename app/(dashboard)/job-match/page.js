"use client";

import { useState } from "react";

export default function JobMatch() {
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!job.trim()) return alert("Job description required");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("job", job);
    if (file) formData.append("file", file);

    const res = await fetch("/api/job-match", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">AI Resume Analyzer</h1>

      {/* INPUT */}
      <textarea
        value={job}
        onChange={(e) => setJob(e.target.value)}
        rows={6}
        placeholder="Paste job description..."
        className="w-full p-3 bg-black border border-gray-700 rounded"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={analyze}
        className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded"
      >
        Analyze
      </button>

      {loading && <p>Analyzing...</p>}

      {/* RESULT */}
      {result && (
        <div className="space-y-6">

          {/* SCORES */}
          <div className="grid grid-cols-3 gap-4">
            <Card title="Match %" value={result.matchPercentage} />
            <Card title="Resume Score" value={result.resumeScore} />
            <Card title="ATS Score" value={result.atsScore} />
          </div>

          {/* SKILLS */}
          <Section title="Matched Skills" items={result.matchedSkills} color="green" />
          <Section title="Missing Skills" items={result.missingSkills} color="red" />

          {/* SUGGESTIONS */}
          <div className="card">
            <h3>Suggestions</h3>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* REWRITE */}
          <div className="card">
            <h3>AI Rewrite Suggestions</h3>

            <p><strong>Summary:</strong> {result.rewriteSuggestions.summary}</p>
            <p><strong>Experience:</strong> {result.rewriteSuggestions.experience}</p>
            <p><strong>Skills:</strong> {result.rewriteSuggestions.skills}</p>
          </div>

        </div>
      )}
    </div>
  );
}

// 🔹 COMPONENTS

function Card({ title, value }) {
  return (
    <div className="p-4 bg-[#020617] border border-gray-800 rounded text-center">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function Section({ title, items, color }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((i, idx) => (
          <span
            key={idx}
            className={`px-3 py-1 rounded text-sm ${
              color === "green"
                ? "bg-green-500/20"
                : "bg-red-500/20"
            }`}
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
    }
