"use client";

import { useState } from "react";
import { auth } from "../../../lib/firebase";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generate = async () => {
    const qs = [
      "Explain performance optimization",
      "How do you design scalable systems?",
      "Difference between REST & GraphQL?",
      "How to handle async debugging?",
    ];

    setQuestions(qs);

    // 🔥 SAVE TO FIRESTORE
    await fetch("/api/history", {
      method: "POST",
      body: JSON.stringify({
        userId: auth.currentUser?.uid,
        type: "interview",
        content: role,
      }),
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🎤 Interview Practice</h1>

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter role"
        className="w-full p-3 bg-black border border-gray-700 rounded"
      />

      <button onClick={generate} className="bg-blue-600 px-5 py-2 rounded">
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
