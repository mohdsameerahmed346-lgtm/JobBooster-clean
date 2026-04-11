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

  // 🔥 NEW STATES
  const [usage, setUsage] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

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

  // 🔥 MONTHLY USAGE SYSTEM
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const saved = JSON.parse(localStorage.getItem("usageData"));

    if (
      saved &&
      saved.month === currentMonth &&
      saved.year === currentYear
    ) {
      setUsage(saved.count);
    } else {
      localStorage.setItem(
        "usageData",
        JSON.stringify({
          month: currentMonth,
          year: currentYear,
          count: 0,
        })
      );
      setUsage(0);
    }

    // premium check
    const premium = localStorage.getItem("premium");
    if (premium === "true") {
      setIsPremium(true);
    }
  }, []);

  // 🧠 ANALYZE
  const handleAnalyze = async () => {
    if (!resumeText) {
      alert("Paste resume text first");
      return;
    }

    // 🚫 LIMIT CHECK (3 per month)
    if (!isPremium && usage >= 3) {
      alert("Free limit reached (3/month). Upgrade to Premium 💎");
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

      // 🔥 SAFE JSON PARSE
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

      // 🔥 UPDATE MONTHLY USAGE
      if (!isPremium) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const newUsage = usage + 1;
        setUsage(newUsage);

        localStorage.setItem(
          "usageData",
          JSON.stringify({
            month: currentMonth,
            year: currentYear,
            count: newUsage,
          })
        );
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ⏳ LOADING
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

              {/* 🔥 USAGE DISPLAY */}
              <p>
                {isPremium
                  ? "💎 Premium User"
                  : `Free usage: ${usage}/3 this month`}
              </p>
            </div>

            <div>
              <button style={styles.logout} onClick={handleLogout}>
                Logout
              </button>

              {/* 💎 PREMIUM BUTTON */}
              {!isPremium && (
                <button
                  onClick={() => {
                    localStorage.setItem("premium", "true");
                    setIsPremium(true);
                    alert("Premium activated 🚀");
                  }}
                  style={styles.premium}
                >
                  Upgrade 💎
                </button>
              )}
            </div>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 style={styles.score}>{result.score}/100</h1>
              <p>{result.feedback}</p>

              <h3>✅ Strengths</h3>
              <ul>
                {result.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <h3>⚠️ Weaknesses</h3>
              <ul>
                {result.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>

              <h3>🚀 Improvements</h3>
              <ul>
                {result.improvements?.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
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
    background: "#0f172a",
    color: "white",
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
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
  },
  textarea: {
    width: "100%",
    height: "150px",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "6px",
  },
  btn: {
    background: "#3b82f6",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
  },
  logout: {
    background: "#ef4444",
    color: "white",
    marginRight: "10px",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
  },
  premium: {
    background: "#22c55e",
    color: "white",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
  },
  resultCard: {
    marginTop: "20px",
    background: "#020617",
    padding: "20px",
    borderRadius: "10px",
  },
  score: {
    fontSize: "40px",
    color: "#22c55e",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
