"use client";

import { useState } from "react";

export default function Dashboard() {
  const [score, setScore] = useState(72);
  const [skills, setSkills] = useState(["JavaScript", "React"]);
  const [targetRole, setTargetRole] = useState("Frontend Developer");

  // 🔥 SHARE FUNCTION (FIXED)
  const share = () => {
    const text = `I got ${score}% ATS score using JobBoost AI 🚀`;
    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends");
  };

  // 🚀 Improve score
  const improveScore = () => {
    if (score < 95) setScore(score + 5);
  };

  // ➕ Add skill
  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) setSkills([...skills, newSkill]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🚀 JobBoost AI Dashboard</h1>
        <button
          onClick={share}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          🔥 Share Score
        </button>
      </div>

      {/* ATS SCORE CARD */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold">ATS Score</h2>
        <p className="text-4xl font-bold mt-2">{score}%</p>

        <div className="w-full bg-gray-200 h-3 rounded mt-3">
          <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${score}%` }}
          ></div>
        </div>

        <button
          onClick={improveScore}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          Improve Score
        </button>
      </div>

      {/* SKILL GAP SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold">Skill Gap Analysis</h2>
        <p className="text-gray-600 mb-3">
          Target Role: <b>{targetRole}</b>
        </p>

        <ul className="list-disc ml-6 space-y-1">
          {skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <button
          onClick={addSkill}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          ➕ Add Skill
        </button>
      </div>

      {/* INTERVIEW AI SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold">Interview AI</h2>
        <p className="text-gray-600 mb-3">
          Practice common questions for <b>{targetRole}</b>
        </p>

        <button className="bg-purple-500 text-white px-4 py-2 rounded-xl">
          🎤 Start Mock Interview
        </button>
      </div>

      {/* PROGRESS SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">Your Progress</h2>

        <div className="mt-4 space-y-2 text-gray-700">
          <p>✅ Resume Optimized</p>
          <p>📈 Score Improved</p>
          <p>🧠 Skills Added</p>
        </div>
      </div>

    </div>
  );
    }
