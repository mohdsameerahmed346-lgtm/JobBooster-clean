"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!role) {
      alert("Enter job role");
      return;
    }

    try {
      setLoading(true);
      setQuestions([]);

      const isPremium = localStorage.getItem("premium") === "true";

      const res = await fetch("/api/interview", {
        method: "POST",
        body: JSON.stringify({ role, isPremium }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (question, answer) => {
    if (!answer) return;

    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/evaluate", {
      method: "POST",
      body: JSON.stringify({
        question,
        answer,
        isPremium,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert(`Score: ${data.score}\n${data.feedback}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Menu />

      <div className="md:ml-64 p-6 md:p-8">
        <h1 className="text-3xl font-semibold mb-6">
          🎤 Interview Practice
        </h1>

        {/* INPUT */}
        <input
          placeholder="Enter job role (e.g. Web Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 bg-[#020617] border border-gray-800 rounded-lg mb-4"
        />

        {/* BUTTON */}
        <button
          onClick={generate}
          className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {/* QUESTIONS */}
        <div className="mt-6 space-y-4">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-[#020617] border border-gray-800 p-5 rounded-xl"
            >
              <p className="mb-3 text-gray-300">{q}</p>

              <textarea
                placeholder="Write your answer..."
                className="w-full p-3 bg-gray-800 rounded mb-2"
                onBlur={(e) =>
                  handleEvaluate(q, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  }
