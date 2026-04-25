"use client";

import { useState, useEffect } from "react";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function JobMatch() {
  const [user, setUser] = useState(null);
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, []);

  const analyze = async () => {
    if (!job.trim()) return alert("Job description required");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("job", job);

    if (file) formData.append("file", file);
    if (user) formData.append("userId", user.uid);

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

      <h1 className="text-2xl font-bold">Resume Analyzer</h1>

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

      <button onClick={analyze} className="btn-primary">
        Analyze
      </button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div className="space-y-4">

          <div className="card">
            <h2>Match: {result.matchPercentage}%</h2>
            <p>Resume Score: {result.resumeScore}</p>
            <p>ATS Score: {result.atsScore}</p>
          </div>

          <div className="card">
            <h3>Missing Skills</h3>
            <p>{result.missingSkills.join(", ")}</p>
          </div>

          <div className="card">
            <h3>Suggestions</h3>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
