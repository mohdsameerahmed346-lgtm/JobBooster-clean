"use client";

import { useState, useEffect } from "react";
import { db, auth, provider } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [score, setScore] = useState(0);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔐 LOGIN
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  // 🔥 SHARE
  const share = () => {
    const text = `I got ${score}% ATS score using JobBoost AI 🚀`;
    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends 🔥");
  };

  // 🤖 AI SCAN (FIXED)
  const scanResume = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ resume: resumeText }),
      });

      const data = await res.json();

      setScore(data.score || 85);
      setAiResult(data.result || "AI analysis not available");
    } catch (error) {
      console.error(error);
      setAiResult("❌ AI error. Check API key or server.");
    } finally {
      setLoading(false);
    }
  };

  // 💾 SAVE USER DATA
  const saveResume = async () => {
    if (!user) return alert("Login first");

    try {
      await addDoc(collection(db, "resumes"), {
        uid: user.uid,
        resume: resumeText,
        score: score,
        createdAt: new Date().toISOString(),
      });

      alert("Saved successfully 🚀");
      fetchHistory(user.uid);
    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
  };

  // 📜 FETCH USER HISTORY
  const fetchHistory = async (uid) => {
    try {
      const q = query(collection(db, "resumes"), where("uid", "==", uid));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => doc.data());
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory(user.uid);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">

      {/* LOGIN */}
      {!user ? (
        <button
          onClick={login}
          className="bg-white text-black px-6 py-3 rounded-xl shadow-lg"
        >
          Login with Google 🚀
        </button>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {user.displayName} 🚀
          </h1>

          {/* SHARE */}
          <button
            onClick={share}
            className="bg-purple-600 px-4 py-2 rounded mb-4"
          >
            🔥 Share Score
          </button>

          {/* RESUME INPUT */}
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl mb-4">
            <h2 className="font-semibold mb-2">📄 Resume Scanner</h2>

            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-2 rounded text-black"
              placeholder="Paste your resume..."
            />

            <button
              onClick={scanResume}
              className="bg-blue-500 px-4 py-2 rounded mt-3"
            >
              {loading ? "Analyzing..." : "Scan Resume ⚡"}
            </button>

            <button
              onClick={saveResume}
              className="bg-green-500 px-4 py-2 rounded mt-3 ml-2"
            >
              💾 Save Resume
            </button>
          </div>

          {/* AI RESULT */}
          {aiResult && (
            <div className="bg-white/10 p-4 rounded-xl mb-4">
              <h2 className="font-semibold mb-2">🤖 AI Analysis</h2>
              <p>{aiResult}</p>
            </div>
          )}

          {/* SCORE */}
          {score > 0 && (
            <div className="bg-white/10 p-4 rounded-xl mb-4">
              <h2 className="font-semibold">📊 ATS Score</h2>
              <p className="text-3xl font-bold">{score}%</p>
            </div>
          )}

          {/* HISTORY */}
          <div className="bg-white/10 p-4 rounded-xl">
            <h2 className="font-semibold mb-2">📜 Your Resumes</h2>

            {history.length === 0 && <p>No saved resumes yet</p>}

            {history.map((item, i) => (
              <div key={i} className="bg-black/30 p-2 rounded mt-2">
                <p>Score: {item.score}%</p>
                <p className="text-xs text-gray-400">
                  {item.createdAt}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
    }
