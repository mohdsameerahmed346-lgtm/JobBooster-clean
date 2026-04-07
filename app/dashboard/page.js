"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const [optimized, setOptimized] = useState("");
  const [score, setScore] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const [jobs, setJobs] = useState([]);
  const [jobInput, setJobInput] = useState("");
  const [jobStatus, setJobStatus] = useState("Applied");

  const [actionPlan, setActionPlan] = useState("");
  const [motivation, setMotivation] = useState("");

  const isPro = typeof window !== "undefined" && localStorage.getItem("paid");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");

    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));

    const quotes = [
      "Rejection is redirection 🔥",
      "You’re improving every day 💪",
      "Keep going, success is near 🚀",
      "Consistency beats talent 💯"
    ];
    setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // 🔥 Resume Optimizer + ATS Suggestions
  const optimizeResume = () => {
    const keywords = jobDesc.split(" ").slice(0, 5);
    const missing = keywords.filter(k => !resumeText.includes(k));

    setOptimized(`
OPTIMIZED RESUME

${resumeText}

✔ Added keywords: ${keywords.join(", ")}
    `);

    const match = keywords.filter(k => resumeText.includes(k)).length;
    const finalScore = match + 5;

    setScore(`ATS Score: ${finalScore}/10`);

    setSuggestions(`
Suggestions:
- Add keywords: ${missing.join(", ")}
- Use action verbs (Built, Created, Led)
- Add measurable results (e.g., increased performance by 20%)
    `);
  };

  // 📊 Job Tracker
  const addJob = () => {
    if (!isPro) return alert("🔒 Pro feature");

    const newJobs = [...jobs, { name: jobInput, status: jobStatus }];
    setJobs(newJobs);
    localStorage.setItem("jobs", JSON.stringify(newJobs));
    setJobInput("");
  };

  // 🎯 Action Plan
  const generatePlan = () => {
    setActionPlan(`
👉 Apply to 3 jobs daily
👉 Learn 1 new skill this week
👉 Build 1 project in 7 days
👉 Improve communication skills
    `);
  };

  // 📥 Download
  const downloadPDF = () => {
    if (!isPro) return alert("🔒 Pro feature");

    const element = document.createElement("a");
    const file = new Blob([optimized], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "resume.txt";
    document.body.appendChild(element);
    element.click();
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const activatePro = () => {
    localStorage.setItem("paid", "true");
    alert("Pro Activated 🚀");
  };

  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🚀 JobBoost AI</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <p><b>💡 {motivation}</b></p>

      {/* RESUME LAB */}
      <div style={card}>
        <h2>🧪 Resume Lab</h2>

        <textarea placeholder="Paste Resume" onChange={e => setResumeText(e.target.value)} style={textarea}/>
        <textarea placeholder="Paste Job Description" onChange={e => setJobDesc(e.target.value)} style={textarea}/>

        <button style={btn} onClick={optimizeResume}>Optimize Resume</button>

        <pre>{optimized}</pre>
        <h3>{score}</h3>
        <pre>{suggestions}</pre>

        <button style={btn} onClick={downloadPDF}>
          Download {isPro ? "" : "🔒"}
        </button>
      </div>

      {/* ACTION PLAN */}
      <div style={card}>
        <h2>🎯 Your Action Plan</h2>
        <button style={btn} onClick={generatePlan}>Generate Plan</button>
        <pre>{actionPlan}</pre>
      </div>

      {/* JOB TRACKER */}
      <div style={card}>
        <h2>📊 Job Tracker {isPro ? "" : "🔒"}</h2>

        <input
          value={jobInput}
          onChange={e => setJobInput(e.target.value)}
          placeholder="Company / Role"
          style={input}
        />

        <select onChange={(e) => setJobStatus(e.target.value)} style={input}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
        </select>

        <button style={btn} onClick={addJob}>
          Add Job
        </button>

        <ul>
          {jobs.map((job, i) => (
            <li key={i}>
              {job.name} - <b>{job.status}</b>
            </li>
          ))}
        </ul>
      </div>

      {/* UPGRADE */}
      {!isPro && (
        <div style={{ ...card, textAlign: "center" }}>
          <h2>💎 Upgrade to Pro</h2>
          <p>Unlock full AI career system</p>

          <button style={btn} onClick={activatePro}>
            ₹299 Upgrade
          </button>
        </div>
      )}

    </main>
  );
}

/* STYLES */
const card = {
  background: "#f5f5f5",
  padding: 20,
  borderRadius: 10,
  marginTop: 20
};

const textarea = {
  width: "100%",
  height: 100,
  marginTop: 10
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
