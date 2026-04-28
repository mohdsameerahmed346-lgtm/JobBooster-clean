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

// Templates
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

      const v = await getVersions(u.uid);
      setVersions(v);
    });

    return () => unsub();
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

  // UNDO REDO
  const undo = () => {
    if (historyIndex <= 0) return;
    setHistoryIndex(historyIndex - 1);
    setEditable(history[historyIndex - 1]);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex(historyIndex + 1);
    setEditable(history[historyIndex + 1]);
  };

  // AUTOSAVE
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

  // SAVE VERSION
  const saveNamedVersion = async () => {
    await saveVersion(
      user.uid,
      { resume: editable, layout: sectionOrder, template },
      versionName || "Manual"
    );
    setVersions(await getVersions(user.uid));
    setVersionName("");
  };

  // RESTORE
  const restoreVersion = (v) => {
    setEditable(v.resume);
    setSectionOrder(v.layout);
    setTemplate(v.template || "modern");
    pushHistory(v.resume);
  };

  // PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  // DOCX (NEW 🔥)
  const exportDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: editable.name, bold: true })],
            }),
            new Paragraph(editable.summary),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  // SHARE LINK (simple)
  const generateShareLink = () => {
    const data = encodeURIComponent(JSON.stringify(editable));
    return `${window.location.origin}/resume-view?data=${data}`;
  };

  // TEMPLATE
  const renderTemplate = () => {
    const props = { data: editable, order: sectionOrder };

    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  // SECTION ADD
  const addSection = () => {
    const name = prompt("Section name?");
    if (!name) return;
    setSectionOrder([...sectionOrder, name]);
  };

  // REMOVE SECTION
  const removeSection = (sec) => {
    setSectionOrder(sectionOrder.filter((s) => s !== sec));
  };

  return (
    <div className="flex flex-col h-screen">

      {/* TOP */}
      <div className="flex flex-wrap gap-2 p-3 border-b">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={downloadPDF}>PDF</button>
        <button onClick={exportDOCX}>DOCX</button>

        <input
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Version name"
        />
        <button onClick={saveNamedVersion}>Save</button>

        <button onClick={addSection}>+ Section</button>

        <button
          onClick={() => {
            const link = generateShareLink();
            navigator.clipboard.writeText(link);
            alert("Link copied!");
          }}
        >
          Share
        </button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-4 space-y-3">
          <input
            value={editable.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4">

          {/* TEMPLATE SELECTOR (THUMBNAILS) */}
          <div className="flex gap-3 mb-4">
            {["modern", "minimal", "creative"].map((t) => (
              <div
                key={t}
                onClick={() => setTemplate(t)}
                className={`p-2 border cursor-pointer ${
                  template === t ? "border-blue-500" : ""
                }`}
              >
                <p>{t}</p>
              </div>
            ))}
          </div>

          {/* PREVIEW */}
          <div ref={pdfRef} className="bg-white p-6 rounded">
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
                            className="mb-4 border p-2"
                          >
                            <div {...p.dragHandleProps}>Drag</div>

                            <button onClick={() => removeSection(sec)}>
                              ❌
                            </button>

                            {renderTemplate()}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* VERSION */}
          <div className="mt-4 bg-black text-white p-3">
            {versions.map((v, i) => (
              <div key={i}>
                <span onClick={() => restoreVersion(v)}>
                  {v.name || "Auto"}
                </span>
                <button onClick={() => setCompareA(v)}>A</button>
                <button onClick={() => setCompareB(v)}>B</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
