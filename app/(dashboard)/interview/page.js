"use client";

import { useState } from "react";
import { isPremium } from "../../../lib/usage";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generate = () => {
    if (!isPremium()) {
      alert("🚫 This feature is Premium only 💎");
      return;
    }

    const qs = [
      "Explain performance optimization",
      "How do you design scalable systems?",
      "REST vs GraphQL?",
      "Debug async code?",
    ];

    setQuestions(qs);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">🎤 Interview Practice</h1>

      <p className="text-sm text-gray-400">
        💎 Premium feature
      </p>

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter role"
        className="w-full p-3 bg-black border border-gray-700 rounded"
      />

      <button
        onClick={generate}
        className="bg-blue-600 px-5 py-2 rounded"
      >
        Generate Questions
      </button>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded">
            {q}
          </div>
        ))}
      </div>

    </div>
  );
}
