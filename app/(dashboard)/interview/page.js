"use client";

import { useState } from "react";
import { isPremium } from "../../../lib/usage";
import { saveHistory } from "../../../lib/history";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generate = async () => {
    const qs = [
      "Explain performance optimization",
      "How do you design scalable systems?",
      "REST vs GraphQL?",
      "Debug async code?",
    ];

    setQuestions(qs);

    await saveHistory("interview", role, qs.join("\n"));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">

      <h1 className="text-2xl font-bold">🎤 Interview Practice</h1>

      <p className="text-sm text-gray-400">
        💎 Premium feature
      </p>

      {/* BLURRED CONTENT */}
      <div className={`${!isPremium() ? "blur-sm pointer-events-none" : ""}`}>

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter role"
          className="w-full p-3 bg-black border border-gray-700 rounded"
        />

        <button
          onClick={generate}
          className="bg-blue-600 px-5 py-2 rounded mt-3"
        >
          Generate Questions
        </button>

        <div className="space-y-3 mt-4">
          {questions.map((q, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded">
              {q}
            </div>
          ))}
        </div>

      </div>

      {/* 🔒 PREMIUM OVERLAY */}
      {!isPremium() && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">

          <h2 className="text-lg mb-2">💎 Premium Feature</h2>

          <p className="text-sm text-gray-400 mb-4 text-center px-6">
            Upgrade to unlock interview questions
          </p>

          <button
            onClick={() => {
              localStorage.setItem("premium", "true");
              alert("Premium Activated 💎");
            }}
            className="bg-blue-600 px-6 py-2 rounded"
          >
            Upgrade Now
          </button>

        </div>
      )}

    </div>
  );
         }
