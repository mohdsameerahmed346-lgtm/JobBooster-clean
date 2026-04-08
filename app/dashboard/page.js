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
  const share = () => {
    const text = `🚀 I got ${score}% ATS score using JobBoost AI!\nTry it here: https://job-booster-clean.vercel.app`;

    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends 🔥");
  };

  // 🚀 IMPROVE SCORE
  const improveScore = () => {
    if (score < 95) setScore(score + 5);
  };

  // ➕ ADD SKILL
  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) setSkills([...skills, newSkill]);
  };

  // 🤖 AI RESUME SCAN
  const scanResume = async () => {
    if (!resumeText) {
      alert("Paste resume first!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume: resumeText }),
      });

      const data = await res.json();
      setAiResult(data.result);
    } catch (err) {
      setAiResult("❌ Error analyzing resume.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🚀 JobBoost AI</h1>
        <button
          onClick={share}
          className="bg-black text-white px-4 py-2 rounded-xl shadow"
        >
          🔥 Share Score
        </button>
      </div>

      {/* RESUME SCANNER */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">📄 Resume Scanner</h2>

        <textarea
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full p-3 border rounded mb-3"
          rows={6}
        />

        <button
          onClick={scanResume}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          {loading ? "Analyzing..." : "Scan Resume ⚡"}
        </button>

        {/* AI RESULT */}
        {aiResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-xl">
            <h3 className="font-semibold mb-2">🤖 AI Analysis</h3>
            <p>{aiResult}</p>
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
        <h2 className="text-xl font-semibold">Skill Gap</h2>
        <p className="text-gray-600 mb-3">Target Role: {targetRole}</p>

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
        <h2 className="text-xl font-semibold">Interview AI</h2>
        <p className="text-gray-600 mb-3">
          Practice questions for {targetRole}
        </p>

        <button className="bg-purple-500 text-white px-4 py-2 rounded-xl">
          Generate Question 🎯
        </button>
      </div>

      {/* PROGRESS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold">Your Progress</h2>

        <div className="mt-3 space-y-2">
          <p>✅ Resume Optimized</p>
          <p>📈 Score Improved</p>
          <p>📚 Skills Added</p>
        </div>
      </div>

      {/* REFERRAL */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">🔥 Earn Free Credits</h2>
        <p className="text-gray-600 mb-2">
          Invite friends & unlock premium features
        </p>

        <p className="font-semibold">Referrals: 0/3</p>

        <button className="mt-3 bg-black text-white px-4 py-2 rounded-xl">
          Invite Friends 🚀
        </button>
      </div>

    </div>
  );
  }
