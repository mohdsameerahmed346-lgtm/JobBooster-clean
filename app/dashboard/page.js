"use client";
import { useState } from "react";

export default function Dashboard() {
  const [active, setActive] = useState("resume");

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#0f172a",
      color: "white"
    }}>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#020617",
        padding: "20px"
      }}>
        <h2>🚀 JobBoost</h2>

        <p
          style={{ cursor: "pointer", marginTop: "20px" }}
          onClick={() => setActive("resume")}
        >
          📄 Resume Builder
        </p>

        <p
          style={{ cursor: "pointer" }}
          onClick={() => setActive("cover")}
        >
          ✉️ Cover Letter
        </p>

        <p
          style={{ cursor: "pointer" }}
          onClick={() => setActive("interview")}
        >
          🎯 Interview Prep
        </p>

        <p
          style={{ cursor: "pointer" }}
          onClick={() => setActive("career")}
        >
          🗺️ Career AI
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h1>Dashboard</h1>

        {active === "resume" && (
          <div>
            <h2>Resume Builder</h2>
            <input
              placeholder="Your Name"
              style={{ display: "block", margin: "10px 0", padding: "10px" }}
            />
            <input
              placeholder="Job Role"
              style={{ display: "block", margin: "10px 0", padding: "10px" }}
            />
            <button style={{ padding: "10px 20px" }}>
              Generate Resume
            </button>
          </div>
        )}

        {active === "cover" && (
          <div>
            <h2>Cover Letter Generator</h2>
            <button>Generate Cover Letter</button>
          </div>
        )}

        {active === "interview" && (
          <div>
            <h2>Interview Questions</h2>
            <button>Get Questions</button>
          </div>
        )}

        {active === "career" && (
          <div>
            <h2>Career Direction AI</h2>
            <button>Analyze Career</button>
          </div>
        )}
      </div>

    </div>
  );
}
