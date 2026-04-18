"use client";

import { useState } from "react";
import Skeleton from "../../../components/Skeleton";

export default function JobMatch() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const match = async () => {
    setLoading(true);
    setResult("");

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
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <textarea
        placeholder="Resume"
        className="input"
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        placeholder="Job Description"
        className="input"
        onChange={(e) => setJd(e.target.value)}
      />

      <button onClick={match} className="btn">
        {loading ? "⏳ Matching..." : "Match Job"}
      </button>

      {loading && (
        <div className="card space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {result && !loading && (
        <div className="card whitespace-pre-line">
          {result}
        </div>
      )}

    </div>
  );
  }
