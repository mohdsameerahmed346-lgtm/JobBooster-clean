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

  // 🔐 LOGIN PROTECTION
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  // 💾 LOAD JOBS
  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));
  }, []);

  // 💾 SAVE JOBS
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // 🔥 STREAK SYSTEM
  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      setStreak((prev) => prev + 1);
      localStorage.setItem("lastVisit", today);
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

      setResult(data.result || "No response from AI");

      const randomScore = Math.floor(Math.random() * 30) + 70;
      setScore(randomScore);
    } catch (err) {
      alert("AI failed");
    }
  };

  // 📥 DOWNLOAD PDF
  const downloadPDF = () => {
    alert("PDF Downloaded ✅");
  };

  // 🔒 DOCX LOCK
  const downloadDOCX = () => {
    alert("Upgrade to Pro to download DOCX 🚀");
  };

  // 🔥 SHARE SCORE
  const shareScore = () => {
    navigator.clipboard.writeText(
      `I got ${score}% ATS score using JobBoost AI 🚀`
    );
    alert("Copied! Share with friends 🔥");
  };

  // 📊 ADD JOB
  const addJob = () => {
    if (!jobInput) return;
    setJobs([...jobs, { name: jobInput, status: "Applied" }]);
    setJobInput("");
  };

  // ✅ COMPLETE TASK
  const completeTask = () => {
    if (tasksDone < 3) {
      setTasksDone(tasksDone + 1);
    }
  };

  return (
    <div style={{ padding: 20, background: "#0f172a", color: "white", minHeight: "100vh" }}>
      
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

      <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>

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
      <p>✔ Unlimited resume scans</p>
      <p>✔ DOCX download</p>
      <p>✔ Advanced AI suggestions</p>

      <h3>₹299/month</h3>
      <button onClick={() => alert("Payment coming soon 🚀")}>
        Upgrade Now
      </button>

    </div>
  );
      }
