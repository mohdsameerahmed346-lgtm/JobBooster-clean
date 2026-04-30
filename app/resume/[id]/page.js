"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

import ModernTemplate from "../../../components/templates/ModernTemplate";
import MinimalTemplate from "../../../components/templates/MinimalTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";
import ProfessionalTemplate from "../../../components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "../../../components/templates/ExecutiveTemplate";

export default function ResumeViewer({ params }) {
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [template, setTemplate] = useState("modern");

  // 🔐 SAFE FETCH
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/get-resume?id=${id}`);
        const json = await res.json();

        const data = json?.data || {};

        // ✅ SAFE STRUCTURE
        const safeResume = {
          name: data?.resume?.name || "No Name",
          summary: data?.resume?.summary || "",
          skills: data?.resume?.skills || [],
          experience: data?.resume?.experience || [],
        };

        setResumeData(safeResume);
        setTemplate(data?.template || "modern");

      } catch (err) {
        console.error("Fetch failed", err);
      }

      setLoading(false);
    };

    if (id) fetchResume();
  }, [id]);

  // 🎨 TEMPLATE RENDER
  const renderTemplate = () => {
    const props = { data: resumeData };

    switch (template) {
      case "minimal":
        return <MinimalTemplate {...props} />;
      case "creative":
        return <CreativeTemplate {...props} />;
      case "professional":
        return <ProfessionalTemplate {...props} />;
      case "executive":
        return <ExecutiveTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  // 🔒 LOADING STATE
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading resume...
      </div>
    );
  }

  // ❌ NO DATA
  if (!resumeData) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Resume not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Resume Preview
        </h1>

        {/* TEMPLATE SWITCH */}
        <div className="flex gap-2">
          {["modern", "minimal", "creative", "professional", "executive"].map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1 text-xs border rounded ${
                template === t ? "bg-black text-white" : "bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* RESUME VIEW */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg p-6">
        {renderTemplate()}
      </div>

    </div>
  );
          }
