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
    <div className="space-y-4">

      <textarea
        placeholder="Paste Resume"
        className="w-full p-3 bg-black border border-gray-700 rounded"
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        placeholder="Paste Job Description"
        className="w-full p-3 bg-black border border-gray-700 rounded"
        onChange={(e) => setJd(e.target.value)}
      />

      <button onClick={match} className="bg-blue-600 px-4 py-2 rounded">
        Match Job
      </button>

      {result && (
        <div className="bg-gray-900 p-4 rounded whitespace-pre-line">
          {result}
        </div>
      )}

    </div>
  );
    }
