"use client";

import { useState, useEffect } from "react";

export default function JobMatch() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    setPremium(localStorage.getItem("premium") === "true");
  }, []);

  const match = () => {
    setResult("You are 78% match for this role.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">

      <h1 className="text-2xl font-bold">🎯 Job Match</h1>

      <div className={`${!premium ? "blur-sm pointer-events-none" : ""}`}>

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter role"
          className="w-full p-3 bg-black border border-gray-700 rounded"
        />

        <button
          onClick={match}
          className="bg-blue-600 px-5 py-2 rounded mt-3"
        >
          Check Match
        </button>

        {result && (
          <div className="bg-gray-900 p-4 rounded mt-4">
            {result}
          </div>
        )}

      </div>

      {!premium && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
          <button
            onClick={() => {
              localStorage.setItem("premium", "true");
              setPremium(true);
            }}
            className="bg-blue-600 px-6 py-2 rounded"
          >
            Unlock Premium
          </button>
        </div>
      )}

    </div>
  );
            }
