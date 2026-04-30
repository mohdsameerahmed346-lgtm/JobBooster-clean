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

  // ATS
  const [atsScore, setAtsScore] = useState(0);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [matchedKeywords, setMatchedKeywords] = useState([]);

  // AI
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

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
      const parsed = JSON.parse(fix);
      setJob(parsed.job || "");
      setResumeText(`Improve resume with: ${parsed.missingSkills?.join(", ")}`);
      localStorage.removeItem("fixData");
    }
  }, []);

  // 🧠 HISTORY
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

  // 🔀 DRAG
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setSectionOrder(items);
    if (user) await saveLayout(user.uid, items);
  };

  // 🤖 ATS ENGINE (UPGRADED)
  useEffect(() => {
    if (!job || !editable) return;

    const jobWords = job.toLowerCase().split(/\W+/);
    const resumeWords = JSON.stringify(editable).toLowerCase();

    const unique = [...new Set(jobWords.filter(w => w.length > 3))];

    const matched = unique.filter(w => resumeWords.includes(w));
    const missing = unique.filter(w => !resumeWords.includes(w));

    const score = Math.round((matched.length / unique.length) * 100);

    setAtsScore(score || 0);
    setMissingKeywords(missing.slice(0, 15));
    setMatchedKeywords(matched.slice(0, 10));

  }, [job, editable]);

  // 💾 AUTOSAVE
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
            children: [new TextRun({ text: editable.name, bold: true, size: 32 })],
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

  // 🚀 ADD KEYWORD
  const addKeyword = (word) => {
    if (!editable.skills.includes(word)) {
      updateField("skills", [...editable.skills, word]);
    }
  };

  // 🤖 AI SUGGESTIONS
  const getSuggestions = async () => {
    setLoadingAI(true);

    const res = await fetch("/api/rewrite-resume", {
      method: "POST",
      body: new FormData(),
    });

    const data = await res.json();
    setSuggestions(data?.tips || []);
    setLoadingAI(false);
  };

  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };
    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  return (
    <div className="flex flex-col h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center p-3 border-b bg-black text-white">
        <div>ATS: {atsScore}%</div>

        <div className="flex gap-2">
          <button onClick={downloadPDF}>PDF</button>
          <button onClick={exportDOCX}>DOCX</button>
          <button onClick={shareResume}>Share</button>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/3 p-4 space-y-4 border-r overflow-y-auto">

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

          {/* ATS PANEL */}
          <div className="bg-gray-900 text-white p-3 rounded">
            <h3>Missing Keywords</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {missingKeywords.map((k,i)=>(
                <button
                  key={i}
                  onClick={()=>addKeyword(k)}
                  className="bg-red-500/20 px-2 py-1 rounded"
                >
                  + {k}
                </button>
              ))}
            </div>
          </div>

          {/* AI PANEL */}
          <div className="bg-white p-3 rounded border">
            <button onClick={getSuggestions}>
              {loadingAI ? "Loading..." : "Get AI Suggestions"}
            </button>

            {suggestions.map((s,i)=>(
              <div key={i} className="text-sm mt-2">
                • {s}
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT PREVIEW */}
        <div className="w-full md:w-2/3 p-4 bg-gray-100 overflow-y-auto">

          <div className="flex gap-2 mb-3">
            {["modern","minimal","creative"].map(t=>(
              <button key={t} onClick={()=>setTemplate(t)}>
                {t}
              </button>
            ))}
          </div>

          <div ref={pdfRef} className="bg-white p-6 shadow rounded">
            {renderTemplate()}
          </div>

        </div>

      </div>
    </div>
  );
}
