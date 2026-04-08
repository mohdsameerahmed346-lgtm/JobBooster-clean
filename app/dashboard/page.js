"use client";

import { useState } from "react";

export default function Dashboard() {
  const [score, setScore] = useState(72);
  const [skills, setSkills] = useState(["JavaScript"]);
  const [targetRole, setTargetRole] = useState("Frontend Developer");

  const [resumeText, setResumeText] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 SHARE FUNCTION (UPDATED)
  const share = async () => {
    const text = `I got ${score}% ATS score using JobBoost AI 🚀`;

    if (navigator.share) {
      await navigator.share({
        title: "JobBoost AI",
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied! Share with friends 🚀");
    }
  };

  // 🚀 DEMO AI (NO BILLING NEEDED)
  const scanResume = async () => {
    setLoading(true);

    setTimeout(() => {
      setAiResult(
        "✅ Add more measurable achievements (e.g., increased performance by 30%).\n" +
        "✅ Improve project descriptions with real impact.\n" +
        "✅ Add keywords like React, APIs, and optimization for ATS."
      );
      setScore(87);
      setLoading(false);
    }, 1500);
  };

  const improveScore = () => {
    if (score < 95) setScore(score + 5);
  };

  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) setSkills([...skills, newSkill]);
  };

  const generateQuestion = () => {
    alert("💡 Example: What is Virtual DOM in React?");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🚀 JobBoost AI Dashboard</h1>
        <button
          onClick={share}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          🔥 Share Score
        </button>
      </div>

      {/* RESUME SCANNER */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">📄 Resume Scanner</h2>

        <textarea
          placeholder="Paste your resume..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full border p-3 rounded mb-3"
          rows={6}
        />

        <button
          onClick={scanResume}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          {loading ? "Analyzing..." : "Scan Resume ⚡"}
        </button>

        {/* AI RESULT */}
        {aiResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="whitespace-pre-line">{aiResult}</p>
          </div>
        )}
      </div>

      {/* ATS SCORE */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold">ATS Score</h2>

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
          Improve Score 🚀
        </button>
      </div>

      {/* SKILL GAP */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Skill Gap</h2>

        <p className="mb-2">Target Role: {targetRole}</p>

        <ul className="list-disc ml-6">
          {skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <button
          onClick={addSkill}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Add Skill ➕
        </button>
      </div>

      {/* INTERVIEW AI */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Interview AI</h2>

        <button
          onClick={generateQuestion}
          className="bg-purple-500 text-white px-4 py-2 rounded-xl"
        >
          Generate Question 🎯
        </button>
      </div>

      {/* PROGRESS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Progress</h2>

        <div className="space-y-2">
          <p>✅ Resume Optimized</p>
          <p>📈 Score Improved</p>
          <p>📚 Skills Added</p>
        </div>
      </div>

      {/* REFERRAL (VIRAL LOOP) */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">🔥 Earn Free Credits</h2>

        <p className="mb-2">Invite friends & unlock premium features</p>

        <p className="mb-3">Referrals: 0/3</p>

        <button className="bg-black text-white px-4 py-2 rounded-xl">
          Invite Friends 🚀
        </button>
      </div>

    </div>
  );
    }
