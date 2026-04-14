"use client";

import { useState } from "react";
import Menu from "@/components/Menu";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generateQuestions = async () => {
    const res = await fetch("/api/interview", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    setQuestions(data.questions);
  };

  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-6 bg-gray-900 text-white min-h-screen">
        <h1 className="text-2xl mb-4">🎤 Interview Questions</h1>

        <input
          placeholder="Enter Job Role"
          className="w-full p-3 rounded bg-gray-800 mb-3"
          onChange={(e) => setRole(e.target.value)}
        />

        <button
          onClick={generateQuestions}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Generate Questions
        </button>

        <ul className="mt-5 space-y-2">
          {questions.map((q, i) => (
            <li key={i} className="bg-gray-800 p-3 rounded">
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
      }
