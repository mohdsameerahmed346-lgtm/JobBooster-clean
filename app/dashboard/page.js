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

  // 🔐 LOGIN (ONLY REDIRECT — NO POPUP)
  const login = async () => {
    await signInWithRedirect(auth, provider);
  };

  // 🔥 HANDLE LOGIN RESULT (VERY IMPORTANT)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // 🔥 AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchHistory(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🤖 AI SCAN
  const scanResume = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ resume: resumeText }),
      });

      const data = await res.json();

      setScore(data.score || 85);
      setAiResult(data.result || "AI result not available");
    } catch (error) {
      console.error(error);
      setAiResult("❌ AI error");
    }

    setLoading(false);
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

  // 📜 HISTORY
  const fetchHistory = async (uid) => {
    const q = query(collection(db, "resumes"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    setHistory(snapshot.docs.map((doc) => doc.data()));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {!user ? (
        <button
          onClick={login}
          className="bg-white text-black px-6 py-3 rounded-xl"
        >
          Login with Google 🚀
        </button>
      ) : (
        <>
          <h1 className="text-2xl mb-4">
            Welcome, {user.displayName}
          </h1>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full p-2 text-black rounded"
            placeholder="Paste resume"
          />

          <button onClick={scanResume} className="bg-blue-500 p-2 mt-2 rounded">
            {loading ? "Analyzing..." : "Scan Resume"}
          </button>

          <button onClick={saveResume} className="bg-green-500 p-2 mt-2 ml-2 rounded">
            Save
          </button>

          {aiResult && <p className="mt-4">{aiResult}</p>}

          {score > 0 && <p className="text-xl mt-2">Score: {score}%</p>}
        </>
      )}
    </div>
  );
  }
