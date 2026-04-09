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

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [score, setScore] = useState(0);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔐 LOGIN (POPUP + FALLBACK REDIRECT)
  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log("Popup failed, using redirect...");
      await signInWithRedirect(auth, provider);
    }
  };

  // 🔥 SHARE
  const share = () => {
    const text = `I got ${score}% ATS score using JobBoost AI 🚀`;
    navigator.clipboard.writeText(text);
    alert("Copied! Share with friends 🔥");
  };

  // 🤖 AI SCAN
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
      setAiResult("❌ AI error. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  // 💾 SAVE
  const saveResume = async () => {
    if (!user) return alert("Login first");

    await addDoc(collection(db, "resumes"), {
      uid: user.uid,
      resume: resumeText,
      score,
      createdAt: new Date().toISOString(),
    });

    alert("Saved 🚀");
    fetchHistory(user.uid);
  };

  // 📜 FETCH HISTORY
  const fetchHistory = async (uid) => {
    const q = query(collection(db, "resumes"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    setHistory(data);
  };

  // 🔥 FIX: AUTH STATE (NO MORE BLINK)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchHistory(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔁 HANDLE REDIRECT LOGIN
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">

      {!user ? (
        <button
          onClick={login}
          className="bg-white text-black px-6 py-3 rounded-xl shadow-lg"
        >
          Login with Google 🚀
        </button>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user.displayName} 🚀
          </h1>

          <button
            onClick={share}
            className="bg-purple-600 px-4 py-2 rounded mb-4"
          >
            🔥 Share Score
          </button>

          {/* RESUME */}
          <div className="bg-white/10 p-4 rounded-xl mb-4">
            <h2 className="mb-2 font-semibold">📄 Resume Scanner</h2>

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
              💾 Save
            </button>
          </div>

          {/* AI RESULT */}
          {aiResult && (
            <div className="bg-white/10 p-4 rounded mb-4">
              <h2>🤖 AI Analysis</h2>
              <p>{aiResult}</p>
            </div>
          )}

          {/* SCORE */}
          {score > 0 && (
            <div className="bg-white/10 p-4 rounded mb-4">
              <h2>📊 ATS Score</h2>
              <p className="text-3xl">{score}%</p>
            </div>
          )}

          {/* HISTORY */}
          <div className="bg-white/10 p-4 rounded">
            <h2>📜 Your Resumes</h2>

            {history.length === 0 && <p>No saved resumes</p>}

            {history.map((item, i) => (
              <div key={i} className="bg-black/30 p-2 rounded mt-2">
                <p>Score: {item.score}%</p>
                <p className="text-xs">{item.createdAt}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
