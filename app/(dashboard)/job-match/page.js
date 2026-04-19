"use client";

import { useState } from "react";
import { isPremium } from "../../../lib/usage";

export default function JobMatch() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  const match = () => {
    if (!isPremium()) {
      alert("🚫 Premium required 💎");
      return;
    }

    setResult("You are 78% match for this role.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">🎯 Job Match</h1>

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter role"
        className="w-full p-3 bg-black border border-gray-700 rounded"
      />

      <button
        onClick={match}
        className="bg-blue-600 px-5 py-2 rounded"
      >
        Check Match
      </button>

      {result && (
        <div className="bg-gray-900 p-4 rounded">
          {result}
        </div>
      )}

    </div>
  );
                                 }
