"use client";

import { useState } from "react";

export default function JobMatch() {
  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!job.trim()) {
      alert("Job description is required");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job, skills }),
      });

      const data = await res.json();

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Job Match Analyzer</h1>

      {/* JOB DESCRIPTION */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Job Description *</label>
        <textarea
          value={job}
          onChange={(e) => setJob(e.target.value)}
          rows={6}
          className="w-full p-3 bg-black border border-gray-700 rounded"
          placeholder="Paste job description..."
        />
      </div>

      {/* SKILLS */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">
          Your Skills / Resume (optional)
        </label>
        <textarea
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          rows={5}
          className="w-full p-3 bg-black border border-gray-700 rounded"
          placeholder="e.g. React, Node.js, MongoDB..."
        />
      </div>

      <button
        onClick={analyze}
        className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded"
      >
        Analyze Match
      </button>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Analyzing...</p>}

      {/* RESULT */}
      {result && (
        <div className="space-y-6">

          {/* MATCH % */}
          <div className="p-6 bg-[#020617] border border-gray-800 rounded-xl">
            <p className="text-sm text-gray-400">Match Score</p>
            <h2 className="text-3xl font-bold">{result.matchPercentage}%</h2>
          </div>

          {/* MATCHED */}
          <div className="p-6 bg-[#020617] border border-gray-800 rounded-xl">
            <h3 className="mb-3 font-semibold">Matched Skills</h3>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills?.map((s, i) => (
                <span key={i} className="bg-green-500/20 px-3 py-1 rounded text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* MISSING */}
          <div className="p-6 bg-[#020617] border border-gray-800 rounded-xl">
            <h3 className="mb-3 font-semibold">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills?.map((s, i) => (
                <span key={i} className="bg-red-500/20 px-3 py-1 rounded text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="p-6 bg-[#020617] border border-gray-800 rounded-xl">
            <h3 className="mb-3 font-semibold">Suggestions</h3>
            <ul className="list-disc pl-5 text-sm text-gray-300">
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
