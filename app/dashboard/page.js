import { useState } from "react";

export default function Dashboard() { const [score, setScore] = useState(72); const [skills, setSkills] = useState(["JavaScript", "React"]); const [targetRole, setTargetRole] = useState("Frontend Developer");

const share = () => { const text = I got ${score}% ATS score using JobBoost AI 🚀; navigator.clipboard.writeText(text); alert("Copied! Share with friends"); };

const improveScore = () => { if (score < 95) setScore(score + 5); };

const addSkill = () => { const newSkill = prompt("Enter new skill:"); if (newSkill) setSkills([...skills, newSkill]); };

return ( <div className="min-h-screen bg-gray-100 p-6"> {/* Header */} <div className="flex justify-between items-center mb-6"> <h1 className="text-2xl font-bold">🚀 JobBoost Dashboard</h1> <button
onClick={share}
className="bg-black text-white px-4 py-2 rounded-xl"
> 🔥 Share Score </button> </div>

{/* ATS Score Card */}
  <div className="bg-white p-6 rounded-2xl shadow mb-6">
    <h2 className="text-lg font-semibold">ATS Score</h2>
    <p className="text-4xl font-bold mt-2">{score}%</p>
    <div className="w-full bg-gray-200 h-3 rounded mt-3">
      <div
        className="bg-green-500 h-3 rounded"
        style={{ width: `${score}%` }}
      />
    </div>
    <button
      onClick={improveScore}
      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-xl"
    >
      Improve Score
    </button>
  </div>

  {/* Skill Gap Section */}
  <div className="bg-white p-6 rounded-2xl shadow mb-6">
    <h2 className="text-lg font-semibold">Skill Gap</h2>
    <p className="text-sm text-gray-500 mb-3">
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
      + Add Skill
    </button>
  </div>

  {/* Interview AI Section */}
  <div className="bg-white p-6 rounded-2xl shadow mb-6">
    <h2 className="text-lg font-semibold">Interview AI</h2>
    <p className="text-gray-600 mb-3">
      Practice common questions for {targetRole}
    </p>
    <button className="bg-purple-500 text-white px-4 py-2 rounded-xl">
      Start Mock Interview
    </button>
  </div>

  {/* Progress Section */}
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold">Your Progress</h2>
    <div className="mt-4 space-y-2">
      <p>📄 Resume Optimized</p>
      <p>📊 Score Improved</p>
      <p>🎯 Skills Added</p>
    </div>
  </div>
</div>

); }
