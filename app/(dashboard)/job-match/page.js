"use client";

import { useState } from "react";

export default function JobMatch() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState("");

  const match = async () => {
    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        type: "jobmatch",
        input: resume + "\n\nJob:\n" + jd,
        isPremium,
      }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div className="space-y-6">

      <textarea
        placeholder="Paste Resume"
        className="input"
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        placeholder="Paste Job Description"
        className="input"
        onChange={(e) => setJd(e.target.value)}
      />

      <button onClick={match} className="btn">
        Match Job
      </button>

      {result && (
        <div className="card whitespace-pre-line">
          {result}
        </div>
      )}

    </div>
  );
    }
