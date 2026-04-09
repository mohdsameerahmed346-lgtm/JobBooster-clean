"use client";

import { useState } from "react";

export default function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 SHARE FUNCTION
  const share = () => {
    const text = `I improved my resume using JobBoost AI 🚀 Try it here: https://your-vercel-link`;
    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends");
  };

  // 🔥 AI SCAN FUNCTION
  const scanResume = async () => {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ resume: resumeText }),
    });

    const data = await res.json();

    setAiResult(data.result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4">🚀 JobBoost AI Dashboard</h1>

      <button
        onClick={share}
        className="mb-6 bg-black text-white px-4 py-2 rounded"
      >
        🔥 Share Score
      </button>

      {/* RESUME INPUT */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">📄 Resume Scanner</h2>

        <textarea
          className="w-full border p-2 rounded"
          rows="10"
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        <button
          onClick={scanResume}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Scan Resume ⚡"}
        </button>
      </div>

      {/* 🔥 AI RESULT (THIS IS WHAT YOU ASKED) */}
      {aiResult && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">🤖 AI Analysis</h2>

          <pre className="whitespace-pre-wrap text-sm">
            {aiResult}
          </pre>

          {/* SHARE AGAIN AFTER RESULT */}
          <button
            onClick={share}
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            🔥 Share My Result
          </button>
        </div>
      )}

      {/* SKILL GAP */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">📊 Skill Gap</h2>
        <p>Target Role: Frontend Developer</p>
        <ul className="mt-2 list-disc ml-5">
          <li>JavaScript</li>
          <li>React Optimization</li>
          <li>API Handling</li>
        </ul>
      </div>

      {/* INTERVIEW AI */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">🎯 Interview AI</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Generate Question
        </button>
      </div>

      {/* PROGRESS */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">📈 Your Progress</h2>
        <ul>
          <li>✅ Resume Optimized</li>
          <li>📈 Score Improved</li>
          <li>📚 Skills Added</li>
        </ul>
      </div>

      {/* REFERRAL */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">🔥 Earn Free Credits</h2>
        <p>Referrals: 0/3</p>

        <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded">
          Invite Friends 🚀
        </button>
      </div>

    </div>
  );
    }
