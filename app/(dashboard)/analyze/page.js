"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { saveLayout, getLayout } from "../../../lib/layout";
import { saveResumeState } from "../../../lib/autosave";
import { getVersions, saveVersion } from "../../../lib/version";

import ModernTemplate from "../../../components/templates/ModernTemplate";
import MinimalTemplate from "../../../components/templates/MinimalTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";
import ProfessionalTemplate from "../../../components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "../../../components/templates/ExecutiveTemplate";

const DEFAULT_RESUME = {
  name: "",
  summary: "",
  skills: [],
  experience: [],
};

export default function Analyze() {
  const [user, setUser] = useState(null);

  const [resumeText, setResumeText] = useState("");
  const [job, setJob] = useState("");

  const [editable, setEditable] = useState(DEFAULT_RESUME);
  const [template, setTemplate] = useState("modern");

  const [atsScore, setAtsScore] = useState(0);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [matchedKeywords, setMatchedKeywords] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const pdfRef = useRef();
  const autosaveRef = useRef(null);

  // 🔐 AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      setUser(u);

      const v = await getVersions(u.uid);
      console.log("versions loaded", v);
    });

    return () => unsub();
  }, []);

  // 🔥 SKILL GAP AUTO FIX
  useEffect(() => {
    const fix = localStorage.getItem("fixData");

    if (fix) {
      try {
        const parsed = JSON.parse(fix);

        setJob(parsed.job || "");
        setResumeText(
          `Improve resume with: ${(parsed.missingSkills || []).join(", ")}`
        );

        localStorage.removeItem("fixData");
      } catch {}
    }
  }, []);

  // 🧠 ATS ENGINE (SAFE FIXED)
  useEffect(() => {
    if (!job || !editable) return;

    const jobWords = (job || "").toLowerCase().split(/\W+/);
    const resumeWords = JSON.stringify(editable || {}).toLowerCase();

    const unique = [...new Set(jobWords.filter((w) => w.length > 3))];

    const matched = unique.filter((w) =>
      resumeWords.includes(w)
    );

    const missing = unique.filter(
      (w) => !resumeWords.includes(w)
    );

    const score =
      unique.length > 0
        ? Math.round((matched.length / unique.length) * 100)
        : 0;

    setAtsScore(score);
    setMissingKeywords(missing.slice(0, 15));
    setMatchedKeywords(matched.slice(0, 10));
  }, [job, editable]);

  // 💾 AUTOSAVE
  useEffect(() => {
    if (!editable || !user) return;

    clearTimeout(autosaveRef.current);

    autosaveRef.current = setTimeout(async () => {
      const data = { resume: editable, template };
      await saveResumeState(user.uid, data);
      await saveVersion(user.uid, data);
    }, 2000);
  }, [editable, template]);

  // 📄 PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  // 📄 DOCX
  const exportDOCX = async () => {
    const { saveAs } = await import("file-saver");
    const { Document, Packer, Paragraph, TextRun } = await import("docx");

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: editable.name || "Your Name",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph(editable.summary || ""),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  // 🔗 SHARE
  const shareResume = async () => {
    const id = crypto.randomUUID();

    await fetch("/api/share-resume", {
      method: "POST",
      body: JSON.stringify({
        id,
        data: { resume: editable, template },
      }),
    });

    navigator.clipboard.writeText(`${window.location.origin}/resume/${id}`);
    alert("Link copied!");
  };

  // ➕ ADD SKILL
  const addKeyword = (word) => {
    if (!editable.skills?.includes(word)) {
      setEditable({
        ...editable,
        skills: [...(editable.skills || []), word],
      });
    }
  };

  // 🤖 AI SUGGESTIONS
  const getSuggestions = async () => {
    setLoadingAI(true);

    try {
      const res = await fetch("/api/rewrite-resume", {
        method: "POST",
        body: new FormData(),
      });

      const data = await res.json();
      setSuggestions(data?.tips || []);
    } catch {}

    setLoadingAI(false);
  };

  // 🎨 TEMPLATE
  const renderTemplate = () => {
    const props = { data: editable };

    switch (template) {
      case "minimal":
        return <MinimalTemplate {...props} />;
      case "creative":
        return <CreativeTemplate {...props} />;
      case "professional":
        return <ProfessionalTemplate {...props} />;
      case "executive":
        return <ExecutiveTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-3 bg-black text-white">
        <div className="font-semibold">ATS Score: {atsScore}%</div>

        <div className="flex gap-3">
          <button onClick={downloadPDF}>PDF</button>
          <button onClick={exportDOCX}>DOCX</button>
          <button onClick={shareResume}>Share</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-1/3 bg-white p-4 space-y-4 overflow-y-auto border-r">

          <textarea
            placeholder="Paste your resume..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="input w-full"
          />

          <textarea
            placeholder="Paste job description..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="input w-full"
          />

          <input
            placeholder="Your Name"
            value={editable.name}
            onChange={(e) =>
              setEditable({ ...editable, name: e.target.value })
            }
            className="input w-full"
          />

          {/* ATS */}
          <div className="bg-gray-900 text-white p-3 rounded">
            <h3 className="text-sm mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((k, i) => (
                <button
                  key={i}
                  onClick={() => addKeyword(k)}
                  className="bg-red-500/20 px-2 py-1 rounded text-xs"
                >
                  + {k}
                </button>
              ))}
            </div>
          </div>

          {/* AI */}
          <div className="bg-white border p-3 rounded">
            <button
              onClick={getSuggestions}
              className="btn-primary w-full"
            >
              {loadingAI ? "Loading..." : "AI Suggestions"}
            </button>

            {suggestions.map((s, i) => (
              <div key={i} className="text-sm mt-2">
                • {s}
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/3 flex flex-col">

          {/* TEMPLATE SCROLL */}
          <div className="p-4 bg-white border-b">
            <div className="flex gap-4 overflow-x-auto">
              {[
                "modern",
                "minimal",
                "creative",
                "professional",
                "executive",
              ].map((t) => (
                <div
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`min-w-[140px] cursor-pointer border rounded-lg p-2 ${
                    template === t ? "border-blue-500" : ""
                  }`}
                >
                  <div className="text-xs text-center capitalize">{t}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PREVIEW */}
          <div className="flex-1 overflow-auto p-6 flex justify-center">
            <div
              ref={pdfRef}
              className="bg-white w-[794px] min-h-[1123px] shadow-lg p-8"
            >
              {renderTemplate()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
    }
