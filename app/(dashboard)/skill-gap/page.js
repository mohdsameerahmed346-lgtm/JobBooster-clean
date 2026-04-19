"use client";

import { useState } from "react";
import { isPremium } from "../../../lib/usage";

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  const check = () => {
    const res = "You should improve React, System Design, and APIs.";
    setResult(res);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">

      <h1 className="text-2xl font-bold">📉 Skill Gap Analysis</h1>

      <p className="text-sm text-gray-400">
        💎 Premium feature
      </p>

      {/* CONTENT */}
      <div className={`${!isPremium() ? "blur-sm pointer-events-none" : ""}`}>

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter your target role"
          className="w-full p-3 bg-black border border-gray-700 rounded"
        />

        <button
          onClick={check}
          className="bg-blue-600 px-5 py-2 rounded mt-3"
        >
          Analyze Skill Gap
        </button>

        {result && (
          <div className="bg-gray-900 p-4 rounded mt-4">
            {result}
          </div>
        )}

      </div>

      {/* 🔒 OVERLAY */}
      {!isPremium() && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">

          <h2 className="text-lg mb-2">💎 Premium Feature</h2>

          <p className="text-sm text-gray-400 mb-4 text-center px-6">
            Unlock skill gap insights to improve your career
          </p>

          <button
            onClick={() => {
              localStorage.setItem("premium", "true");
              alert("Premium Activated 💎");
            }}
            className="bg-blue-600 px-6 py-2 rounded hover:scale-105 transition"
          >
            Upgrade Now
          </button>

        </div>
      )}

    </div>
  );
    }
