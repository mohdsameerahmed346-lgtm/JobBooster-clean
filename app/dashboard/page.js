"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [optimized, setOptimized] = useState("");
  const [score, setScore] = useState("");

  const [jobs, setJobs] = useState([]);
  const [jobInput, setJobInput] = useState("");

  const [motivation, setMotivation] = useState("");

  const isPro = typeof window !== "undefined" && localStorage.getItem("paid");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");

    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));

    const quotes = [
      "Apply to 3 jobs today 🚀",
      "Consistency beats talent 💪",
      "You’re closer than you think 🔥",
      "Success = consistency 💯"
    ];
    setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Resume
  const optimizeResume = () => {
    const keywords = jobDesc.split(" ").slice(0, 5);

    const text = `
OPTIMIZED RESUME

${resumeText}

--- Improvements ---
✔ Added keywords: ${keywords.join(", ")}
✔ Better alignment with job
✔ Improved structure
    `;

    setOptimized(text);

    const match = keywords.filter(k => resumeText.includes(k)).length;
    setScore(`ATS Score: ${match + 5}/10`);
  };

  // Download
  const downloadPDF = () => {
    if (!isPro) return alert("🔒 Pro feature");

    const element = document.createElement("a");
    const file = new Blob([optimized], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "resume.txt";
    document.body.appendChild(element);
    element.click();
  };

  // Job tracker
  const addJob = () => {
    if (!isPro) return alert("🔒 Pro feature");

    const newJobs = [...jobs, jobInput];
    setJobs(newJobs);
    localStorage.setItem("jobs", JSON.stringify(newJobs));
    setJobInput("");
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Activate Pro
  const activatePro = () => {
    localStorage.setItem("paid", "true");
    alert("Pro Activated 🚀");
  };

  return (
    <main style={{ maxWidth: 800, margin: "auto", padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🚀 JobBoost AI</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <p style={{ marginTop: 10, fontWeight: "bold" }}>
        💡 {motivation}
      </p>

      {/* SECTION 1: RESUME */}
      <div style={card}>
        <h2>🔥 Resume Optimizer</h2>

        <textarea
          placeholder="Paste your resume"
          onChange={(e) => setResumeText(e.target.value)}
          style={textarea}
        />

        <textarea
          placeholder="Paste job description"
          onChange={(e) => setJobDesc(e.target.value)}
          style={textarea}
        />

        <button style={btn} onClick={optimizeResume}>
          Optimize Resume
        </button>

        {optimized && (
          <>
            <pre style={output}>{optimized}</pre>
            <h3>{score}</h3>

            <button style={btn} onClick={downloadPDF}>
              📥 Download {isPro ? "" : "🔒"}
            </button>
          </>
        )}
      </div>

      {/* SECTION 2: JOB TRACKER */}
      <div style={card}>
        <h2>📊 Job Tracker {isPro ? "" : "🔒"}</h2>

        <input
          value={jobInput}
          onChange={(e) => setJobInput(e.target.value)}
          placeholder="Company / Role"
          style={input}
        />

        <button style={btn} onClick={addJob}>
          Add Job {isPro ? "" : "🔒"}
        </button>

        <ul>
          {jobs.map((job, i) => (
            <li key={i}>{job}</li>
          ))}
        </ul>
      </div>

      {/* SECTION 3: UPGRADE */}
      {!isPro && (
        <div style={{ ...card, textAlign: "center" }}>
          <h2>💎 Upgrade to Pro</h2>
          <p>Unlock all premium features</p>

          <button
            onClick={activatePro}
            style={{
              padding: 12,
              background: "black",
              color: "white",
              borderRadius: 6,
              fontWeight: "bold"
            }}
          >
            ₹299 Upgrade
          </button>
        </div>
      )}

    </main>
  );
}

/* 🎨 STYLES */
const card = {
  background: "#f5f5f5",
  padding: 20,
  borderRadius: 10,
  marginTop: 20
};

const textarea = {
  width: "100%",
  height: 100,
  marginTop: 10,
  padding: 10
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10
};

const btn = {
  marginTop: 10,
  padding: 10,
  background: "black",
  color: "white",
  borderRadius: 5
};

const output = {
  background: "#000",
  color: "#0f0",
  padding: 10,
  marginTop: 10
};
