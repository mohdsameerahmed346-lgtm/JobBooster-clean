"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Menu from "../../components/Menu";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
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

  // 🔥 USAGE SYSTEM
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const saved = JSON.parse(localStorage.getItem("usageData"));

    if (saved && saved.month === month && saved.year === year) {
      setUsage(saved.count);
    } else {
      localStorage.setItem(
        "usageData",
        JSON.stringify({ month, year, count: 0 })
      );
      setUsage(0);
    }

    if (localStorage.getItem("premium") === "true") {
      setIsPremium(true);
    }
  }, []);

  // 💎 UPGRADE
  const handleUpgrade = () => {
    localStorage.setItem("premium", "true");
    setIsPremium(true);
  };

  if (checking) {
    return <div style={styles.center}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <Menu />

      {!user ? (
        <div style={styles.center}>
          <button style={styles.primaryBtn} onClick={handleLogin}>
            Continue with Google 🚀
          </button>
        </div>
      ) : (
        <div style={styles.wrapper}>
          {/* HEADER */}
          <div style={styles.topBar}>
            <div>
              <h2 style={styles.title}>Dashboard</h2>
              <p style={styles.subtitle}>
                Welcome back, {user.displayName}
              </p>
            </div>

            <div style={styles.actions}>
              {!isPremium && (
                <button style={styles.upgradeBtn} onClick={handleUpgrade}>
                  Upgrade 💎
                </button>
              )}
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* STATS */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Plan</p>
              <h3>💎 {isPremium ? "Premium" : "Free"}</h3>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Usage</p>
              <h3>📊 {isPremium ? "Unlimited" : `${usage}/3`}</h3>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Status</p>
              <h3>⚡ {isPremium ? "Active" : "Limited"}</h3>
            </div>
          </div>

          {/* MAIN CTA */}
          <div style={styles.mainCard}>
            <h3>🚀 Start Interview Practice</h3>
            <p>
              Generate AI-powered interview questions based on your job role
              and improve your answers with smart feedback.
            </p>

            <button
              style={styles.primaryBtn}
              onClick={() => (window.location.href = "/analyze")}
            >
              Start Now →
            </button>
          </div>

          {/* FEATURES */}
          <div style={styles.features}>
            <div style={styles.featureCard}>
              <h4>🤖 AI Interview Questions</h4>
              <p>Personalized based on your job role</p>
            </div>

            <div style={styles.featureCard}>
              <h4>🧠 Smart Feedback</h4>
              <p>Get score + improvement tips instantly</p>
            </div>

            <div style={styles.featureCard}>
              <h4>📈 Track Progress</h4>
              <p>View your performance history & growth</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 STYLES (MODERN SaaS)
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "#e5e7eb",
    padding: "20px",
  },

  wrapper: {
    maxWidth: "1100px",
    margin: "auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#94a3b8",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "22px",
    borderRadius: "14px",
    transition: "0.3s",
  },

  cardLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "6px",
  },

  mainCard: {
    background: "linear-gradient(135deg, #1e293b, #020617)",
    padding: "30px",
    borderRadius: "16px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  featureCard: {
    background: "rgba(255,255,255,0.04)",
    padding: "22px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  primaryBtn: {
    marginTop: "15px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  upgradeBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },

  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
