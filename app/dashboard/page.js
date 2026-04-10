"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  // 🔓 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🔥 AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // 🧠 AI ANALYZE
  const handleAnalyze = async () => {
    if (!resumeText) {
      alert("Paste resume text first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ text: resumeText }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Error analyzing");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div style={{ color: "white", background: "black" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        background: "black",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {!user ? (
        <button onClick={handleLogin}>
          Login with Google 🚀
        </button>
      ) : (
        <>
          <h2>Welcome, {user.displayName} 🎉</h2>

          <textarea
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            style={{
              width: "100%",
              height: "200px",
              marginTop: "20px",
              padding: "10px",
            }}
          />

          <button onClick={handleAnalyze} style={{ marginTop: "10px" }}>
            {loading ? "Analyzing..." : "Analyze Resume 🧠"}
          </button>

          {result && (
            <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
              <h3>Result:</h3>
              <p>{result}</p>
            </div>
          )}

          <button onClick={handleLogout} style={{ marginTop: "20px" }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
    }
