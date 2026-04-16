export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generate = async () => {
    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/interview", {
      method: "POST",
      body: JSON.stringify({ role, isPremium }),
    });

    const data = await res.json();
    setQuestions(data.questions || []);
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">🎤 Interview Practice</h1>

      <input
        placeholder="Enter role"
        className="w-full p-3 bg-[#020617] border border-gray-800 rounded mb-4"
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={generate} className="bg-blue-600 px-5 py-2 rounded">
        Generate Questions
      </button>

      <div className="mt-6 space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="bg-gray-900 p-5 rounded">
            {q}
          </div>
        ))}
      </div>
    </div>
  );
    }
