"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { saveLayout, getLayout } from "../../../lib/layout";
import { saveResumeState } from "../../../lib/autosave";
import { getVersions, saveVersion } from "../../../lib/version";

import ModernTemplate from "../../../components/templates/ModernTemplate";
import MinimalTemplate from "../../../components/templates/MinimalTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";

// ================= DEFAULT =================
const DEFAULT_RESUME = {
  name: "Your Name",
  summary: "Write a strong professional summary...",
  skills: ["React", "JavaScript"],
  experience: [{ role: "Frontend Developer", company: "Company Name" }],
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
  const [versionName, setVersionName] = useState("");

  const [atsScore, setAtsScore] = useState(null);
  const [atsDetails, setAtsDetails] = useState(null);

  const pdfRef = useRef();
  const autosaveRef = useRef(null);

  // ================= AUTH =================
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

  // ================= SKILL GAP AUTO FIX =================
  useEffect(() => {
    const fix = localStorage.getItem("fixData");

    if (fix) {
      const parsed = JSON.parse(fix);

      setJob(parsed.job || "");
      setResumeText(
        `Improve resume with: ${parsed.missingSkills?.join(", ")}`
      );

      localStorage.removeItem("fixData");
    }
  }, []);

  // ================= HISTORY =================
  const pushHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);

    if (newHistory.length > 20) newHistory.shift();

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateField = (field, value) => {
    const updated = { ...editable, [field]: value };
    setEditable(updated);
    pushHistory(updated);
  };

  // ================= DRAG =================
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setSectionOrder(items);

    if (user) await saveLayout(user.uid, items);
  };

  // ================= UNDO REDO =================
  const undo = () => {
    if (historyIndex <= 0) return;
    const i = historyIndex - 1;
    setEditable(history[i]);
    setHistoryIndex(i);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const i = historyIndex + 1;
    setEditable(history[i]);
    setHistoryIndex(i);
  };

  // ================= ATS SYSTEM (🔥 NEW CORE FEATURE) =================
  const analyzeATS = () => {
    if (!job || !resumeText) return alert("Add resume + job");

    const jobWords = job.toLowerCase().split(/\W+/);
    const resumeWords = resumeText.toLowerCase().split(/\W+/);

    const uniqueJob = [...new Set(jobWords)];
    const matches = uniqueJob.filter((w) => resumeWords.includes(w));

    const score = Math.round((matches.length / uniqueJob.length) * 100);

    const missing = uniqueJob.filter((w) => !resumeWords.includes(w)).slice(0, 20);

    setAtsScore(score);
    setAtsDetails({
      matched: matches.slice(0, 20),
      missing,
    });
  };

  // ================= AUTOSAVE =================
  useEffect(() => {
    if (!editable || !user) return;

    clearTimeout(autosaveRef.current);

    autosaveRef.current = setTimeout(async () => {
      const data = {
        resume: editable,
        layout: sectionOrder,
        template,
      };

      await saveResumeState(user.uid, data);
      await saveVersion(user.uid, data);

      setVersions(await getVersions(user.uid));
    }, 2000);
  }, [editable, sectionOrder, template]);

  // ================= PDF =================
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  // ================= DOCX (SAFE IMPORT) =================
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
                  text: editable.name,
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph(editable.summary),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  // ================= SHARE =================
  const shareResume = async () => {
    if (!user) return;

    const id = crypto.randomUUID();

    await fetch("/api/share-resume", {
      method: "POST",
      body: JSON.stringify({
        id,
        data: {
          resume: editable,
          layout: sectionOrder,
          template,
        },
      }),
    });

    const link = `${window.location.origin}/resume/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  // ================= TEMPLATE =================
  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };

    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  return (
    <div className="flex flex-col h-screen">

      {/* ===== TOP BAR FIXED UI ===== */}
      <div className="flex flex-wrap gap-2 p-3 border-b bg-white sticky top-0 z-50">

        <button onClick={undo} className="btn-primary">Undo</button>
        <button onClick={redo} className="btn-primary">Redo</button>

        <button onClick={analyzeATS} className="btn-primary bg-green-600">
          ATS Score
        </button>

        <button onClick={downloadPDF} className="btn-primary">PDF</button>
        <button onClick={exportDOCX} className="btn-primary">DOCX</button>
        <button onClick={shareResume} className="btn-primary">Share</button>

      </div>

      <div className="flex flex-1 flex-col md:flex-row">

        {/* ===== LEFT PANEL (FIXED PLACEHOLDERS) ===== */}
        <div className="w-full md:w-1/2 p-4 space-y-3 overflow-y-auto">

          <textarea
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e)=>setResumeText(e.target.value)}
            className="input"
          />

          <textarea
            placeholder="Paste job description..."
            value={job}
            onChange={(e)=>setJob(e.target.value)}
            className="input"
          />

          <input
            placeholder="Your Name"
            value={editable.name}
            onChange={(e)=>updateField("name", e.target.value)}
            className="input"
          />

        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4 overflow-y-auto">

          {/* TEMPLATE UI FIX */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {["modern","minimal","creative"].map((t)=>(
              <button
                key={t}
                onClick={()=>setTemplate(t)}
                className={`p-2 border rounded ${template===t?"bg-blue-500 text-white":""}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* PREVIEW FIXED (NO DUPLICATE RENDER) */}
          <div ref={pdfRef} className="bg-white p-6 rounded shadow">
            {renderTemplate()}
          </div>

          {/* ===== ATS RESULT PANEL ===== */}
          {atsScore !== null && (
            <div className="mt-4 p-4 bg-black text-white rounded">

              <h2 className="text-lg font-bold">ATS Score: {atsScore}%</h2>

              <div className="mt-2 text-sm">
                <p>Matched Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {atsDetails.matched.map((w,i)=>(
                    <span key={i} className="bg-green-500/20 px-2 rounded">{w}</span>
                  ))}
                </div>

                <p className="mt-2">Missing Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {atsDetails.missing.map((w,i)=>(
                    <span key={i} className="bg-red-500/20 px-2 rounded">{w}</span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
    }
