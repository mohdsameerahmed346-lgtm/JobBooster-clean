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

// ✅ SAFE DEFAULT (PREVENT BLANK UI)
const DEFAULT_RESUME = {
  name: "Your Name",
  summary: "Write a short professional summary...",
  skills: ["Skill 1", "Skill 2"],
  experience: [
    { role: "Job Title", company: "Company Name" }
  ]
};

export default function Analyze() {

  const [user, setUser] = useState(null);

  const [resumeText, setResumeText] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ IMPORTANT FIX
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
      if (u) {
        setUser(u);

        const layout = await getLayout(u.uid);
        if (layout) setSectionOrder(layout);

        const v = await getVersions(u.uid);
        setVersions(v);
      }
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

  const updateSkill = (i, value) => {
    const skills = [...(editable.skills || [])];
    skills[i] = value;

    const updated = { ...editable, skills };
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

    const formData = new FormData();
    formData.append("resumeText", resumeText);
    formData.append("job", job);

    try {
      const res = await fetch("/api/rewrite-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const safe = data?.name ? data : DEFAULT_RESUME;

      setEditable(safe);
      pushHistory(safe);

    } catch {
      alert("AI failed. Try again.");
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

  // 💾 AUTOSAVE
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

  // 🔍 DIFF
  const diffText = (oldText = "", newText = "") => {
    return newText.split(" ").map((w) =>
      oldText.includes(w)
        ? w
        : `<span style="color:lime">${w}</span>`
    ).join(" ");
  };

  // 🧱 RENDER SECTION
  const renderSection = (section) => {
    if (!editable) return null;

    if (section === "summary")
      return <p>{editable.summary}</p>;

    if (section === "skills")
      return (
        <ul>
          {(editable.skills || []).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      );

    if (section === "experience")
      return (editable.experience || []).map((exp, i) => (
        <div key={i}>
          <p>{exp.role}</p>
          <p className="text-sm text-gray-500">{exp.company}</p>
        </div>
      ));
  };

  return (
    <div className="flex flex-col h-screen">

      {/* TOP BAR */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-800">
        <button onClick={handleRewrite} className="btn-primary">Generate</button>
        <button onClick={undo} className="btn-primary">Undo</button>
        <button onClick={redo} className="btn-primary">Redo</button>
        <button onClick={downloadPDF} className="btn-primary">PDF</button>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT (EDITOR) */}
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

          <textarea
            value={editable.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            className="input"
          />
        </div>

        {/* RIGHT (PREVIEW) */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4 overflow-y-auto">

          <div ref={pdfRef} className="bg-white p-6 rounded shadow">

            <h1 className="text-xl font-bold mb-2">{editable.name}</h1>

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
                            className="mb-4"
                          >
                            <div
                              {...p.dragHandleProps}
                              className="text-xs text-gray-400 cursor-move"
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

        </div>

      </div>
    </div>
  );
    }
