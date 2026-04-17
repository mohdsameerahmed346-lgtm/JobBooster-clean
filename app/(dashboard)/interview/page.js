"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";

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

    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ role, answer, isPremium }),
    });

    const data = await res.json();
    setFeedback(data.result);

    await fetch("/api/history", {
      method: "POST",
      body: JSON.stringify({
        type: "interview",
        content: { role, answer, feedback: data.result },
      }),
    });

    setLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* INPUT */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-lg mb-3">🎯 Target Role</h2>

        <input
          placeholder="Enter role"
          className="w-full p-3 bg-black border border-gray-700 rounded"
          onChange={(e) => setRole(e.target.value)}
        />

        <button
          onClick={generate}
          className="mt-4 bg-blue-600 px-5 py-2 rounded hover:scale-105 active:scale-95 transition"
        >
          Generate Questions
        </button>
      </div>

      {/* QUESTIONS */}
      {questions.length > 0 && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
          <h2 className="text-lg mb-2">📋 Interview Questions</h2>

          {questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black p-4 rounded border border-gray-800"
            >
              {q}
            </motion.div>
          ))}
        </div>
      )}

      {/* ANSWER */}
      {questions.length > 0 && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg mb-2">✍️ Your Answer</h2>

          <textarea
            className="w-full p-4 bg-black border border-gray-700 rounded"
            placeholder="Write your answer..."
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={evaluate}
            className="mt-4 bg-green-600 px-5 py-2 rounded hover:scale-105 active:scale-95 transition"
          >
            {loading ? "⏳ AI is analyzing..." : "Evaluate Answer"}
          </button>
        </div>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-purple-900 to-black p-6 rounded-xl border border-purple-700"
        >
          <h2 className="text-lg mb-3">🤖 AI Feedback</h2>

          <div className="text-green-400 font-semibold mb-2">
            {feedback.match(/Score:.*?/)}
          </div>

          <div className="text-gray-300 whitespace-pre-line text-sm">
            {feedback}
          </div>
        </motion.div>
      )}

    </div>
  );
  }
