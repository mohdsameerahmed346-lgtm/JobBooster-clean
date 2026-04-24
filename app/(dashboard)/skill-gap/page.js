"use client";

import { useState } from "react";
import ScoreCard from "../../../components/ScoreCard";

export default function SkillGap() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) return alert("Upload a resume");

    setLoading(true);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/skill-gap", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error);
        setLoading(false);
        return;
      }

      setData(json);
    } catch {
      alert("Error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📄 Resume Analyzer</h1>

      {/* Upload */}
      <div className="glass p-6 rounded-xl space-y-4">

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <p className="text-yellow-300 text-sm">
          ⚠️ Use text-based PDF (Word/Docs)
        </p>

        <button onClick={analyze} className="btn-primary">
          Analyze Resume
        </button>

      </div>

      {loading && <p>Analyzing...</p>}

      {data && !data.error && (
        <div className="space-y-6">

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4">
            <ScoreCard title="Resume Score" value={data.score} />
            <ScoreCard title="ATS Score" value={data.ats} />
          </div>

          {/* Keywords */}
          <div className="glass p-4 rounded-xl">
            <h2 className="font-semibold mb-2">Missing Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((k, i) => (
                <span key={i} className="bg-red-500/20 px-2 py-1 rounded">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="glass p-4 rounded-xl">
            <h2 className="font-semibold mb-2">Suggestions</h2>
            <p>Skills: {data.sectionFeedback.skills}</p>
            <p>Experience: {data.sectionFeedback.experience}</p>
            <p>Projects: {data.sectionFeedback.projects}</p>
          </div>

        </div>
      )}

    </div>
  );
    }
