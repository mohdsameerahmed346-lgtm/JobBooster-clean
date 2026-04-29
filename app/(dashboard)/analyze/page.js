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

  const [atsScore, setAtsScore] = useState(0);
  const [missingKeywords, setMissingKeywords] = useState([]);

  const [bulletSuggestions, setBulletSuggestions] = useState([]);
  const [improving, setImproving] = useState(false);

  const [recruiterMode, setRecruiterMode] = useState(false);

  const pdfRef = useRef();
  const autosaveRef = useRef(null);

  // 🔐 AUTH
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

  // 🔥 SKILL GAP AUTO FIX
  useEffect(() => {
    const fix = localStorage.getItem("fixData");

    if (fix) {
      try {
        const parsed = JSON.parse(fix);

        setJob(parsed.job || "");
        setResumeText(
          `Improve resume with: ${parsed.missingSkills?.join(", ")}`
        );

        localStorage.removeItem("fixData");
      } catch {}
    }
  }, []);

  // 🧠 HISTORY
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

  // 🔀 DRAG
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setSectionOrder(items);
    if (user) await saveLayout(user.uid, items);
  };

  // ↩️ UNDO REDO
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

  // 🤖 ATS ENGINE
  useEffect(() => {
    if (!job || !editable) return;

    const jobWords = job.toLowerCase().split(/\W+/);
    const resumeWords = JSON.stringify(editable).toLowerCase();

    const unique = [...new Set(jobWords.filter(w => w.length > 3))];

    const matched = unique.filter(w => resumeWords.includes(w));
    const missing = unique.filter(w => !resumeWords.includes(w));

    const score = Math.round((matched.length / unique.length) * 100);

    setAtsScore(score || 0);
    setMissingKeywords(missing.slice(0, 20));

  }, [job, editable]);

  // 💾 AUTOSAVE
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

  // 📄 PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  // 📄 DOCX (FIXED)
  const exportDOCX = async () => {
    const { saveAs } = await import("file-saver");
    const { Document, Packer, Paragraph, TextRun } = await import("docx");

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: editable.name, bold: true, size: 32 }),
            ],
          }),
          new Paragraph(editable.summary),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  // 🔗 SHARE
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

    const link = `${window.location.origin}/resume/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  // 🚀 BULLET IMPROVER
  const improveBullets = async () => {
    if (!editable?.experience?.length) return;

    setImproving(true);

    try {
      const res = await fetch("/api/improve-bullets", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          experience: editable.experience,
          job,
        }),
      });

      const data = await res.json();
      setBulletSuggestions(data.suggestions || []);
    } catch {
      alert("Failed");
    }

    setImproving(false);
  };

  // ➕ SECTION
  const addSection = () => {
    const name = prompt("Section name?");
    if (!name) return;
    setSectionOrder([...sectionOrder, name]);
  };

  const removeSection = (sec) => {
    setSectionOrder(sectionOrder.filter((s) => s !== sec));
  };

  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };

    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  return (
    <div className="flex flex-col h-screen">

      {/* TOP BAR */}
      <div className="flex flex-wrap gap-3 p-3 border-b bg-black text-white">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={downloadPDF}>PDF</button>
        <button onClick={exportDOCX}>DOCX</button>
        <button onClick={shareResume}>Share</button>
        <button onClick={addSection}>+ Section</button>
        <button onClick={improveBullets}>
          {improving ? "Improving..." : "Improve Bullets"}
        </button>
        <button onClick={()=>setRecruiterMode(!recruiterMode)}>
          Recruiter Mode
        </button>
      </div>

      {/* ATS PANEL */}
      <div className="p-3 bg-gray-900 text-white text-sm">
        ATS Score: {atsScore}%
        <div className="flex flex-wrap gap-2 mt-2">
          {missingKeywords.map((k,i)=>(
            <span key={i} className="bg-red-500/20 px-2 py-1 rounded">
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* BULLET PANEL */}
      {bulletSuggestions.length > 0 && (
        <div className="p-4 bg-white border-t">
          <h3 className="font-bold mb-2">AI Improvements</h3>
          {bulletSuggestions.map((b,i)=>(
            <div key={i} className="mb-3 border p-2">
              <div>Original: {b.original}</div>
              <div className="text-green-600">Improved: {b.improved}</div>
              <div>Score: {b.score}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-1/2 p-4 space-y-3 border-r">
          <textarea
            placeholder="Paste your resume..."
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

        {/* RIGHT */}
        <div className="w-1/2 p-4 bg-gray-100">
          <div className="flex gap-2 mb-3">
            {["modern","minimal","creative"].map(t=>(
              <button key={t} onClick={()=>setTemplate(t)}>
                {t}
              </button>
            ))}
          </div>

          <div ref={pdfRef} className="bg-white p-6">
            {renderTemplate()}
          </div>
        </div>

      </div>
    </div>
  );
}
