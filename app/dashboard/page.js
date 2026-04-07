"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function Dashboard() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [optimized, setOptimized] = useState("");
  const [score, setScore] = useState("");

  const [jobs, setJobs] = useState([]);
  const [jobInput, setJobInput] = useState("");

  const [motivation, setMotivation] = useState("");

  const isPro = localStorage.getItem("paid");

  // 🔐 Protect
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");

    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));

    const quotes = [
      "Apply to 3 jobs today 🚀",
      "Consistency beats talent 💪",
      "Small steps daily = big success 🔥",
      "Don’t quit, you’re close 💯"
    ];
    setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // 🔥 Resume Optimizer
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

  // 📥 PDF
  const downloadPDF = () => {
    if (!isPro) return alert("🔒 Pro feature");

    const doc = new jsPDF();
    doc.text(optimized, 10, 10);
    doc.save("resume.pdf");
  };

  // 📊 Job Tracker
  const addJob = () => {
    if (!isPro) return alert("🔒 Pro feature");

    const newJobs = [...jobs, jobInput];
    setJobs(newJobs);
    localStorage.setItem("jobs", JSON.stringify(newJobs));
    setJobInput("");
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // 💰 Activate Pro
  const activatePro = () => {
    localStorage.setItem("paid", "true");
    alert("Pro Activated 🚀");
  };

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>🚀 JobBoost AI</h1>

      <button onClick={logout}>Logout</button>

      <p style={{ marginTop: 10, fontWeight: "bold" }}>
        💡 {motivation}
      </p>

      <hr />

      {/* Resume Optimizer */}
      <h2>🔥 Resume Optimizer</h2>

      <textarea
        placeholder="Paste your resume"
        onChange={(e) => setResumeText(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      <textarea
        placeholder="Paste job description"
        onChange={(e) => setJobDesc(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      <button onClick={optimizeResume}>Optimize</button>

      <pre>{optimized}</pre>
      <h3>{score}</h3>

      <button onClick={downloadPDF}>
        📥 Download PDF {isPro ? "" : "🔒"}
      </button>

      <hr />

      {/* Job Tracker */}
      <h2>📊 Job Tracker {isPro ? "" : "🔒"}</h2>

      <input
        value={jobInput}
        onChange={(e) => setJobInput(e.target.value)}
        placeholder="Company / Role"
        style={{ width: "100%" }}
      />

      <br /><br />

      <button onClick={addJob}>
        Add Job {isPro ? "" : "🔒"}
      </button>

      <ul>
        {jobs.map((job, i) => (
          <li key={i}>{job}</li>
        ))}
      </ul>

      <hr />

      {/* Upgrade */}
      {!isPro && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <h2>💎 Upgrade to Pro</h2>
          <p>Unlock all features</p>

          <button
            onClick={activatePro}
            style={{
              padding: 10,
              background: "black",
              color: "white",
              borderRadius: 5
            }}
          >
            ₹299 Upgrade
          </button>
        </div>
      )}
    </main>
  );
            }
