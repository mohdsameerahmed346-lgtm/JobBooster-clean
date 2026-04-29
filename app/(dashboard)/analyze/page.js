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
    setEditable(history[historyIndex - 1]);
    setHistoryIndex(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    setEditable(history[historyIndex + 1]);
    setHistoryIndex(historyIndex + 1);
  };

  // 🤖 ATS ENGINE
  useEffect(() => {
    if (!job || !editable) return;

    const jobWords = job.toLowerCase().split(/\W+/);
    const resumeText = JSON.stringify(editable).toLowerCase();

    const unique = [...new Set(jobWords.filter(w => w.length > 3))];

    const matched = unique.filter(w => resumeText.includes(w));
    const missing = unique.filter(w => !resumeText.includes(w));

    const score = Math.round((matched.length / unique.length) * 100);

    setAtsScore(score || 0);
    setMissingKeywords(missing.slice(0, 15));

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
    }, 1500);

  }, [editable, sectionOrder, template]);

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

  // 🎨 TEMPLATE
  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };

    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white">

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 flex flex-wrap gap-2 p-3 bg-black border-b">
        <button onClick={undo} className="btn">Undo</button>
        <button onClick={redo} className="btn">Redo</button>
        <button onClick={downloadPDF} className="btn">PDF</button>
        <button onClick={exportDOCX} className="btn">DOCX</button>
        <button onClick={shareResume} className="btn">Share</button>
        <button onClick={improveBullets} className="btn">
          {improving ? "Improving..." : "Improve"}
        </button>

        <div className="ml-auto font-bold">
          ATS: {atsScore}%
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-4 space-y-4 overflow-y-auto">
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

          {/* KEYWORDS */}
          <div>
            <h3 className="font-bold mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((k,i)=>(
                <span key={i} className="bg-red-500/20 px-2 py-1 rounded text-sm">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:block w-1/2 bg-gray-200 p-6 overflow-y-auto">

          <div className="flex gap-2 mb-4">
            {["modern","minimal","creative"].map(t=>(
              <button
                key={t}
                onClick={()=>setTemplate(t)}
                className={`px-3 py-1 rounded ${
                  template===t ? "bg-blue-500 text-white" : "bg-white text-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div ref={pdfRef} className="bg-white p-6 rounded shadow text-black">
            {renderTemplate()}
          </div>

        </div>

      </div>
    </div>
  );
         }
