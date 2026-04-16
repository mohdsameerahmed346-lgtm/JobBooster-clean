"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    const res = await fetch("/api/interview", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    setQuestions(data.questions || []);
  };

  const evaluate = async () => {
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        role,
        answer,
      }),
    });

    const data = await res.json();
    setFeedback(data.result);

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">🎤 Interview AI Coach</h1>

      <input
        placeholder="Enter role"
        className="w-full p-3 bg-black border border-gray-800 rounded mb-4"
        onChange={(e) => setRole(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-blue-600 px-5 py-2 rounded"
      >
        Generate Questions
      </button>

      {/* QUESTIONS */}
      <div className="mt-6 space-y-4">
        {questions.map((q, i) => (
          <div
            key={i}
            className="bg-gray-900 p-4 rounded border border-gray-800"
          >
            {q}
          </div>
        ))}
      </div>

      {/* ANSWER INPUT */}
      {questions.length > 0 && (
        <>
          <textarea
            placeholder="Write your answer..."
            className="w-full p-4 mt-6 bg-black border border-gray-800 rounded"
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={evaluate}
            className="mt-4 bg-green-600 px-5 py-2 rounded"
          >
            {loading ? "Analyzing..." : "Evaluate Answer"}
          </button>
        </>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <div className="mt-6 bg-gradient-to-br from-purple-900 to-black p-6 rounded-xl border border-purple-700">
          <h2 className="text-xl mb-4">🤖 AI Feedback</h2>

          {/* SCORE */}
          <div className="mb-4 text-green-400 font-semibold">
            {feedback.match(/Score:.*?/)}
          </div>

          {/* FULL TEXT */}
          <div className="text-gray-300 whitespace-pre-line text-sm">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
}
