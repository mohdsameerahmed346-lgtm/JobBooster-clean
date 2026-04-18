"use client";

import { useState } from "react";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generate = () => {
    setQuestions([
      "What is your approach to optimizing performance?",
      "How do you handle responsive design?",
      "Explain system design for scalability.",
      "Difference between monolithic & microservices?",
      "How do you debug async code?"
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">🎤 Interview Practice</h1>

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter role (e.g. Web Developer)"
        className="w-full p-3 bg-black border border-gray-700 rounded"
      />

      <button
        onClick={generate}
        className="bg-blue-600 px-5 py-2 rounded"
      >
        Generate Questions
      </button>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded-lg">
            {q}
          </div>
        ))}
      </div>

    </div>
  );
    }
