"use client";
import { useState } from "react";

export default function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Share function
  const share = () => {
    const text = `I got a high ATS score using JobBoost AI 🚀`;
    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends");
  };

  // ⚡ Scan Resume (AI call)
  const scanResume = async () => {
    if (!resumeText) {
      alert("Please paste your resume first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ resume: resumeText }),
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data); // Debug

      setAiResult(data.result);
    } catch (error) {
      setAiResult("❌ Error connecting to AI");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🔥 Header */}
      <h1 className="text-3xl font-bold mb-4">
        🚀 JobBoost AI Dashboard
      </h1>

      {/* 🔥 Share Button */}
      <button
        onClick={share}
        className="mb-6 px-4 py-2 bg-black text-white rounded"
      >
        🔥 Share Score
      </button>

      {/* 📄 Resume Scanner */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          📄 Resume Scanner
        </h2>

        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume here..."
          className="w-full h-40 p-2 border rounded"
        />

        <button
          onClick={scanResume}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Analyzing..." : "Scan Resume ⚡"}
        </button>

        {/* 🤖 AI Result */}
        {aiResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">AI Analysis</h3>
            <p className="whitespace-pre-line">{aiResult}</p>
          </div>
        )}
      </div>

      {/* 📊 Fake ATS Score (UI only for now) */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">ATS Score</h2>
        <p className="text-3xl font-bold text-green-600">87%</p>
        <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded">
          Improve Score 🚀
        </button>
      </div>

      {/* 🧠 Skill Gap */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Skill Gap</h2>
        <p>Target Role: Frontend Developer</p>
        <ul className="mt-2 list-disc ml-5">
          <li>JavaScript</li>
        </ul>
        <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
          Add Skill ➕
        </button>
      </div>

      {/* 🎯 Interview AI */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Interview AI</h2>
        <button className="px-3 py-1 bg-purple-500 text-white rounded">
          Generate Question 🎯
        </button>
      </div>

      {/* 📈 Progress */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
        <ul>
          <li>✅ Resume Optimized</li>
          <li>📈 Score Improved</li>
          <li>📚 Skills Added</li>
        </ul>
      </div>

      {/* 🔥 Referral */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          🔥 Earn Free Credits
        </h2>
        <p>Invite friends & unlock premium features</p>
        <p className="mt-2">Referrals: 0/3</p>
        <button className="mt-2 px-3 py-1 bg-black text-white rounded">
          Invite Friends 🚀
        </button>
      </div>
    </div>
  );
                  }
