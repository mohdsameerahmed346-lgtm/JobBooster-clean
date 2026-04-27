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

  // 🕒 LOCAL HISTORY
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // ☁️ FIREBASE VERSIONS
  const [versions, setVersions] = useState([]);

  // 🆕 NEW STATES
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

        const savedLayout = await getLayout(u.uid);
        setSectionOrder(savedLayout);

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

  // 🤖 AI
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
      await saveVersion(user.uid, data); // auto save

      const v = await getVersions(user.uid);
      setVersions(v);

    }, 2000);

  }, [editable, sectionOrder]);

  // 🏷️ MANUAL SAVE
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

  // 🔍 DIFF
  const diffText = (oldText = "", newText = "") => {
    const oldWords = oldText.split(" ");
    const newWords = newText.split(" ");

    return newWords
      .map((w) =>
        oldWords.includes(w)
          ? w
          : `<span style="color:lightgreen">${w}</span>`
      )
      .join(" ");
  };

  const renderDiff = () => {
    if (!compareA || !compareB) return null;

    return (
      <div className="bg-black text-white p-4 rounded-xl mt-4 text-sm">
        <h3 className="mb-2">Diff Viewer</h3>

        <div>
          <p className="text-gray-400">Summary</p>
          <div
            dangerouslySetInnerHTML={{
              __html: diffText(
                compareA.resume.summary,
                compareB.resume.summary
              ),
            }}
          />
        </div>
      </div>
    );
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

      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-1/2 p-6 space-y-4 overflow-y-auto">
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="input" />
          <textarea value={job} onChange={(e) => setJob(e.target.value)} className="input" />

          {editable && (
            <>
              <input value={editable.name} onChange={(e) => updateField("name", e.target.value)} className="input" />
              <textarea value={editable.summary} onChange={(e) => updateField("summary", e.target.value)} className="input" />
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-gray-100 p-6 overflow-y-auto">

          {editable && (
            <>
              <div ref={pdfRef} className="bg-white p-6 rounded mb-6">
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

              {/* VERSION TIMELINE */}
              <div className="bg-[#020617] text-white p-4 rounded-xl">
                <h3 className="text-sm mb-3">Version History</h3>

                {versions.map((v, i) => (
                  <div key={i} className="mb-2 p-2 hover:bg-gray-800 rounded">
                    <div onClick={() => restoreVersion(v)} className="cursor-pointer">
                      {v.name || "Auto Save"} • {new Date(v.createdAt).toLocaleTimeString()}
                    </div>

                    <div className="flex gap-2 text-xs mt-1">
                      <button onClick={() => setCompareA(v)}>A</button>
                      <button onClick={() => setCompareB(v)}>B</button>
                    </div>
                  </div>
                ))}

                {renderDiff()}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
    }
