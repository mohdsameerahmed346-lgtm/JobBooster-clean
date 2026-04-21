"use client";

import { useState } from "react";
import TypingText from "../../../components/TypingText";
import { saveHistory } from "../../../lib/history";

export default function Interview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!role) return;

    setLoading(true);
    setQuestions([]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Give 5 professional interview questions for ${role}`,
        }),
      });

      const data = await res.json();

      // ✅ SAVE HISTORY
      await saveHistory("interview", role, data.result);

      const list = data.result.split("\n").filter(Boolean);
      setQuestions(list);

    } catch {
      alert("Error generating questions");
    }

    setLoading(false);
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

      <button
        onClick={generate}
        className="bg-blue-600 px-5 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      <div className="space-y-4 mt-4">
        {questions.map((q, i) => (
          <div
            key={i}
            className="p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <TypingText text={q} speed={15} />
          </div>
        ))}
      </div>

    </div>
  );
        }
