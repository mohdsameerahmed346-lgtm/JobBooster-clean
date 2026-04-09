"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [score, setScore] = useState(0);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔥 SHARE FUNCTION (UPDATED)
  const share = () => {
    const text = `I got ${score}% ATS score using JobBoost AI 🚀`;

    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends 🔥");
  };

  // 🔥 AI SCAN
  const scanResume = async () => {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ resume: resumeText }),
    });

    const data = await res.json();

    setScore(data.score || 85);
    setAiResult(data.result);
    setLoading(false);
  };

  // 🔥 SAVE TO FIREBASE
  const saveResume = async () => {
    try {
      await addDoc(collection(db, "resumes"), {
        resume: resumeText,
        score: score,
        createdAt: new Date(),
      });

      alert("Saved successfully 🚀");
      fetchHistory();
    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
  };

  // 🔥 FETCH HISTORY
  const fetchHistory = async () => {
    const querySnapshot = await getDocs(collection(db, "resumes"));
    const data = querySnapshot.docs.map((doc) => doc.data());
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">🚀 JobBoost AI Dashboard</h1>

      {/* 🔥 SHARE */}
      <button
        onClick={share}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        🔥 Share Score
      </button>

      {/* 📄 RESUME INPUT */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold mb-2">📄 Resume Scanner</h2>
        <textarea
          rows={10}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Paste your resume..."
        />

        <button
          onClick={scanResume}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
        >
          {loading ? "Analyzing..." : "Scan Resume ⚡"}
        </button>

        <button
          onClick={saveResume}
          className="bg-green-600 text-white px-4 py-2 rounded mt-3 ml-2"
        >
          💾 Save Resume
        </button>
      </div>

      {/* 🤖 AI RESULT */}
      {aiResult && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-2">🤖 AI Analysis</h2>
          <p>{aiResult}</p>
        </div>
      )}

      {/* 📊 SCORE */}
      {score > 0 && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold">📊 ATS Score</h2>
          <p className="text-2xl font-bold">{score}%</p>
        </div>
      )}

      {/* 📜 HISTORY */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">📜 Saved Resumes</h2>

        {history.length === 0 && <p>No saved resumes yet</p>}

        {history.map((item, index) => (
          <div
            key={index}
            className="border p-2 rounded mb-2 bg-gray-100"
          >
            <p className="text-sm">
              Score: <strong>{item.score}%</strong>
            </p>
            <p className="text-xs text-gray-600">
              {item.createdAt?.toString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
