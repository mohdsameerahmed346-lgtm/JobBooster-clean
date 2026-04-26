"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Analyze() {
  const [resumeText, setResumeText] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewrite, setRewrite] = useState(null);

  const [template, setTemplate] = useState("modern");

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

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("resume.pdf");
  };

  // 🎨 TEMPLATE RENDERER
  const renderTemplate = () => {
    if (!rewrite) return null;

    switch (template) {

      // 🔹 MODERN
      case "modern":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold">{rewrite.name}</h1>
            <p className="text-gray-600 mb-4">{rewrite.summary}</p>

            <h2 className="font-semibold mt-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {rewrite.skills.map((s, i) => (
                <span key={i} className="bg-gray-200 px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>

            <h2 className="font-semibold mt-4">Experience</h2>
            {rewrite.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <p className="font-bold">{exp.role}</p>
                <p className="text-sm text-gray-500">{exp.company}</p>
                <ul className="list-disc pl-5">
                  {exp.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      // 🔹 PROFESSIONAL
      case "professional":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold border-b pb-2">
              {rewrite.name}
            </h1>

            <p className="mt-3">{rewrite.summary}</p>

            <h2 className="font-bold mt-6">Skills</h2>
            <ul className="list-disc pl-5">
              {rewrite.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h2 className="font-bold mt-6">Experience</h2>
            {rewrite.experience.map((exp, i) => (
              <div key={i} className="mt-3">
                <strong>{exp.role}</strong> — {exp.company}
                <ul className="list-disc pl-5">
                  {exp.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      // 🔹 CREATIVE
      case "creative":
        return (
          <div className="p-8 bg-gray-100">
            <h1 className="text-3xl font-extrabold text-blue-600">
              {rewrite.name}
            </h1>

            <p className="italic mt-2">{rewrite.summary}</p>

            <h2 className="mt-6 text-blue-600 font-bold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {rewrite.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-200 text-blue-800 px-2 py-1 rounded"
                >
                  {s}
                </span>
              ))}
            </div>

            <h2 className="mt-6 text-blue-600 font-bold">Experience</h2>
            {rewrite.experience.map((exp, i) => (
              <div key={i} className="mt-3 bg-white p-3 rounded">
                <p className="font-semibold">{exp.role}</p>
                <p className="text-sm">{exp.company}</p>
                <ul className="list-disc pl-5">
                  {exp.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">Resume Analyzer</h1>

      {/* INPUT */}
      <textarea
        placeholder="Paste your resume..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        className="input"
        rows={6}
      />

      <textarea
        placeholder="Job description (optional)"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="input"
        rows={4}
      />

      <button onClick={handleRewrite} className="btn-primary">
        Improve Resume with AI
      </button>

      {loading && <p>Generating...</p>}

      {/* TEMPLATE SELECTOR */}
      {rewrite && (
        <div className="flex gap-3">
          {["modern", "professional", "creative"].map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-4 py-2 rounded ${
                template === t
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* TEMPLATE OUTPUT */}
      {rewrite && (
        <>
          <div
            ref={pdfRef}
            className="bg-white text-black rounded-xl shadow"
          >
            {renderTemplate()}
          </div>

          <button onClick={downloadPDF} className="btn-primary">
            Download PDF
          </button>
        </>
      )}
    </div>
  );
        }
