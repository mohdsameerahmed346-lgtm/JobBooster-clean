"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import ResumeTemplateModern from "../../../components/ResumeTemplateModern";
import ResumeTemplateMinimal from "../../../components/ResumeTemplateMinimal";

export default function SkillGap() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("modern");

  const analyze = async () => {
    if (!file) return alert("Upload a resume");

    setLoading(true);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/skill-gap", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setData(json);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  // 📄 DOWNLOAD PDF
  const downloadPDF = async () => {
    const element = document.getElementById("resume-preview");

    if (!element) {
      alert("Resume not found");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📄 Resume Builder</h1>

      {/* Upload */}
      <div className="glass p-6 rounded-xl space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={analyze} className="btn-primary">
          Analyze Resume
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-400">Analyzing resume...</div>
      )}

      {/* Error */}
      {data?.error && (
        <div className="text-red-400">{data.error}</div>
      )}

      {/* RESULT */}
      {data && !data.error && (
        <div className="space-y-6">

          {/* TEMPLATE SWITCH */}
          <div className="flex gap-3">
            <button
              onClick={() => setTemplate("modern")}
              className={`btn-primary ${template === "modern" ? "opacity-100" : "opacity-50"}`}
            >
              Modern
            </button>

            <button
              onClick={() => setTemplate("minimal")}
              className={`btn-primary ${template === "minimal" ? "opacity-100" : "opacity-50"}`}
            >
              Minimal
            </button>
          </div>

          {/* PREVIEW */}
          <div className="border rounded-xl overflow-hidden">

            {template === "modern" && (
              <ResumeTemplateModern data={data} />
            )}

            {template === "minimal" && (
              <ResumeTemplateMinimal data={data} />
            )}

          </div>

          {/* DOWNLOAD */}
          <button onClick={downloadPDF} className="btn-primary">
            Download Styled PDF
          </button>

        </div>
      )}

    </div>
  );
    }
