"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  const [skills, setSkills] = useState("");
  const [skillResult, setSkillResult] = useState("");

  const [questions, setQuestions] = useState("");

  const [career, setCareer] = useState("");

  // 🔐 Protect dashboard
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");
  }, []);

  // 📄 Resume Generator
  const generateResume = () => {
    const text = `
PROFESSIONAL RESUME

Name: ${name}
Role: ${role}

----------------------------------

SUMMARY:
Motivated and passionate ${role} ready to grow and contribute.

----------------------------------

SKILLS:
- Communication
- Problem Solving
- Teamwork

----------------------------------

EXPERIENCE:
Fresher
    `;
    setResult(text);
  };

  // 🧠 Skill Gap Analyzer
  const analyzeSkills = () => {
    const text = `
SKILL GAP ANALYSIS

Target Role: ${role}

Your Skills:
${skills}

Missing Skills:
- Advanced ${role} concepts
- Real-world projects
- Industry tools

Suggestion:
Start learning daily and build 2-3 projects.
    `;
    setSkillResult(text);
  };

  // 🎯 Interview Questions
  const generateQuestions = () => {
    const text = `
INTERVIEW QUESTIONS for ${role}

1. Tell me about yourself.
2. Why do you want this role?
3. What are your strengths?
4. Explain a project you built.
5. Where do you see yourself in 5 years?
    `;
    setQuestions(text);
  };

  // 🗺️ Career AI
  const generateCareer = () => {
    const text = `
CAREER ROADMAP for ${role}

Step 1: Learn basics
Step 2: Build projects
Step 3: Apply for internships
Step 4: Improve communication
Step 5: Crack interviews
    `;
    setCareer(text);
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>📊 Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* Resume Builder */}
      <h2>📄 Resume Builder</h2>

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br /><br />

      <button onClick={generateResume}>Generate Resume</button>

      <pre>{result}</pre>

      <hr />

      {/* Skill Gap */}
      <h2>🧠 Skill Gap Analyzer</h2>

      <textarea
        placeholder="Enter your skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <br /><br />

      <button onClick={analyzeSkills}>Analyze Skills</button>

      <pre>{skillResult}</pre>

      <hr />

      {/* Interview Questions */}
      <h2>🎯 Interview Questions</h2>

      <button onClick={generateQuestions}>
        Generate Questions
      </button>

      <pre>{questions}</pre>

      <hr />

      {/* Career AI */}
      <h2>🗺️ Career Direction AI</h2>

      <button onClick={generateCareer}>
        Generate Career Path
      </button>

      <pre>{career}</pre>
    </main>
  );
}
