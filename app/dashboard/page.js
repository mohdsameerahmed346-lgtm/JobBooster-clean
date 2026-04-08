"use client";

import { useState } from "react";

export default function Dashboard() {
  const [score, setScore] = useState(72);
  const [skills, setSkills] = useState(["JavaScript"]);
  const [targetRole] = useState("Frontend Developer");
  const [question, setQuestion] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [referrals, setReferrals] = useState(0);

  // 🔥 SHARE SCORE
  const share = () => {
    const text = `I got ${score}% ATS score using JobBoost AI 🚀`;
    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends");
  };

  // 📈 IMPROVE SCORE
  const improveScore = () => {
    if (score < 95) setScore(score + 5);
  };

  // ➕ ADD SKILL
  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) setSkills([...skills, newSkill]);
  };

  // 🤖 INTERVIEW AI
  const generateQuestion = () => {
    const questions = [
      "Explain JavaScript closures",
      "What is React state?",
      "Difference between var, let, const?",
      "How does event loop work?",
      "Tell me about yourself"
    ];

    const random =
      questions[Math.floor(Math.random() * questions.length)];

    setQuestion(random);
  };

  // 📄 RESUME SCANNER
  const scanResume = () => {
    let newScore = score;

    if (resumeText.includes("JavaScript")) newScore += 5;
    if (resumeText.includes("React")) newScore += 5;
    if (resumeText.length > 100) newScore += 5;

    if (newScore > 95) newScore = 95;

    setScore(newScore);
  };

  // 🚀 REFERRAL SYSTEM
  const inviteFriend = () => {
    const link = "https://yourapp.com/?ref=123";

    navigator.clipboard.writeText(link);
    alert("Invite link copied!");

    setReferrals(referrals + 1);
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

      {/* RESUME SCANNER */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold">📄 Resume Scanner</h2>

        <textarea
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full mt-3 p-2 border rounded"
        />

        <button
          onClick={scanResume}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Scan Resume ⚡
        </button>
      </div>

      {/* ATS SCORE */}
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
          Improve Score 🚀
        </button>
      </div>

      {/* SKILL GAP */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold">Skill Gap</h2>

        <p className="text-gray-600 mb-3">
          Target Role: {targetRole}
        </p>

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
        <h2 className="text-lg font-semibold">Interview AI</h2>

        <button
          onClick={generateQuestion}
          className="bg-purple-500 text-white px-4 py-2 rounded-xl"
        >
          Generate Question 🎯
        </button>

        {question && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p>{question}</p>
          </div>
        )}
      </div>

      {/* PROGRESS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold">Your Progress</h2>

        <div className="mt-3 space-y-2">
          <p>✅ Resume Optimized</p>
          <p>📈 Score Improved</p>
          <p>📚 Skills Added</p>
        </div>
      </div>

      {/* REFERRALS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">🔥 Earn Free Credits</h2>

        <p className="text-gray-600">
          Invite friends & unlock premium features
        </p>

        <p className="mt-2 font-bold">
          Referrals: {referrals}/3
        </p>

        <div className="w-full bg-gray-200 h-3 rounded mt-2">
          <div
            className="bg-orange-500 h-3 rounded"
            style={{ width: `${(referrals / 3) * 100}%` }}
          ></div>
        </div>

        <button
          onClick={inviteFriend}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-xl"
        >
          Invite Friends 🚀
        </button>
      </div>

    </div>
  );
      }
