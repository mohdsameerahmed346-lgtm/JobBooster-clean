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
      setResumeText(
        `Improve resume with: ${parsed.missingSkills?.join(", ")}`
      );

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

  // ↩️ UNDO / REDO
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

  // 🔗 SHARE
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

  // ➕ SECTION
  const addSection = () => {
    const name = prompt("Section name?");
    if (!name) return;
    setSectionOrder([...sectionOrder, name]);
  };

  const removeSection = (sec) => {
    setSectionOrder(sectionOrder.filter((s) => s !== sec));
  };

  // 🎨 TEMPLATE RENDER (FIXED)
  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };

    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  return (
    <div className="flex flex-col h-screen">

      {/* TOP BAR */}
      <div className="flex flex-wrap gap-3 p-3 border-b bg-white sticky top-0 z-10">
        <button className="btn-primary" onClick={undo}>Undo</button>
        <button className="btn-primary" onClick={redo}>Redo</button>

        <button className="btn-primary" onClick={downloadPDF}>Export PDF</button>
        <button className="btn-primary" onClick={exportDOCX}>Export DOCX</button>

        <button className="btn-primary" onClick={shareResume}>Share Link</button>
        <button className="btn-secondary" onClick={addSection}>+ Section</button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-4 space-y-3">
          <textarea
            placeholder="Paste your resume..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="input"
          />

          <textarea
            placeholder="Paste job description..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="input"
          />

          <input
            placeholder="Your Name"
            value={editable.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="input"
          />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4 overflow-y-auto">

          {/* TEMPLATE SELECTOR (IMPROVED UI) */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {["modern", "minimal", "creative"].map((t) => (
              <div
                key={t}
                onClick={() => setTemplate(t)}
                className={`cursor-pointer border rounded-lg p-3 text-center shadow-sm ${
                  template === t ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                {t}
              </div>
            ))}
          </div>

          {/* PREVIEW (FIXED — NO DUPLICATION) */}
          <div ref={pdfRef} className="bg-white p-6 rounded shadow">
            {renderTemplate()}
          </div>

          {/* SECTION CONTROLS */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold">Sections</h3>
            {sectionOrder.map((sec) => (
              <div key={sec} className="flex justify-between items-center bg-white p-2 rounded border">
                <span>{sec}</span>
                <button onClick={() => removeSection(sec)}>❌</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
