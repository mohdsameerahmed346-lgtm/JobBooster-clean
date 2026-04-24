"use client";

import { useState, useEffect } from "react";
import ScoreCard from "../../../components/ScoreCard";

import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { saveHistory } from "../../../lib/history";

export default function SkillGap() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        window.location.href = "/login";
      } else {
        setUser(u);
      }
    });

    return () => unsub();
  }, []);

  // 🚀 ANALYZE FUNCTION
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

      // 💾 SAVE TO FIRESTORE
      if (user) {
        await saveHistory(user.uid, json);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📄 Resume Analyzer</h1>

      {/* 📤 UPLOAD */}
      <div className="glass p-6 rounded-xl space-y-4">

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* ⚠️ WARNING */}
        <p className="text-yellow-300 text-sm bg-yellow-500/10 border border-yellow-500/20 p-2 rounded">
          ⚠️ Upload a simple text-based PDF (Word/Google Docs). Canva/scanned resumes may not work.
        </p>

        <button onClick={analyze} className="btn-primary">
          Analyze Resume
        </button>

      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <p className="text-gray-400">Analyzing resume...</p>
      )}

      {/* ❌ ERROR */}
      {data?.error && (
        <p className="text-red-400">{data.error}</p>
      )}

      {/* ✅ RESULT */}
      {data && !data.error && (
        <div className="space-y-6">

          {/* 📊 SCORES */}
          <div className="grid grid-cols-2 gap-4">
            <ScoreCard title="Resume Score" value={data.score} />
            <ScoreCard title="ATS Score" value={data.ats} />
          </div>

          {/* 🔑 MISSING KEYWORDS */}
          <div className="glass p-4 rounded-xl">
            <h2 className="font-semibold mb-2">Missing Keywords</h2>

            <div className="flex flex-wrap gap-2">
              {data.missingKeywords?.map((k, i) => (
                <span
                  key={i}
                  className="bg-red-500/20 px-2 py-1 rounded"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* 💡 FEEDBACK */}
          <div className="glass p-4 rounded-xl">
            <h2 className="font-semibold mb-2">Suggestions</h2>

            <p><strong>Skills:</strong> {data.sectionFeedback?.skills}</p>
            <p><strong>Experience:</strong> {data.sectionFeedback?.experience}</p>
            <p><strong>Projects:</strong> {data.sectionFeedback?.projects}</p>
          </div>

        </div>
      )}

    </div>
  );
          }
