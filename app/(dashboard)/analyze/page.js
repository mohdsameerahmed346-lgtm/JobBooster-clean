"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Analyze() {
  const [resumeText, setResumeText] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewrite, setRewrite] = useState(null);

  const pdfRef = useRef();

  // 🧠 AI REWRITE
  const handleRewrite = async () => {
    if (!resumeText.trim()) return alert("Paste resume text");

    setLoading(true);

    const formData = new FormData();
    formData.append("resumeText", resumeText);
    formData.append("job", job);

    const res = await fetch("/api/rewrite-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setRewrite(data);

    setLoading(false);
  };

  // 📄 EXPORT PDF
  const downloadPDF = async () => {
    const element = pdfRef.current;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save("resume.pdf");
  };

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">Resume Analyzer</h1>

      {/* INPUT */}
      <textarea
        placeholder="Paste your resume text..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        className="input"
        rows={6}
      />

      <textarea
        placeholder="Paste job description (optional)"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="input"
        rows={4}
      />

      <button onClick={handleRewrite} className="btn-primary">
        Improve Resume with AI
      </button>

      {loading && <p>Generating...</p>}

      {/* RESULT */}
      {rewrite && (
        <>
          <div ref={pdfRef} className="bg-white text-black p-8 rounded-xl">

            <h1 className="text-2xl font-bold mb-2">
              {rewrite.name}
            </h1>

            <p className="mb-4">{rewrite.summary}</p>

            <h2 className="font-bold mt-4">Skills</h2>
            <ul className="list-disc pl-5">
              {rewrite.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h2 className="font-bold mt-4">Experience</h2>
            {rewrite.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold">
                  {exp.role} - {exp.company}
                </p>
                <ul className="list-disc pl-5">
                  {exp.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button onClick={downloadPDF} className="btn-primary">
            Download PDF
          </button>
        </>
      )}
    </div>
  );
    }
