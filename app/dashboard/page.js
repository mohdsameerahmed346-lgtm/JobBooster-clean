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
    return (
      <div style={styles.center}>
        <h2 style={{ color: "#fff" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {!user ? (
        <button style={styles.primaryBtn} onClick={handleLogin}>
          Login with Google 🚀
        </button>
      ) : (
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h2>Welcome, {user.displayName} 👋</h2>
              <p style={{ opacity: 0.7 }}>{user.email}</p>
            </div>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* INPUT CARD */}
          <div style={styles.card}>
            <h3>📄 Paste Your Resume</h3>

            <textarea
              placeholder="Paste your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={styles.textarea}
            />

            <button style={styles.primaryBtn} onClick={handleAnalyze}>
              {loading ? "Analyzing..." : "Analyze Resume 🧠"}
            </button>
          </div>

          {/* RESULT CARD */}
          {result && (
            <div style={styles.resultCard}>
              <h3>📊 AI Analysis Result</h3>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                {result}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  container: {
    width: "100%",
    maxWidth: "800px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    marginBottom: "20px",
  },

  resultCard: {
    background: "rgba(34,197,94,0.1)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  textarea: {
    width: "100%",
    height: "180px",
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#020617",
    color: "#fff",
    marginBottom: "10px",
  },

  primaryBtn: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
  },

  center: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
