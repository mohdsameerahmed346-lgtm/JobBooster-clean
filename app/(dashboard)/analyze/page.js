"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { saveLayout, getLayout } from "../../../lib/layout";
import { saveResumeState } from "../../../lib/autosave";

export default function Analyze() {

  const [user, setUser] = useState(null);

  const [resumeText, setResumeText] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);

  const [editable, setEditable] = useState(null);
  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "skills",
    "experience",
  ]);

  // 🕒 HISTORY
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pdfRef = useRef();
  const autosaveRef = useRef(null);

  // 🔐 AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const saved = await getLayout(u.uid);
        setSectionOrder(saved);
      }
    });
    return () => unsub();
  }, []);

  // 🧠 PUSH TO HISTORY
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

  const updateSkill = (i, value) => {
    const skills = [...editable.skills];
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

    const res = await fetch("/api/rewrite-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setEditable(data);
    pushHistory(data);

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

  // 💾 AUTOSAVE (DEBOUNCED)
  useEffect(() => {
    if (!editable || !user) return;

    clearTimeout(autosaveRef.current);

    autosaveRef.current = setTimeout(() => {
      saveResumeState(user.uid, {
        resume: editable,
        layout: sectionOrder,
      });
    }, 1500); // 1.5s debounce

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

  // 🧱 RENDER
  const renderSection = (section) => {
    if (section === "summary") return <p>{editable.summary}</p>;

    if (section === "skills") {
      return (
        <ul>
          {editable.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      );
    }

    if (section === "experience") {
      return editable.experience.map((exp, i) => (
        <div key={i}>
          <p>{exp.role}</p>
          <p>{exp.company}</p>
        </div>
      ));
    }
  };

  return (
    <div className="h-screen flex flex-col">

      {/* TOP BAR */}
      <div className="flex gap-3 p-4 border-b border-gray-800">
        <button onClick={handleRewrite} className="btn-primary">
          Generate
        </button>

        <button onClick={undo} className="btn-primary">
          Undo
        </button>

        <button onClick={redo} className="btn-primary">
          Redo
        </button>

        <button onClick={downloadPDF} className="btn-primary">
          Export PDF
        </button>
      </div>

      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-1/2 p-6 space-y-4 overflow-y-auto">

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="input"
          />

          <textarea
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="input"
          />

          {editable && (
            <>
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
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-gray-100 p-6 overflow-y-auto">
          {editable && (
            <div ref={pdfRef} className="bg-white p-6 rounded">

              <h1>{editable.name}</h1>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(p) => (
                    <div ref={p.innerRef} {...p.droppableProps}>
                      {sectionOrder.map((sec, i) => (
                        <Draggable key={sec} draggableId={sec} index={i}>
                          {(p) => (
                            <div ref={p.innerRef} {...p.draggableProps}>
                              <div {...p.dragHandleProps}>Drag</div>
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
          )}
        </div>

      </div>
    </div>
  );
}
