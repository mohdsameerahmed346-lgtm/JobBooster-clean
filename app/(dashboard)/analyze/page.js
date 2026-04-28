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

// ✅ DEFAULT (FIX BLANK UI)
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

  // ✏️ UPDATE FIELD
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

  // ↩️ UNDO
  const undo = () => {
    if (historyIndex <= 0) return;
    const index = historyIndex - 1;
    setEditable(history[index]);
    setHistoryIndex(index);
  };

  // ↪️ REDO
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
      };

      await saveResumeState(user.uid, data);
      await saveVersion(user.uid, data);

      const v = await getVersions(user.uid);
      setVersions(v);
    }, 2000);
  }, [editable, sectionOrder]);

  // 🏷️ SAVE NAMED VERSION
  const saveNamedVersion = async () => {
    if (!editable || !user) return;

    await saveVersion(
      user.uid,
      { resume: editable, layout: sectionOrder },
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
    pushHistory(v.resume);
  };

  // 🔍 DIFF VIEW
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

  // 🧱 RENDER SECTION (INLINE EDIT SUPPORT)
  const renderSection = (section) => {
    if (section === "summary") {
      return (
        <textarea
          value={editable.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          className="w-full border p-2 rounded"
        />
      );
    }

    if (section === "skills") {
      return (
        <div className="flex flex-wrap gap-2">
          {editable.skills.map((s, i) => (
            <input
              key={i}
              value={s}
              onChange={(e) => {
                const skills = [...editable.skills];
                skills[i] = e.target.value;
                updateField("skills", skills);
              }}
              className="border px-2 py-1 rounded"
            />
          ))}
        </div>
      );
    }

    if (section === "experience") {
      return editable.experience.map((exp, i) => (
        <div key={i} className="mb-2">
          <input
            value={exp.role}
            onChange={(e) => {
              const updated = [...editable.experience];
              updated[i].role = e.target.value;
              updateField("experience", updated);
            }}
            className="border p-1 w-full"
          />
          <input
            value={exp.company}
            onChange={(e) => {
              const updated = [...editable.experience];
              updated[i].company = e.target.value;
              updateField("experience", updated);
            }}
            className="border p-1 w-full"
          />
        </div>
      );
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

      {/* SPLIT VIEW */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT (INPUT) */}
        <div className="w-full md:w-1/2 p-4 space-y-3 overflow-y-auto">
          <textarea
            placeholder="Paste resume text..."
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
            value={editable.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="input"
          />
        </div>

        {/* RIGHT (LIVE PREVIEW) */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4 overflow-y-auto">

          <div ref={pdfRef} className="bg-white p-6 rounded shadow">

            <h1 className="text-xl font-bold mb-3">
              {editable.name}
            </h1>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(p) => (
                  <div ref={p.innerRef} {...p.droppableProps}>
                    {sectionOrder.map((sec, i) => (
                      <Draggable key={sec} draggableId={sec} index={i}>
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            className="mb-4 border p-3 rounded bg-white"
                          >
                            <div
                              {...p.dragHandleProps}
                              className="text-xs text-gray-400 cursor-move mb-2"
                            >
                              Drag
                            </div>

                            {renderSection(sec)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {p.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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

            {/* DIFF */}
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
