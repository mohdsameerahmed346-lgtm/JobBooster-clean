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

  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "skills",
    "experience",
  ]);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [versions, setVersions] = useState([]);

  // ATS
  const [atsScore, setAtsScore] = useState(0);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [matchedKeywords, setMatchedKeywords] = useState([]);

  // AI
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const pdfRef = useRef();
  const autosaveRef = useRef(null);

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      const layout = await getLayout(u.uid);
      if (layout) setSectionOrder(layout);

      const v = await getVersions(u.uid);
      setVersions(v);
    });

    return () => unsub();
  }, []);

  // HISTORY
  const pushHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateField = (field, value) => {
    const updated = { ...editable, [field]: value };
    setEditable(updated);
    pushHistory(updated);
  };

  // ATS ENGINE (FIXED SAFE)
  useEffect(() => {
    if (!job || !editable) return;

    const jobWords = (job || "").toLowerCase().split(/\W+/);
    const resumeWords = JSON.stringify(editable || {}).toLowerCase();

    const unique = [...new Set(jobWords.filter(w => w && w.length > 3))];

    const matched = unique.filter(w => resumeWords.includes(w));
    const missing = unique.filter(w => !resumeWords.includes(w));

    const score = unique.length
      ? Math.round((matched.length / unique.length) * 100)
      : 0;

    setAtsScore(score);
    setMissingKeywords(missing.slice(0, 15));
    setMatchedKeywords(matched.slice(0, 10));

  }, [job, editable]);

  // AUTOSAVE
  useEffect(() => {
    if (!editable || !user) return;

    clearTimeout(autosaveRef.current);

    autosaveRef.current = setTimeout(async () => {
      const data = { resume: editable, layout: sectionOrder, template };
      await saveResumeState(user.uid, data);
      await saveVersion(user.uid, data);
      setVersions(await getVersions(user.uid));
    }, 2000);

  }, [editable, sectionOrder, template]);

  // PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  // DOCX
  const exportDOCX = async () => {
    const { saveAs } = await import("file-saver");
    const { Document, Packer, Paragraph, TextRun } = await import("docx");

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: editable?.name || "", bold: true, size: 32 })],
          }),
          new Paragraph(editable?.summary || ""),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  // SHARE
  const shareResume = async () => {
    if (!user) return;

    const id = crypto.randomUUID();

    await fetch("/api/share-resume", {
      method: "POST",
      body: JSON.stringify({
        id,
        data: { resume: editable, layout: sectionOrder, template },
      }),
    });

    navigator.clipboard.writeText(`${window.location.origin}/resume/${id}`);
    alert("Link copied!");
  };

  // KEYWORD ADD
  const addKeyword = (word) => {
    if (!word) return;

    const skills = editable?.skills || [];

    if (!skills.includes(word)) {
      updateField("skills", [...skills, word]);
    }
  };

  // AI Suggestions
  const getSuggestions = async () => {
    setLoadingAI(true);

    try {
      const res = await fetch("/api/rewrite-resume", { method: "POST" });
      const data = await res.json();
      setSuggestions(data?.tips || []);
    } catch {}

    setLoadingAI(false);
  };

  // TEMPLATE
  const renderTemplate = () => {
    const props = { data: editable };

    switch (template) {
      case "minimal": return <MinimalTemplate {...props} />;
      case "creative": return <CreativeTemplate {...props} />;
      case "professional": return <ProfessionalTemplate {...props} />;
      case "executive": return <ExecutiveTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <div className="text-sm">ATS Score: {atsScore}%</div>

        <div className="flex gap-3">
          <button onClick={downloadPDF}>PDF</button>
          <button onClick={exportDOCX}>DOCX</button>
          <button onClick={shareResume}>Share</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-1/3 p-4 space-y-4 overflow-y-auto bg-white border-r">

          <textarea
            placeholder="Paste your resume..."
            value={resumeText}
            onChange={(e)=>setResumeText(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Paste job description..."
            value={job}
            onChange={(e)=>setJob(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Your Name"
            value={editable?.name || ""}
            onChange={(e)=>updateField("name", e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* ATS PANEL */}
          <div className="bg-gray-900 text-white p-3 rounded">
            <h3 className="text-sm mb-2">Missing Keywords</h3>

            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((k,i)=>(
                <button
                  key={i}
                  onClick={()=>addKeyword(k)}
                  className="bg-red-500/20 px-2 py-1 rounded text-xs"
                >
                  + {k}
                </button>
              ))}
            </div>

            <h3 className="text-sm mt-3 mb-1">Matched</h3>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((k,i)=>(
                <span key={i} className="bg-green-500/20 px-2 py-1 rounded text-xs">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* AI PANEL */}
          <div className="bg-white border p-3 rounded">
            <button onClick={getSuggestions} className="w-full border p-2 rounded">
              {loadingAI ? "Loading..." : "AI Suggestions"}
            </button>

            {suggestions.map((s,i)=>(
              <div key={i} className="text-sm mt-2">• {s}</div>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/3 p-4 overflow-y-auto">

          {/* TEMPLATE SCROLL */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-4">

            {[
              { id:"modern", label:"Modern" },
              { id:"minimal", label:"Minimal" },
              { id:"creative", label:"Creative" },
              { id:"professional", label:"Pro" },
              { id:"executive", label:"Executive" },
            ].map((t)=>(
              <div
                key={t.id}
                onClick={()=>setTemplate(t.id)}
                className={`min-w-[160px] border rounded-lg cursor-pointer
                ${template===t.id?"border-blue-500 shadow":"border-gray-300"}`}
              >
                <div className="h-32 bg-white p-2 text-xs">
                  <div className="font-bold">{editable?.name || "Name"}</div>
                  <div className="text-gray-500">
                    {(editable?.summary || "").slice(0,40)}
                  </div>
                </div>
                <div className="text-center text-xs py-1 bg-gray-50">
                  {t.label}
                </div>
              </div>
            ))}
          </div>

          {/* PREVIEW */}
          <div className="flex justify-center">
            <div ref={pdfRef} className="bg-white shadow-lg p-6">
              {renderTemplate()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
    }
