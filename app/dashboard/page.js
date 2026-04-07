"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [optimized, setOptimized] = useState("");
  const [score, setScore] = useState("");

  const [cover, setCover] = useState("");
  const [company, setCompany] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");
  }, []);

  // 📄 Resume Builder
  const generateResume = () => {
    const text = `
PROFESSIONAL RESUME

Name: ${name}
Role: ${role}

SUMMARY:
Motivated ${role} ready to grow.

SKILLS:
- Communication
- Problem Solving

EXPERIENCE:
Fresher
    `;
    setResult(text);
  };

  // 🔥 Resume Optimizer
  const optimizeResume = () => {
    const keywords = jobDesc.split(" ").slice(0, 5);

    const text = `
OPTIMIZED RESUME

${resumeText}

--- Improvements ---
Added keywords:
${keywords.join(", ")}

Better alignment with job role: ${role}
    `;

    setOptimized(text);

    // simple ATS score
    const match = keywords.filter(k => resumeText.includes(k)).length;
    setScore(`ATS Score: ${match + 5}/10`);
  };

  // ✉️ Cover Letter
  const generateCover = () => {
    const text = `
Dear ${company},

I am excited to apply for the ${role} position.

I am a motivated individual with strong interest in this field and eager to contribute.

Thank you,
${name}
    `;
    setCover(text);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>🚀 JobBoost AI Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <hr />

      {/* Resume Builder */}
      <h2>📄 Resume Builder</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <br /><br />

      <input placeholder="Role" onChange={(e) => setRole(e.target.value)} />
      <br /><br />

      <button onClick={generateResume}>Generate Resume</button>

      <pre>{result}</pre>

      <hr />

      {/* Resume Optimizer */}
      <h2>🔥 Optimize Resume for Job</h2>

      <textarea
        placeholder="Paste your resume"
        onChange={(e) => setResumeText(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Paste job description"
        onChange={(e) => setJobDesc(e.target.value)}
      />
      <br /><br />

      <button onClick={optimizeResume}>Optimize</button>

      <pre>{optimized}</pre>
      <h3>{score}</h3>

      <hr />

      {/* Cover Letter */}
      <h2>✉️ Cover Letter Generator</h2>

      <input
        placeholder="Company Name"
        onChange={(e) => setCompany(e.target.value)}
      />
      <br /><br />

      <button onClick={generateCover}>Generate Cover Letter</button>

      <pre>{cover}</pre>

    </main>
  );
                           }
