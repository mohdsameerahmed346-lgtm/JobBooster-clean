"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import ScoreCircle from "../../../components/ScoreCircle";
import SkillTags from "../../../components/SkillTags";
import MatchChart from "../../../components/MatchChart";

export default function JobMatch() {
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!job.trim()) return alert("Job required");

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
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">AI Resume Analyzer</h1>

      {/* INPUT */}
      <motion.div className="card space-y-4">
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
      </motion.div>

      {loading && <p>Analyzing...</p>}

      {/* RESULT */}
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >

          {/* SCORES */}
          <div className="grid md:grid-cols-4 gap-6">

            <ScoreCircle value={result.matchPercentage} label="Match" />
            <ScoreCircle value={result.resumeScore} label="Resume" />
            <ScoreCircle value={result.atsScore} label="ATS" />

            <div className="card">
              <MatchChart match={result.matchPercentage} />
            </div>

          </div>

          {/* SKILLS */}
          <div className="card">
            <h3 className="mb-3">Matched Skills</h3>
            <SkillTags items={result.matchedSkills} type="good" />
          </div>

          <div className="card">
            <h3 className="mb-3">Missing Skills</h3>
            <SkillTags items={result.missingSkills} type="bad" />
          </div>

          {/* SUGGESTIONS */}
          <div className="card">
            <h3>Suggestions</h3>
            <ul className="list-disc pl-5 text-gray-300">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* REWRITE */}
          <div className="card">
            <h3>AI Rewrite</h3>
            <p><strong>Summary:</strong> {result.rewriteSuggestions.summary}</p>
            <p><strong>Experience:</strong> {result.rewriteSuggestions.experience}</p>
            <p><strong>Skills:</strong> {result.rewriteSuggestions.skills}</p>
          </div>

        </motion.div>
      )}
    </div>
  );
    }
