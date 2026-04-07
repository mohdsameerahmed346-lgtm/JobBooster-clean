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

  const [skillGap, setSkillGap] = useState("");
  const [questions, setQuestions] = useState("");
  const [careerAdvice, setCareerAdvice] = useState("");

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

  // Resume optimizer
  const optimizeResume = () => {
    const keywords = jobDesc.split(" ").slice(0, 5);

    const text = `
OPTIMIZED RESUME

${resumeText}

✔ Added keywords: ${keywords.join(", ")}
✔ Better alignment with job
    `;

    setOptimized(text);

    const match = keywords.filter(k => resumeText.includes(k)).length;
    setScore(`ATS Score: ${match + 5}/10`);
  };

  // Skill gap
  const analyzeSkills = () => {
    const keywords = jobDesc.split(" ").slice(0, 5);
    const missing = keywords.filter(k => !resumeText.includes(k));

    setSkillGap(`Missing Skills: ${missing.join(", ")}`);
  };

  // Interview questions
  const generateQuestions = () => {
    const role = jobDesc.split(" ")[0];

    setQuestions(`
1. Why do you want this ${role} role?
2. What are your strengths?
3. Explain a project you worked on.
4. How do you solve problems?
    `);
  };

  // Career advice
  const getCareerAdvice = () => {
    setCareerAdvice(`
👉 Focus on learning core skills
👉 Build 2-3 real projects
👉 Apply consistently
👉 Improve communication skills
    `);
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

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const activatePro = () => {
    localStorage.setItem("paid", "true");
    alert("Pro Activated 🚀");
  };

  return (
    <main style={{ maxWidth: 800, margin: "auto", padding: 20 }}>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🚀 JobBoost AI</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <p><b>💡 {motivation}</b></p>

      {/* Resume */}
      <div style={card}>
        <h2>🔥 Resume Optimizer</h2>

        <textarea placeholder="Resume" onChange={e => setResumeText(e.target.value)} style={textarea} />
        <textarea placeholder="Job Description" onChange={e => setJobDesc(e.target.value)} style={textarea} />

        <button style={btn} onClick={optimizeResume}>Optimize</button>

        <pre>{optimized}</pre>
        <h3>{score}</h3>

        <button style={btn} onClick={downloadPDF}>
          Download {isPro ? "" : "🔒"}
        </button>
      </div>

      {/* Skill Gap */}
      <div style={card}>
        <h2>🧠 Skill Gap Analyzer</h2>
        <button style={btn} onClick={analyzeSkills}>Analyze</button>
        <p>{skillGap}</p>
      </div>

      {/* Interview */}
      <div style={card}>
        <h2>🎯 Interview Questions</h2>
        <button style={btn} onClick={generateQuestions}>Generate</button>
        <pre>{questions}</pre>
      </div>

      {/* Career */}
      <div style={card}>
        <h2>🗺️ Career Direction</h2>
        <button style={btn} onClick={getCareerAdvice}>Get Advice</button>
        <pre>{careerAdvice}</pre>
      </div>

      {/* Job Tracker */}
      <div style={card}>
        <h2>📊 Job Tracker {isPro ? "" : "🔒"}</h2>

        <input value={jobInput} onChange={e => setJobInput(e.target.value)} placeholder="Company / Role" style={input} />
        <button style={btn} onClick={addJob}>Add Job</button>

        <ul>
          {jobs.map((j, i) => <li key={i}>{j}</li>)}
        </ul>
      </div>

      {!isPro && (
        <div style={{ ...card, textAlign: "center" }}>
          <h2>💎 Upgrade to Pro</h2>
          <button style={btn} onClick={activatePro}>₹299 Upgrade</button>
        </div>
      )}

    </main>
  );
}

const card = { background: "#f5f5f5", padding: 20, borderRadius: 10, marginTop: 20 };
const textarea = { width: "100%", height: 100, marginTop: 10 };
const input = { width: "100%", padding: 10, marginTop: 10 };
const btn = { marginTop: 10, padding: 10, background: "black", color: "white" };
