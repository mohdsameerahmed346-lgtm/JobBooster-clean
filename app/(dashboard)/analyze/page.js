"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

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
  const [loading, setLoading] = useState(false);

  const [versions, setVersions] = useState([]);
  const [versionName, setVersionName] = useState("");

  const pdfRef = useRef();
  const autosaveRef = useRef(null);

  // ✅ AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      setUser(u);

      const layout = await getLayout(u.uid);
      if (layout) console.log("layout loaded");

      const v = await getVersions(u.uid);
      setVersions(v);
    });

    return () => unsub();
  }, []);

  // ✅ SKILL GAP AUTO-FILL (FIXED)
  useEffect(() => {
    const fix = localStorage.getItem("fixData");

    if (fix) {
      try {
        const parsed = JSON.parse(fix);

        setJob(parsed.job || "");
        setResumeText(
          `Improve this resume and include: ${parsed.missingSkills?.join(", ")}`
        );

        localStorage.removeItem("fixData");
      } catch {
        console.log("Fix data error");
      }
    }
  }, []);

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

      setEditable(data?.name ? data : DEFAULT_RESUME);
    } catch {
      alert("AI failed");
    }

    setLoading(false);
  };

  // 💾 AUTOSAVE
  useEffect(() => {
    if (!editable || !user) return;

    clearTimeout(autosaveRef.current);

    autosaveRef.current = setTimeout(async () => {
      const data = { resume: editable, template };

      await saveResumeState(user.uid, data);
      await saveVersion(user.uid, data);

      setVersions(await getVersions(user.uid));
    }, 2000);
  }, [editable, template]);

  // 📄 PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  // 📄 DOCX
  const exportDOCX = async () => {
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
        data: { resume: editable, template },
      }),
    });

    const link = `${window.location.origin}/resume/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  // 🎨 TEMPLATE
  const renderTemplate = () => {
    const props = { data: editable };

    if (template === "minimal") return <MinimalTemplate {...props} />;
    if (template === "creative") return <CreativeTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

  return (
    <div className="flex flex-col h-screen">

      {/* TOP BAR */}
      <div className="flex gap-2 p-3 border-b">
        <button onClick={handleRewrite}>AI Rewrite</button>
        <button onClick={downloadPDF}>PDF</button>
        <button onClick={exportDOCX}>DOCX</button>
        <button onClick={shareResume}>Share</button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-4 space-y-3">
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

          <input
            value={editable.name}
            onChange={(e) =>
              setEditable({ ...editable, name: e.target.value })
            }
            className="input"
          />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4">

          {/* TEMPLATE SWITCH */}
          <div className="flex gap-2 mb-3">
            {["modern", "minimal", "creative"].map((t) => (
              <button key={t} onClick={() => setTemplate(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* PREVIEW (FIXED) */}
          <div ref={pdfRef} className="bg-white p-6">
            {renderTemplate()}
          </div>

        </div>
      </div>
    </div>
  );
                                           }
