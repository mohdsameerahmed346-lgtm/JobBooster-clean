"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function SkillGapPage() {
  const [role, setRole] = useState("");
  const [data, setData] = useState(null);

  const analyze = async () => {
    const isPremium = localStorage.getItem("premium") === "true";

    const res = await fetch("/api/skill-gap", {
      method: "POST",
      body: JSON.stringify({ role, isPremium }),
    });

    const result = await res.json();
    setData(result);
  };

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Menu />

      <div className="ml-0 md:ml-64 p-8 w-full">
        <h1 className="text-3xl mb-6">📉 Skill Gap Analyzer</h1>

        <input
          placeholder="Enter job role"
          className="w-full p-3 bg-gray-800 rounded mb-4"
          onChange={(e) => setRole(e.target.value)}
        />

        <button onClick={analyze} className="bg-purple-600 px-5 py-2 rounded">
          Analyze Skills
        </button>

        {data && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-5 rounded">
              <h2>Missing Skills</h2>
              {data.missing?.map((m, i) => <p key={i}>• {m}</p>)}
            </div>

            <div className="bg-gray-800 p-5 rounded">
              <h2>Suggestions</h2>
              {data.suggestions?.map((s, i) => <p key={i}>• {s}</p>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
