"use client";
import { useState } from "react";
import jsPDF from "jspdf";

export default function Dashboard() {
  const [active, setActive] = useState("resume");
  const [form, setForm] = useState({ name: "", role: "" });
  const [result, setResult] = useState("");
  const [output, setOutput] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Resume
  const generateResume = () => {
    const data = `
PROFESSIONAL RESUME

Name: ${form.name}
Role: ${form.role}

----------------------------------

SUMMARY:
Motivated and passionate ${form.role} ready to grow.

----------------------------------

SKILLS:
- Communication
- Problem Solving
- Teamwork

----------------------------------

EXPERIENCE:
Fresher
`;
    setResult(data);
    setOutput("");
  };

  // PDF
  const downloadPDF = () => {
    const isPaid = localStorage.getItem("paid");

    if (!isPaid) {
      alert("Upgrade to Pro to download PDF 🚀");
      return;
    }

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result, 180);
    doc.text(lines, 10, 10);
    doc.save(`${form.name || "resume"}.pdf`);
  };

  // Interview Questions
  const generateQuestions = () => {
    const data = `
Interview Questions for ${form.role}:

1. Tell me about yourself
2. Why ${form.role}?
3. Your strengths & weaknesses?
4. Explain a project
5. Where do you see yourself in 5 years?
`;
    setOutput(data);
    setResult("");
  };

  // Skill Gap Analyzer
  const analyzeSkills = () => {
    const data = `
Skill Gap Analysis for ${form.role}:

Required Skills:
- JavaScript
- React
- Problem Solving

Missing Skills (Example):
- Advanced React
- System Design

Learning Plan:
1. Learn basics
2. Build projects
3. Apply for jobs
`;
    setOutput(data);
    setResult("");
  };

  // Career Direction AI
  const careerAdvice = () => {
    const data = `
Career Suggestions based on "${form.role}":

- Software Developer
- Frontend Developer
- Freelancer
- Startup Founder

Tip:
Focus on projects + real skills 🚀
`;
    setOutput(data);
    setResult("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{ width: "220px", background: "#111", color: "white", padding: "20px" }}>
        <h2>🚀 JobBoost</h2>

        <p onClick={() => setActive("resume")} style={{ cursor: "pointer" }}>📄 Resume</p>
        <p onClick={() => setActive("interview")} style={{ cursor: "pointer" }}>🎯 Interview</p>
        <p onClick={() => setActive("skills")} style={{ cursor: "pointer" }}>🧠 Skills</p>
        <p onClick={() => setActive("career")} style={{ cursor: "pointer" }}>🗺️ Career</p>

        <button
          onClick={() => localStorage.setItem("paid", "true")}
          style={{ marginTop: "20px", padding: "10px" }}
        >
          Activate Pro
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h1>Dashboard</h1>

        <input
          name="name"
          placeholder="Your Name"
          onChange={handleChange}
          style={{ display: "block", margin: "10px 0", padding: "10px" }}
        />

        <input
          name="role"
          placeholder="Job Role"
          onChange={handleChange}
          style={{ display: "block", margin: "10px 0", padding: "10px" }}
        />

        {/* Resume */}
        {active === "resume" && (
          <>
            <button onClick={generateResume}>Generate Resume</button>

            {result && (
              <>
                <pre style={{ marginTop: "20px" }}>{result}</pre>
                <button onClick={downloadPDF}>Download PDF</button>
              </>
            )}
          </>
        )}

        {/* Interview */}
        {active === "interview" && (
          <>
            <button onClick={generateQuestions}>Get Questions</button>
          </>
        )}

        {/* Skills */}
        {active === "skills" && (
          <>
            <button onClick={analyzeSkills}>Analyze Skills</button>
          </>
        )}

        {/* Career */}
        {active === "career" && (
          <>
            <button onClick={careerAdvice}>Get Career Advice</button>
          </>
        )}

        {/* Output */}
        {output && (
          <pre style={{ marginTop: "20px", background: "#eee", padding: "20px" }}>
            {output}
          </pre>
        )}
      </div>
    </div>
  );
      }
