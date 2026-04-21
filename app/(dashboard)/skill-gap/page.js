"use client";

import { useState, useEffect } from "react";

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load premium status
  useEffect(() => {
    setPremium(localStorage.getItem("premium") === "true");
  }, []);

  // ✅ AI CALL
  const check = async () => {
    if (!role) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `You are a career coach.

List the missing skills for a ${role} role.
Also suggest how to improve.

Keep it clear and actionable.`,
        }),
      });

      const data = await res.json();
      setResult(data.result);

    } catch (err) {
      setResult("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">

      <h1 className="text-2xl font-bold">📉 Skill Gap Analysis</h1>

      {/* MAIN CONTENT */}
      <div className={`${!premium ? "blur-sm pointer-events-none" : ""}`}>

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter target role (e.g. Frontend Developer)"
          className="w-full p-3 bg-black border border-gray-700 rounded"
        />

        <button
          onClick={check}
          className="bg-blue-600 px-5 py-2 rounded mt-3"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="bg-gray-900 p-4 rounded mt-4 whitespace-pre-line">
            {result}
          </div>
        )}

      </div>

      {/* PREMIUM LOCK */}
      {!premium && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">

          <button
            onClick={() => {
              localStorage.setItem("premium", "true");
              setPremium(true);
            }}
            className="bg-blue-600 px-6 py-2 rounded"
          >
            Unlock Premium 💎
          </button>

        </div>
      )}

    </div>
  );
          }
