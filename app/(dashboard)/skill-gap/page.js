"use client";

import { useState } from "react";
import ResumeEditor from "../../../components/ResumeEditor";

export default function SkillGap() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) return alert("Upload a resume");

    setLoading(true);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/skill-gap", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setData(json);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📄 Resume Builder</h1>

      {/* Upload */}
      <div className="glass p-6 rounded-xl space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={analyze} className="btn-primary">
          Analyze Resume
        </button>
      </div>

      {loading && <div className="text-gray-400">Analyzing...</div>}

      {data && !data.error && <ResumeEditor data={data} />}

      {data?.error && (
        <div className="text-red-400">{data.error}</div>
      )}

    </div>
  );
        }
