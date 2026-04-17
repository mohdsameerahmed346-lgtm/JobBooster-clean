"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const generate = async () => {
    const res = await fetch("/api/interview", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    setQuestions(data.questions || []);
  };

  const evaluate = async () => {
    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        type: "interview",
        role,
        answer,
        isPremium,
      }),
    });

    const data = await res.json();
    setFeedback(data.result);
  };

  return (
    <div className="space-y-6">

      <input
        placeholder="Enter role"
        className="w-full p-3 bg-black border border-gray-700 rounded"
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={generate} className="bg-blue-600 px-4 py-2 rounded">
        Generate Questions
      </button>

      {questions.map((q, i) => (
        <div key={i} className="bg-gray-900 p-4 rounded border border-gray-800">
          {q}
        </div>
      ))}

      {questions.length > 0 && (
        <>
          <textarea
            placeholder="Write your answer..."
            className="w-full p-4 bg-black border border-gray-700 rounded"
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={evaluate} className="bg-green-600 px-4 py-2 rounded">
            Evaluate Answer
          </button>
        </>
      )}

      {feedback && (
        <div className="bg-purple-900 p-4 rounded whitespace-pre-line">
          {feedback}
        </div>
      )}

    </div>
  );
          }
