"use client";
import { useState } from "react";
import jsPDF from "jspdf";

export default function Dashboard() {
  const [form, setForm] = useState({ name: "", role: "" });
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

  // 🔒 Premium PDF Download
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

  return (
    <main style={{ padding: "20px" }}>
      <h1>🚀 JobBoost Dashboard</h1>

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
          <pre
            style={{
              marginTop: "20px",
              background: "#eee",
              padding: "20px",
              whiteSpace: "pre-wrap",
            }}
          >
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

      {/* ✅ PRO ACTIVATION BUTTON */}
      <button
        onClick={() => localStorage.setItem("paid", "true")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "green",
          color: "white",
        }}
      >
        Activate Pro (Test)
      </button>
    </main>
  );
}
