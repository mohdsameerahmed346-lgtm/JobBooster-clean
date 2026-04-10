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
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
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

      // 🔥 parse AI JSON safely
      const parsed = JSON.parse(data.result);

      setResult(parsed);
    } catch (err) {
      console.error(err);
      alert("Error analyzing");
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
        <button style={styles.btn} onClick={handleLogin}>
          Login 🚀
        </button>
      ) : (
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h2>Welcome, {user.displayName} 👋</h2>
              <p>{user.email}</p>
            </div>
            <button style={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* INPUT */}
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

          {/* RESULT */}
          {result && (
            <motion.div
              style={styles.resultCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* SCORE */}
              <div style={styles.scoreBox}>
                <motion.h1
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.score}
                >
                  {result.score}
                </motion.h1>
                <p>/100</p>
              </div>

              {/* PROGRESS BAR */}
              <div style={styles.progressBg}>
                <motion.div
                  style={{
                    ...styles.progressFill,
                    width: `${result.score}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                />
              </div>

              {/* FEEDBACK */}
              <p style={{ marginTop: "20px" }}>
                {result.feedback}
              </p>
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

  container: {
    maxWidth: "800px",
    margin: "auto",
  },

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
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
  },

  logout: {
    background: "red",
    color: "#fff",
    padding: "8px",
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
