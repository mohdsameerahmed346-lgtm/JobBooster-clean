"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generateQuestions = async () => {
    const res = await fetch("/api/interview", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    setQuestions(data.questions || []);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-8">
        <h1 className="text-3xl mb-6">🎤 Interview Practice</h1>

        <input
          placeholder="Enter job role (e.g. Frontend Developer)"
          className="w-full p-3 bg-gray-800 rounded mb-4"
          onChange={(e) => setRole(e.target.value)}
        />

        <button
          onClick={generateQuestions}
          className="bg-blue-600 px-5 py-2 rounded"
        >
          Generate Questions
        </button>

        <div className="mt-6 space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded">
              {q}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    }
