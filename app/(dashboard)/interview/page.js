"use client";

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
        className="input"
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={generate} className="btn">
        Generate Questions
      </button>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="card">{q}</div>
        ))}
      </div>

      {questions.length > 0 && (
        <>
          <textarea
            placeholder="Write your answer..."
            className="input"
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={evaluate} className="bg-green-600 px-5 py-2 rounded-lg">
            Evaluate Answer
          </button>
        </>
      )}

      {feedback && (
        <div className="card bg-purple-900/30 border-purple-700 whitespace-pre-line">
          {feedback}
        </div>
      )}

    </div>
  );
    }
