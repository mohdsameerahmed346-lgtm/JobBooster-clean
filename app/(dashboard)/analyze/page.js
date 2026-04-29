"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

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

  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "skills",
    "experience",
  ]);

  const [template, setTemplate] = useState("modern");

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [versions, setVersions] = useState([]);
  const [versionName, setVersionName] = useState("");

  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  const pdfRef = useRef();
  const autosaveRef = useRef(null);

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      setUser(u);

      const layout = await getLayout(u.uid);
      if (layout) setSectionOrder(layout);

      setVersions(await getVersions(u.uid));
    });

    return () => unsub();
  }, []);

  // SKILL GAP AUTO-FILL
  useEffect(() => {
    try {
      const fix = localStorage.getItem("fixData");
      if (!fix) return;

      const parsed = JSON.parse(fix);

      setJob(parsed.job || "");
      setResumeText(
        `Improve resume and include: ${parsed.missingSkills?.join(", ")}`
      );

      localStorage.removeItem("fixData");
    } catch {}
  }, []);

  // HISTORY
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

  // DRAG
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setSectionOrder(items);
    if (user) await saveLayout(user.uid, items);
  };

  // UNDO / REDO
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

  // AUTOSAVE
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

  // RESTORE
  const restoreVersion = (v) => {
    if (!v?.resume) return;

    setEditable(v.resume);
    setSectionOrder(v.layout || sectionOrder);
    setTemplate(v.template || "modern");
    pushHistory(v.resume);
  };

  // PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  // DOCX
  const exportDOCX = async () => {
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

  // SHARE
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

  // TEMPLATE
  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };

    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  return (
    <div className="flex flex-col h-screen">

      <div className="flex flex-wrap gap-2 p-3 border-b">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={downloadPDF}>PDF</button>
        <button onClick={exportDOCX}>DOCX</button>
        <button onClick={shareResume}>Share</button>

        <input
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Version name"
        />
      </div>

      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-4 space-y-3 overflow-y-auto">
          <textarea value={resumeText} onChange={(e)=>setResumeText(e.target.value)} className="input"/>
          <textarea value={job} onChange={(e)=>setJob(e.target.value)} className="input"/>

          <input value={editable.name} onChange={(e)=>updateField("name", e.target.value)} className="input"/>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4 overflow-y-auto">

          {/* TEMPLATE SWITCH */}
          <div className="flex gap-2 mb-3">
            {["modern","minimal","creative"].map(t=>(
              <button key={t} onClick={()=>setTemplate(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* ✅ FIXED PREVIEW */}
          <div ref={pdfRef} className="bg-white p-6 rounded shadow">
            {renderTemplate()}
          </div>

          {/* VERSION */}
          <div className="bg-black text-white p-3 mt-4">
            {versions.map((v,i)=>(
              <div key={i} onClick={()=>restoreVersion(v)}>
                {v.name || "Auto"}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
