"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [tasksDone, setTasksDone] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [jobInput, setJobInput] = useState("");

  // Fake AI optimize
  const optimizeResume = () => {
    if (!resume || !jobDesc) {
      alert("Fill both fields");
      return;
    }

    const fakeScore = Math.floor(Math.random() * 40) + 60;
    setScore(fakeScore);

    setResult(`
PROFESSIONAL RESUME

${resume}

--- Optimized for Job ---

${jobDesc}

Suggestions:
- Add keywords
- Improve summary
- Add metrics
    `);
  };

  // Download PDF
  const downloadPDF = () => {
    alert("PDF Downloaded ✅");
  };

  // DOCX Locked
  const downloadDOCX = () => {
    alert("Upgrade to Pro to download DOCX 🚀");
  };

  // Share score
  const shareScore = () => {
    navigator.clipboard.writeText(
      `I got ${score}% ATS score using JobBoost AI 🚀`
    );
    alert("Copied! Share with friends 🔥");
  };

  // Add job
  const addJob = () => {
    if (!jobInput) return;
    setJobs([...jobs, { name: jobInput, status: "Applied" }]);
    setJobInput("");
  };

  // Task complete
  const completeTask = () => {
    if (tasksDone < 3) {
      setTasksDone(tasksDone + 1);
    }
  };

  return (
    <div style={{ padding: 20, color: "white", background: "#0f172a", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <h1>🚀 JobBoost AI</h1>
      <p>💡 Consistency beats talent</p>

      <h3>🔥 Streak: {streak} days</h3>
      <h3>📊 Resume Score: {score}%</h3>
      <h3>🎯 Job Readiness: {Math.min(score + tasksDone * 5, 100)}%</h3>

      <hr />

      {/* RESUME OPTIMIZER */}
      <h2>🔥 Resume Optimizer</h2>
      <textarea
        placeholder="Paste your resume"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />
      <textarea
        placeholder="Paste job description"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />

      <button onClick={optimizeResume}>Optimize</button>

      {score > 0 && (
        <>
          <h3>📊 Match Score: {score}%</h3>
          <button onClick={shareScore}>🔥 Share Score</button>
        </>
      )}

      <pre>{result}</pre>

      <button onClick={downloadPDF}>📥 Download PDF</button>
      <button onClick={downloadDOCX}>📥 Download DOCX 🔒</button>

      <hr />

      {/* DAILY TASKS */}
      <h2>🔥 Today’s Tasks</h2>
      <p>Progress: {tasksDone}/3</p>

      <button onClick={completeTask}>Complete Task</button>

      <hr />

      {/* JOB TRACKER */}
      <h2>📊 Job Tracker</h2>
      <input
        placeholder="Company / Role"
        value={jobInput}
        onChange={(e) => setJobInput(e.target.value)}
      />
      <button onClick={addJob}>Add Job</button>

      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            {job.name} - {job.status}
          </li>
        ))}
      </ul>

      <hr />

      {/* CAREER AI */}
      <h2>🧬 Career AI</h2>
      <p>🎯 Goal: Web Developer</p>
      <p>Missing Skills: React, Projects</p>
      <p>Plan: Build project → Apply jobs</p>

      <hr />

      {/* REFERRAL */}
      <h2>🎁 Referral System</h2>
      <p>Invite friends and unlock rewards</p>
      <p>Invite 3 → Unlock Pro 🔓</p>

      <button onClick={() => alert("Invite link copied!")}>
        Invite Friends
      </button>

      <hr />

      {/* UPGRADE */}
      <h2>💎 Upgrade to Pro</h2>
      <p>✔ Unlimited scans</p>
      <p>✔ DOCX download</p>
      <p>✔ Advanced AI</p>

      <h3>₹299/month</h3>
      <button onClick={() => alert("Payment coming soon 🚀")}>
        Upgrade Now
      </button>

    </div>
  );
    }
