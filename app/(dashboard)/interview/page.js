"use client";

import { useState } from "react";
import Skeleton from "@/components/Skeleton";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setQuestions([]);

    const res = await fetch("/api/interview", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    setQuestions(data.questions || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <input
        placeholder="Enter role"
        className="input"
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={generate} className="btn">
        {loading ? "⏳ Generating..." : "Generate Questions"}
      </button>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {/* QUESTIONS */}
      {!loading &&
        questions.map((q, i) => (
          <div key={i} className="card">{q}</div>
        ))}

    </div>
  );
    }
