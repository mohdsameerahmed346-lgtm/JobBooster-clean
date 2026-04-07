"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const [optimized, setOptimized] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

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

  // 🔥 Resume Optimizer
  const optimizeResume = () => {
    const keywords = jobDesc.split(" ").slice(0, 5);
    const missing = keywords.filter(k => !resumeText.includes(k));

    setOptimized(`
OPTIMIZED RESUME

${resumeText}

✔ Added keywords: ${keywords.join(", ")}
    `);

    const match = keywords.filter(k => resumeText.includes(k)).length;
    setScore(`ATS Score: ${match + 5}/10`);

    setSuggestions(`
Suggestions:
- Add keywords: ${missing.join(", ")}
- Use action verbs
- Add measurable results
    `);
  };

  // ✉️ Cover Letter
  const generateCoverLetter = () => {
    if (!isPro) return alert("🔒 Pro feature");

    setCoverLetter(`
Dear Hiring Manager,

I am excited to apply for this role. My skills and passion align well with your requirements.

${resumeText}

I am eager to contribute and grow in your company.

Sincerely,
Your Name
    `);
  };

  // 🎯 Action Plan
  const generatePlan = () => {
    setActionPlan(`
👉 Apply to 3 jobs daily
👉 Learn new skills weekly
👉 Build real-world projects
👉 Improve communication
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

  // 📥 Download
  const downloadFile = () => {
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
    <main style={container}>

      {/* HEADER */}
      <div style={header}>
        <h1>🚀 JobBoost AI</h1>
        <button onClick={logout} style={btn}>Logout</button>
      </div>

      <p style={{ color: "#aaa" }}>💡 {motivation}</p>

      {/* RESUME */}
      <div style={card}>
        <h2>🧪 Resume Lab</h2>

        <textarea placeholder="Resume" onChange={e => setResumeText(e.target.value)} style={textarea}/>
        <textarea placeholder="Job Description" onChange={e => setJobDesc(e.target.value)} style={textarea}/>

        <button style={btn} onClick={optimizeResume}>Optimize</button>

        <pre>{optimized}</pre>
        <h3>{score}</h3>
        <pre>{suggestions}</pre>

        <button style={btn} onClick={downloadFile}>
          Download {isPro ? "" : "🔒"}
        </button>
      </div>

      {/* COVER LETTER */}
      <div style={card}>
        <h2>✉️ Cover Letter</h2>

        <button style={btn} onClick={generateCoverLetter}>
          Generate {isPro ? "" : "🔒"}
        </button>

        <pre>{coverLetter}</pre>
      </div>

      {/* ACTION PLAN */}
      <div style={card}>
        <h2>🎯 Action Plan</h2>
        <button style={btn} onClick={generatePlan}>Generate</button>
        <pre>{actionPlan}</pre>
      </div>

      {/* JOB TRACKER */}
      <div style={card}>
        <h2>📊 Job Tracker {isPro ? "" : "🔒"}</h2>

        <input value={jobInput} onChange={e => setJobInput(e.target.value)} placeholder="Company / Role" style={input}/>
        <select onChange={e => setJobStatus(e.target.value)} style={input}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
        </select>

        <button style={btn} onClick={addJob}>Add Job</button>

        <ul>
          {jobs.map((job, i) => (
            <li key={i}>{job.name} - <b>{job.status}</b></li>
          ))}
        </ul>
      </div>

      {/* UPGRADE */}
      {!isPro && (
        <div style={{ ...card, textAlign: "center" }}>
          <h2>💎 Upgrade to Pro</h2>
          <p>Unlock full career system</p>

          <button style={btnPrimary} onClick={activatePro}>
            ₹299 Upgrade
          </button>
        </div>
      )}

    </main>
  );
}

/* DARK THEME */
const container = {
  background: "#0f172a",
  color: "white",
  minHeight: "100vh",
  padding: 20
};

const header = {
  display: "flex",
  justifyContent: "space-between"
};

const card = {
  background: "#1e293b",
  padding: 20,
  borderRadius: 10,
  marginTop: 20
};

const textarea = {
  width: "100%",
  height: 100,
  marginTop: 10,
  background: "#020617",
  color: "white",
  padding: 10
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  background: "#020617",
  color: "white"
};

const btn = {
  marginTop: 10,
  padding: 10,
  background: "#334155",
  color: "white",
  borderRadius: 5
};

const btnPrimary = {
  marginTop: 10,
  padding: 12,
  background: "#22c55e",
  color: "white",
  borderRadius: 6,
  fontWeight: "bold"
};
