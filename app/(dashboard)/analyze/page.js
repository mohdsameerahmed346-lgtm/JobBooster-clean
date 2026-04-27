"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Analyze() {
  const [resumeText, setResumeText] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);

  const [rewrite, setRewrite] = useState(null);
  const [editable, setEditable] = useState(null);

  const [template, setTemplate] = useState("modern");

  const pdfRef = useRef();

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
    setEditable(data); // ✅ IMPORTANT

    setLoading(false);
  };

  // ✏️ INLINE EDIT HANDLER
  const updateField = (field, value) => {
    setEditable((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✏️ UPDATE SKILL
  const updateSkill = (index, value) => {
    const newSkills = [...editable.skills];
    newSkills[index] = value;

    setEditable({ ...editable, skills: newSkills });
  };

  // 🔀 MOVE SECTION
  const moveSection = (dir) => {
    const order = ["summary", "skills", "experience"];
    const idx = order.indexOf(sectionOrder);

    let newIndex = dir === "up" ? idx - 1 : idx + 1;
    if (newIndex < 0 || newIndex >= order.length) return;

    const temp = order[idx];
    order[idx] = order[newIndex];
    order[newIndex] = temp;

    setSectionOrder(order);
  };

  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "skills",
    "experience",
  ]);

  // 📄 EXPORT PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("resume.pdf");
  };

  // 🎨 TEMPLATE RENDER (EDITABLE)
  const renderTemplate = () => {
    if (!editable) return null;

    return (
      <div className="p-8 space-y-4">

        {/* NAME */}
        <input
          value={editable.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="text-3xl font-bold w-full bg-transparent border-b"
        />

        {/* DYNAMIC SECTIONS */}
        {sectionOrder.map((section) => {
          if (section === "summary") {
            return (
              <textarea
                key="summary"
                value={editable.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                className="w-full bg-transparent border p-2"
              />
            );
          }

          if (section === "skills") {
            return (
              <div key="skills">
                <h2 className="font-bold">Skills</h2>
                {editable.skills.map((s, i) => (
                  <input
                    key={i}
                    value={s}
                    onChange={(e) => updateSkill(i, e.target.value)}
                    className="block w-full bg-transparent border mb-1"
                  />
                ))}
              </div>
            );
          }

          if (section === "experience") {
            return (
              <div key="exp">
                <h2 className="font-bold">Experience</h2>
                {editable.experience.map((exp, i) => (
                  <div key={i} className="mb-3 border p-2">
                    <input
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...editable.experience];
                        newExp[i].role = e.target.value;
                        setEditable({ ...editable, experience: newExp });
                      }}
                      className="w-full font-semibold"
                    />
                    <input
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...editable.experience];
                        newExp[i].company = e.target.value;
                        setEditable({ ...editable, experience: newExp });
                      }}
                      className="w-full text-sm"
                    />

                    {exp.points.map((p, j) => (
                      <input
                        key={j}
                        value={p}
                        onChange={(e) => {
                          const newExp = [...editable.experience];
                          newExp[i].points[j] = e.target.value;
                          setEditable({ ...editable, experience: newExp });
                        }}
                        className="block w-full text-sm"
                      />
                    ))}
                  </div>
                ))}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">Resume Builder</h1>

      <textarea
        placeholder="Paste resume..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        className="input"
        rows={5}
      />

      <textarea
        placeholder="Job description"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="input"
        rows={3}
      />

      <button onClick={handleRewrite} className="btn-primary">
        Generate Resume
      </button>

      {loading && <p>Generating...</p>}

      {editable && (
        <>
          {/* TEMPLATE SELECT */}
          <div className="flex gap-2">
            {["modern", "professional", "creative"].map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className="btn-primary"
              >
                {t}
              </button>
            ))}
          </div>

          {/* EDITABLE RESUME */}
          <div ref={pdfRef} className="bg-white text-black rounded-xl">
            {renderTemplate()}
          </div>

          <button onClick={downloadPDF} className="btn-primary">
            Download PDF
          </button>
        </>
      )}
    </div>
  );
      }
