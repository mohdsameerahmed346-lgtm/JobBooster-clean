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

// ✅ TEMPLATES
import ModernTemplate from "../../../components/templates/ModernTemplate";
import MinimalTemplate from "../../../components/templates/MinimalTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";

// ✅ DEFAULT
const DEFAULT_RESUME = {
  name: "Your Name",
  summary: "Write a strong professional summary...",
  skills: ["React", "JavaScript"],
  experience: [
    { role: "Frontend Developer", company: "Company Name" }
  ]
};

export default function Analyze() {

  const [user, setUser] = useState(null);

  const [resumeText, setResumeText] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);

  const [editable, setEditable] = useState(DEFAULT_RESUME);

  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "skills",
    "experience",
  ]);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [versions, setVersions] = useState([]);
  const [versionName, setVersionName] = useState("");

  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  // ✅ NEW TEMPLATE STATE
  const [template, setTemplate] = useState("modern");

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

  // 🧠 HISTORY
  const pushHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);

    if (newHistory.length > 20) newHistory.shift();

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // ✏️ UPDATE
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

  // 🤖 AI REWRITE
  const handleRewrite = async () => {
    if (!resumeText.trim()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resumeText", resumeText);
      formData.append("job", job);

      const res = await fetch("/api/rewrite-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const safe = data?.name ? data : DEFAULT_RESUME;

      setEditable(safe);
      pushHistory(safe);
    } catch {
      alert("AI failed");
    }

    setLoading(false);
  };

  // ↩️ UNDO / REDO
  const undo = () => {
    if (historyIndex <= 0) return;
    const index = historyIndex - 1;
    setEditable(history[index]);
    setHistoryIndex(index);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const index = historyIndex + 1;
    setEditable(history[index]);
    setHistoryIndex(index);
  };

  // 💾 AUTOSAVE + VERSION
  useEffect(() => {
    if (!editable || !user) return;

    clearTimeout(autosaveRef.current);

    autosaveRef.current = setTimeout(async () => {
      const data = {
        resume: editable,
        layout: sectionOrder,
        template, // ✅ NEW
      };

      await saveResumeState(user.uid, data);
      await saveVersion(user.uid, data);

      const v = await getVersions(user.uid);
      setVersions(v);
    }, 2000);

  }, [editable, sectionOrder, template]);

  // 🏷️ SAVE NAMED VERSION
  const saveNamedVersion = async () => {
    if (!editable || !user) return;

    await saveVersion(
      user.uid,
      { resume: editable, layout: sectionOrder, template },
      versionName || "Manual Save"
    );

    const v = await getVersions(user.uid);
    setVersions(v);
    setVersionName("");
  };

  // 🔄 RESTORE
  const restoreVersion = (v) => {
    setEditable(v.resume);
    setSectionOrder(v.layout || sectionOrder);
    setTemplate(v.template || "modern"); // ✅ NEW
    pushHistory(v.resume);
  };

  // 🔍 DIFF
  const diffText = (oldText = "", newText = "") => {
    return newText.split(" ").map((w) =>
      oldText.includes(w)
        ? w
        : `<span style="color:lime">${w}</span>`
    ).join(" ");
  };

  // 📄 PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("resume.pdf");
  };

  // 🎨 TEMPLATE RENDER
  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };

    switch (template) {
      case "minimal":
        return <MinimalTemplate {...props} />;
      case "creative":
        return <CreativeTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">

      {/* TOP BAR */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-800">
        <button onClick={handleRewrite} className="btn-primary">AI Rewrite</button>
        <button onClick={undo} className="btn-primary">Undo</button>
        <button onClick={redo} className="btn-primary">Redo</button>
        <button onClick={downloadPDF} className="btn-primary">Export PDF</button>

        <input
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Version name"
          className="input w-40"
        />

        <button onClick={saveNamedVersion} className="btn-primary">
          Save Version
        </button>
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

          {/* TEMPLATE SWITCHER */}
          <div className="flex gap-2 mb-3">
            {["modern","minimal","creative"].map((t)=>(
              <button key={t}
                onClick={()=>setTemplate(t)}
                className={`px-3 py-1 rounded ${template===t?"bg-blue-500 text-white":"bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* TEMPLATE PREVIEW */}
          <div ref={pdfRef} className="bg-white p-6 rounded shadow">
            {renderTemplate()}
          </div>

          {/* VERSION TIMELINE */}
          <div className="bg-black text-white p-4 mt-4 rounded">
            <h3 className="mb-2 text-sm">Version History</h3>

            {versions.map((v, i) => (
              <div key={i} className="mb-2">
                <div onClick={() => restoreVersion(v)} className="cursor-pointer">
                  {v.name || "Auto"} • {new Date(v.createdAt).toLocaleTimeString()}
                </div>

                <div className="flex gap-2 text-xs">
                  <button onClick={() => setCompareA(v)}>A</button>
                  <button onClick={() => setCompareB(v)}>B</button>
                </div>
              </div>
            ))}

            {compareA && compareB && (
              <div className="mt-3 text-xs">
                <div
                  dangerouslySetInnerHTML={{
                    __html: diffText(
                      compareA.resume.summary,
                      compareB.resume.summary
                    ),
                  }}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
    }
