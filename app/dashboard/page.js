"use client";
import { useState } from "react";
import jsPDF from "jspdf";

export default function Dashboard() {
  const [active, setActive] = useState("resume");
  const [form, setForm] = useState({
    name: "",
    role: ""
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateResume = () => {
    const output = `
PROFESSIONAL RESUME

Name: ${form.name}
Role: ${form.role}

----------------------------------

SUMMARY:
Motivated and passionate ${form.role} ready to grow and contribute.

----------------------------------

SKILLS:
- Communication
- Problem Solving
- Teamwork

----------------------------------

EXPERIENCE:
Fresher
`;

    setResult(output);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result, 180);
    doc.text(lines, 10, 10);
    doc.save(`${form.name || "resume"}.pdf`);
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#0f172a",
      color: "white"
    }}>

      {/* Sidebar */}
      <div style={{ width: "220px", background: "#020617", padding: "20px" }}>
        <h2>🚀 JobBoost</h2>

        <p onClick={() => setActive("resume")} style={{ cursor: "pointer", marginTop: "20px" }}>📄 Resume Builder</p>
        <p onClick={() => setActive("cover")} style={{ cursor: "pointer" }}>✉️ Cover Letter</p>
        <p onClick={() => setActive("interview")} style={{ cursor: "pointer" }}>🎯 Interview Prep</p>
        <p onClick={() => setActive("career")} style={{ cursor: "pointer" }}>🗺️ Career AI</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h1>Dashboard</h1>

        {active === "resume" && (
          <div>
            <h2>Resume Builder</h2>

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

            <button onClick={generateResume} style={{ padding: "10px 20px" }}>
              Generate Resume
            </button>

            {result && (
              <>
                <pre style={{
                  marginTop: "20px",
                  background: "#020617",
                  padding: "20px",
                  whiteSpace: "pre-wrap"
                }}>
                  {result}
                </pre>

                <button
                  onClick={downloadPDF}
                  style={{ marginTop: "10px", padding: "10px 20px" }}
                >
                  Download PDF
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
      }
