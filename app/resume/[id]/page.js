"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import ModernTemplate from "../../../components/templates/ModernTemplate";
import MinimalTemplate from "../../../components/templates/MinimalTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";
import ProfessionalTemplate from "../../../components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "../../../components/templates/ExecutiveTemplate";

export default function ResumePage({ params }) {
  const { id } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SHARED RESUME
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/get-resume?id=${id}`);
        const json = await res.json();

        setData(json?.data || null);
      } catch (err) {
        console.log("Fetch error");
      }

      setLoading(false);
    };

    if (id) fetchResume();
  }, [id]);

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading resume...
      </div>
    );
  }

  // ❌ NO DATA
  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        Resume not found
      </div>
    );
  }

  // ✅ SAFE DATA EXTRACTION (IMPORTANT FIX)
  const resume = data?.resume || {};
  const template = data?.template || "modern";

  const safeResume = {
    name: resume?.name || "No Name",
    summary: resume?.summary || "",
    skills: Array.isArray(resume?.skills) ? resume.skills : [],
    experience: Array.isArray(resume?.experience)
      ? resume.experience
      : [],
  };

  // 🎨 TEMPLATE RENDER
  const renderTemplate = () => {
    const props = { data: safeResume };

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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg p-6 rounded">
        {renderTemplate()}
      </div>
    </div>
  );
      }
