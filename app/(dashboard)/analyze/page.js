"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { saveLayout, getLayout } from "../../../lib/layout";

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

  const [template, setTemplate] = useState("modern");

  const pdfRef = useRef();

  // 🔐 AUTH + LOAD LAYOUT
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

  // 🤖 AI REWRITE
  const handleRewrite = async () => {
    if (!resumeText.trim()) return alert("Paste resume");

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
    setLoading(false);
  };

  // ✏️ UPDATE FUNCTIONS
  const updateField = (field, value) => {
    setEditable((prev) => ({ ...prev, [field]: value }));
  };

  const updateSkill = (i, value) => {
    const skills = [...editable.skills];
    skills[i] = value;
    setEditable({ ...editable, skills });
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

  // 🧱 SECTION RENDER
  const renderSection = (section) => {
    if (section === "summary") {
      return <p>{editable.summary}</p>;
    }

    if (section === "skills") {
      return (
        <ul className="list-disc pl-5">
          {editable.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      );
    }

    if (section === "experience") {
      return editable.experience.map((exp, i) => (
        <div key={i} className="mb-2">
          <p className="font-bold">{exp.role}</p>
          <p className="text-sm">{exp.company}</p>
        </div>
      ));
    }
  };

  return (
    <div className="h-screen flex flex-col">

      <div className="p-4 border-b border-gray-800 flex gap-4">
        <button onClick={handleRewrite} className="btn-primary">
          Generate Resume
        </button>

        <button onClick={downloadPDF} className="btn-primary">
          Export PDF
        </button>

        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="bg-[#020617] border p-2"
        >
          <option value="modern">Modern</option>
          <option value="professional">Professional</option>
          <option value="creative">Creative</option>
        </select>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* 🧠 LEFT EDITOR */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-800 space-y-4">

          <textarea
            placeholder="Paste resume"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="input"
          />

          <textarea
            placeholder="Job description"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="input"
          />

          {editable && (
            <>
              <input
                value={editable.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="input text-xl font-bold"
              />

              <textarea
                value={editable.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                className="input"
              />

              <div>
                <h3>Skills</h3>
                {editable.skills.map((s, i) => (
                  <input
                    key={i}
                    value={s}
                    onChange={(e) => updateSkill(i, e.target.value)}
                    className="input mb-1"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 👀 RIGHT PREVIEW */}
        <div className="w-1/2 bg-gray-100 overflow-y-auto p-6">
          {editable && (
            <div ref={pdfRef} className="bg-white p-8 rounded-xl shadow">

              <h1 className="text-3xl font-bold">{editable.name}</h1>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {sectionOrder.map((section, index) => (
                        <Draggable
                          key={section}
                          draggableId={section}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="mt-4"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="text-xs text-gray-400 cursor-move"
                              >
                                Drag
                              </div>

                              <h2 className="font-bold capitalize">
                                {section}
                              </h2>

                              {renderSection(section)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
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
