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

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      setUser(res.user);
    } catch {
      alert("Login failed");
    }
  };

  // 🔓 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🔥 AUTH STATE
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  // 🧠 ANALYZE
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

      // 🔥 FIX: EXTRACT JSON FROM AI RESPONSE
      let parsed;
      try {
        const jsonMatch = data.result.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          alert("AI response not valid JSON");
          return;
        }

        parsed = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error(err);
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

  // ⏳ LOADING SCREEN
  if (checking) {
    return <div style={styles.center}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      {!user ? (
        <motion.button style={styles.btn} onClick={handleLogin}>
          Login with Google 🚀
        </motion.button>
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
          <motion.div style={styles.card}>
            <textarea
              placeholder="Paste your resume..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={styles.textarea}
            />

            <motion.button
              style={styles.btn}
              onClick={handleAnalyze}
              whileHover={{ scale: 1.05 }}
            >
              {loading ? "Analyzing..." : "Analyze Resume 🧠"}
            </motion.button>
          </motion.div>

          {/* RESULT */}
          {result && (
            <motion.div
              style={styles.resultCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* SCORE */}
              <div style={styles.scoreBox}>
                <h1 style={styles.score}>{result.score}</h1>
                <p>/100</p>
              </div>

              {/* PROGRESS */}
              <div style={styles.progressBg}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${result.score}%`,
                  }}
                />
              </div>

              {/* FEEDBACK */}
              <p style={{ marginTop: "20px" }}>{result.feedback}</p>

              {/* STRENGTHS */}
              <div style={styles.section}>
                <h3>✅ Strengths</h3>
                <ul>
                  {result.strengths?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* WEAKNESSES */}
              <div style={styles.section}>
                <h3>⚠️ Weaknesses</h3>
                <ul>
                  {result.weaknesses?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* IMPROVEMENTS */}
              <div style={styles.section}>
                <h3>🚀 Improvements</h3>
                <ul>
                  {result.improvements?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// 🎨 STYLES
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
    padding: "10px",
    borderRadius: "8px",
  },
  btn: {
    background: "#3b82f6",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  logout: {
    background: "#ef4444",
    color: "#fff",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
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
  section: {
    marginTop: "20px",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
