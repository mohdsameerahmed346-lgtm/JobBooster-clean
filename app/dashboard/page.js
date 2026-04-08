"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);

  // 🔐 LOGIN PROTECTION
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  // 🤖 AI OPTIMIZE
  const optimizeResume = async () => {
    if (!resume || !jobDesc) {
      alert("Fill both fields");
      return;
    }

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ resume, jobDesc }),
      });

      const data = await res.json();

      setResult(data.result || "No response");

      // temporary score
      const fakeScore = Math.floor(Math.random() * 30) + 70;
      setScore(fakeScore);
    } catch (err) {
      alert("AI failed");
    }
  };

  // 🔥 SHARE FUNCTION (ADDED)
  const share = () => {
    const text = `I got ${score}% ATS score using JobBoost AI 🚀`;

    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends 🔥");
  };

  return (
    <div
      style={{
        padding: 20,
        background: "#020617",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* NAVBAR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🚀 JobBoost AI</h2>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={card}>📊 Score: {score}%</div>
        <div style={card}>🔥 Streak: 3 days</div>
        <div style={card}>🎯 Ready: {score}%</div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        {/* LEFT SIDE */}
        <div style={card}>
          <h3>🔥 Resume Optimizer</h3>

          <textarea
            placeholder="Paste your resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            style={input}
          />

          <textarea
            placeholder="Paste job description"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            style={input}
          />

          <button style={btn} onClick={optimizeResume}>
            Optimize
          </button>

          {/* SCORE + SHARE */}
          {score > 0 && (
            <>
              <p>📊 Match Score: {score}%</p>
              <button style={btn} onClick={share}>
                🔥 Share Score
              </button>
            </>
          )}

          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>

          <button style={btn}>📥 Download PDF</button>
          <button style={lockBtn}>📥 DOCX 🔒</button>
        </div>

        {/* RIGHT SIDE */}
        <div style={card}>
          <h3>🧠 AI Tools</h3>

          <button style={btn}>Skill Gap Analyzer</button>
          <button style={btn}>Interview Questions</button>
          <button style={btn}>Career Direction</button>
        </div>
      </div>

      {/* UPGRADE SECTION */}
      <div style={{ marginTop: 30 }}>
        <h3>💎 Upgrade to Pro</h3>
        <p>✔ Unlimited scans</p>
        <p>✔ DOCX download</p>
        <p>✔ Advanced AI</p>

        <button style={btn}>Upgrade 🚀</button>
      </div>
    </div>
  );
}

// 🎨 STYLES
const card = {
  background: "#0f172a",
  padding: 20,
  borderRadius: 10,
};

const input = {
  width: "100%",
  height: 80,
  marginTop: 10,
};

const btn = {
  marginTop: 10,
  padding: 10,
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};

const lockBtn = {
  ...btn,
  background: "#334155",
};
