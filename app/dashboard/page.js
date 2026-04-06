"use client";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function Dashboard() {
  const [form, setForm] = useState({ name: "", role: "" });
  const [result, setResult] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobInput, setJobInput] = useState("");
  const [output, setOutput] = useState("");

  // ✅ Load saved jobs
  useEffect(() => {
    const saved = localStorage.getItem("jobs");
    if (saved) setJobs(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Resume Generator
  const generateResume = () => {
    const data = `
PROFESSIONAL RESUME

Name: ${form.name}
Role: ${form.role}

----------------------------------
SUMMARY:
Motivated and passionate ${form.role}

----------------------------------
SKILLS:
- Communication
- Problem Solving

----------------------------------
EXPERIENCE:
Fresher
`;
    setResult(data);
  };

  // 🔒 Premium PDF
  const downloadPDF = () => {
    const isPaid = localStorage.getItem("paid");

    if (!isPaid) {
      alert("Upgrade to Pro 🚀");
      return;
    }

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result, 180);
    doc.text(lines, 10, 10);
    doc.save(`${form.name || "resume"}.pdf`);
  };

  // 🔒 Resume Analyzer
  const analyzeResume = () => {
    const isPaid = localStorage.getItem("paid");

    if (!isPaid) {
      alert("Pro feature 🔒");
      return;
    }

    setOutput("Resume Score: 75%\nImprove projects + skills.");
  };

  // 🔒 Job Tracker
  const addJob = () => {
    const isPaid = localStorage.getItem("paid");

    if (!isPaid) {
      alert("Pro feature 🔒");
      return;
    }

    const newJobs = [...jobs, jobInput];
    setJobs(newJobs);
    localStorage.setItem("jobs", JSON.stringify(newJobs));
    setJobInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 Dashboard</h1>

      {/* Inputs */}
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        style={{ display: "block", margin: "10px 0" }}
      />

      <input
        name="role"
        placeholder="Role"
        onChange={handleChange}
        style={{ display: "block", margin: "10px 0" }}
      />

      {/* Resume */}
      <button onClick={generateResume}>Generate Resume</button>

      {result && (
        <>
          <pre>{result}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={analyzeResume}>
            Analyze Resume (Pro)
          </button>
        </>
      )}

      {/* Job Tracker */}
      <h2>Job Tracker (Pro)</h2>

      <input
        value={jobInput}
        onChange={(e) => setJobInput(e.target.value)}
        placeholder="Company / Role"
      />

      <button onClick={addJob}>Add Job</button>

      <ul>
        {jobs.map((job, i) => (
          <li key={i}>{job}</li>
        ))}
      </ul>

      {/* Output */}
      {output && <pre>{output}</pre>}

      {/* Test Pro */}
      <button
        onClick={() => localStorage.setItem("paid", "true")}
        style={{ marginTop: "20px" }}
      >
        Activate Pro
      </button>
    </div>
  );
  }
