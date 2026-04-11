"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      setUser(res.user);
    } catch {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

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

      if (data.error) {
        alert(data.error);
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(data.result);
      } catch {
        alert("AI response format error");
        return;
      }

      setResult(parsed);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div style={{ color: "#fff" }}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      {!user ? (
        <motion.button style={styles.btn} onClick={handleLogin}>
          Login 🚀
        </motion.button>
      ) : (
        <div style={styles.container}>
          <div style={styles.header}>
            <div>
              <h2>Welcome, {user.displayName} 👋</h2>
              <p>{user.email}</p>
            </div>

            <button style={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div style={styles.card}>
            <textarea
              placeholder="Paste your resume..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={styles.textarea}
            />

            <button style={styles.btn} onClick={handleAnalyze}>
              {loading ? "Analyzing..." : "Analyze Resume 🧠"}
            </button>
          </div>

          {result && (
            <motion.div style={styles.resultCard}>
              <div style={styles.scoreBox}>
                <h1 style={styles.score}>{result.score}</h1>
                <p>/100</p>
              </div>

              <div style={styles.progressBg}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${result.score}%`,
                  }}
                />
              </div>

              <p style={{ marginTop: "20px" }}>{result.feedback}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    color: "#fff",
    padding: "20px",
  },
  container: { maxWidth: "800px", margin: "auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "12px",
  },
  textarea: {
    width: "100%",
    height: "150px",
    marginBottom: "10px",
  },
  btn: {
    background: "#3b82f6",
    padding: "10px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
  logout: {
    background: "red",
    padding: "8px",
    color: "#fff",
    borderRadius: "6px",
  },
  resultCard: {
    marginTop: "20px",
    padding: "20px",
    background: "#020617",
    borderRadius: "12px",
  },
  scoreBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  score: {
    fontSize: "48px",
    color: "#22c55e",
  },
  progressBg: {
    height: "10px",
    background: "#333",
    borderRadius: "10px",
    marginTop: "10px",
  },
  progressFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: "10px",
  },
};
