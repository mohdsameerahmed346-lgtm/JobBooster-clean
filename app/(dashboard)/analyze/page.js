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

  const [rewrite, setRewrite] = useState(null);
  const [editable, setEditable] = useState(null);

  const [template, setTemplate] = useState("modern");
  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "skills",
    "experience",
  ]);

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

  // 🧠 AI REWRITE
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

    setRewrite(data);
    setEditable(data);

    setLoading(false);
  };

  // ✏️ UPDATE FIELD
  const updateField = (field, value) => {
    setEditable((prev) => ({ ...prev, [field]: value }));
  };

  const updateSkill = (i, value) => {
    const newSkills = [...editable.skills];
    newSkills[i] = value;
    setEditable({ ...editable, skills: newSkills });
  };

  // 🔀 DRAG END
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setSectionOrder(items);

    // 💾 SAVE TO FIREBASE
    if (user) {
      await saveLayout(user.uid, items);
    }
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

  // 🎨 RENDER SECTION
  const renderSection = (section) => {
    if (section === "summary") {
      return (
        <textarea
          value={editable.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          className="w-full border p-2"
        />
      );
    }

    if (section === "skills") {
      return (
        <div>
          {editable.skills.map((s, i) => (
            <input
              key={i}
              value={s}
              onChange={(e) => updateSkill(i, e.target.value)}
              className="block w-full border mb-1"
            />
          ))}
        </div>
      );
    }

    if (section === "experience") {
      return editable.experience.map((exp, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            value={exp.role}
            onChange={(e) => {
              const copy = [...editable.experience];
              copy[i].role = e.target.value;
              setEditable({ ...editable, experience: copy });
            }}
            className="w-full font-bold"
          />
          <input
            value={exp.company}
            onChange={(e) => {
              const copy = [...editable.experience];
              copy[i].company = e.target.value;
              setEditable({ ...editable, experience: copy });
            }}
            className="w-full text-sm"
          />
        </div>
      ));
    }
  };

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">Resume Builder</h1>

      {/* INPUT */}
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

      <button onClick={handleRewrite} className="btn-primary">
        Generate Resume
      </button>

      {loading && <p>Generating...</p>}

      {/* TEMPLATE SELECT */}
      {editable && (
        <>
          <div className="flex gap-2">
            {["modern", "professional", "creative"].map((t) => (
              <button key={t} onClick={() => setTemplate(t)} className="btn-primary">
                {t}
              </button>
            ))}
          </div>

          {/* DRAG DROP */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  ref={pdfRef}
                  {...provided.droppableProps}
                  className="bg-white text-black p-6 rounded-xl"
                >
                  {/* NAME */}
                  <input
                    value={editable.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="text-3xl font-bold w-full border-b mb-4"
                  />

                  {sectionOrder.map((section, index) => (
                    <Draggable key={section} draggableId={section} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-4"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move text-xs text-gray-400"
                          >
                            Drag
                          </div>

                          <h2 className="font-bold capitalize">{section}</h2>

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

          <button onClick={downloadPDF} className="btn-primary">
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}
