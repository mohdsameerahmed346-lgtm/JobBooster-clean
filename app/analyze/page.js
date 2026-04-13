"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function AnalyzePage() {
  const [job, setJob] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!job) {
      alert("Enter job role");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ text: job }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setQuestions(data.result?.questions || []);
    } catch (err) {
      console.error(err);
      alert("Error generating questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Menu />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">
          🎯 AI Interview Trainer
        </h1>

        <textarea
          placeholder="Enter job role (Frontend Developer...)"
          value={job}
          onChange={(e) => setJob(e.target.value)}
          className="w-full p-4 bg-slate-900 rounded-lg mb-4"
        />

        <button
          onClick={generate}
          className="bg-indigo-600 px-5 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        <div className="mt-6 space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="bg-slate-900 p-4 rounded">
              {q}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
        }
