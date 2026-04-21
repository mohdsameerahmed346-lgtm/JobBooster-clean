"use client";

import { useState, useEffect } from "react";
import TypingText from "../../../components/TypingText";
import { saveHistory } from "../../../lib/history";

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPremium(localStorage.getItem("premium") === "true");
  }, []);

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
          prompt: `
You are a career coach.

Provide:
1. Missing skills
2. Improvements
3. Learning roadmap

Role: ${role}
`,
        }),
      });

      const data = await res.json();

      // ✅ SAVE HISTORY
      await saveHistory("skill-gap", role, data.result);

      setResult(data.result);

    } catch {
      setResult("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">

      <h1 className="text-2xl font-bold">📉 Skill Gap</h1>

      <div className={`${!premium ? "blur-sm pointer-events-none" : ""}`}>

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter role"
          className="w-full p-3 bg-black border border-gray-700 rounded"
        />

        <button
          onClick={check}
          className="bg-blue-600 px-5 py-2 rounded mt-3"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-2xl">
            <TypingText text={result} />
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
            Unlock Premium 💎
          </button>
        </div>
      )}

    </div>
  );
      }
