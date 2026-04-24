"use client";

import { useState } from "react";

export default function JobMatch() {
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!job.trim()) {
      alert("Job description required");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("job", job);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Job Match Analyzer</h1>

      {/* JOB */}
      <textarea
        value={job}
        onChange={(e) => setJob(e.target.value)}
        rows={6}
        placeholder="Paste job description..."
        className="w-full p-3 bg-black border border-gray-700 rounded"
      />

      {/* FILE */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <p className="text-yellow-400 text-xs">
        Use simple PDF (Word/Docs). Canva/scanned resumes may fail.
      </p>

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

          <div className="p-6 bg-[#020617] border border-gray-800 rounded">
            <h2 className="text-2xl">{result.matchPercentage}% Match</h2>
          </div>

          <div>
            <h3>Matched Skills</h3>
            {result.matchedSkills?.join(", ")}
          </div>

          <div>
            <h3>Missing Skills</h3>
            {result.missingSkills?.join(", ")}
          </div>

          <div>
            <h3>Suggestions</h3>
            <ul>
              {result.suggestions?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
    }
