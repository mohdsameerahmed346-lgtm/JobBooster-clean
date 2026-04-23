"use client";

import { useState } from "react";

export default function SkillGap() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) return alert("Upload a resume");

    setLoading(true);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/skillgap", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📄 Resume Analyzer</h1>

      {/* Upload */}
      <div className="glass p-6 rounded-xl space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={analyze}
          className="btn-primary"
        >
          Analyze Resume
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-400">Analyzing...</div>
      )}

      {/* RESULT UI */}
      {data && !data.error && (
        <div className="space-y-6">

          {/* SCORES */}
          <div className="grid grid-cols-2 gap-4">

            <ScoreCard title="Resume Score" value={data.score} />
            <ScoreCard title="ATS Score" value={data.ats} />

          </div>

          {/* STRENGTHS */}
          <Section title="💪 Strengths" items={data.strengths} />

          {/* MISSING */}
          <Section title="📉 Missing Skills" items={data.missing} />

          {/* IMPROVEMENTS */}
          <Section title="🚀 Improvements" items={data.improvements} />

        </div>
      )}

      {/* ERROR */}
      {data?.error && (
        <div className="text-red-400">
          Error: {data.error}
        </div>
      )}

    </div>
  );
}

/* SCORE CARD */
function ScoreCard({ title, value }) {
  return (
    <div className="glass p-6 rounded-xl text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}/100</p>
    </div>
  );
}

/* SECTION */
function Section({ title, items }) {
  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="font-semibold mb-3">{title}</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-300">
        {items?.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
    }
