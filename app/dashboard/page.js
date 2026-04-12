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
    const res = await signInWithPopup(auth, provider);
    setUser(res.user);
  };

  // 🔓 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  // USAGE SYSTEM
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

  const handleUpgrade = () => {
    localStorage.setItem("premium", "true");
    setIsPremium(true);
  };

  if (checking) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      <Menu />

      {!user ? (
        <div style={styles.center}>
          <button style={styles.primaryBtn} onClick={handleLogin}>
            Continue with Google
          </button>
        </div>
      ) : (
        <div style={styles.wrapper}>
          {/* HEADER */}
          <div style={styles.topBar}>
            <div>
              <h2 style={styles.title}>Dashboard</h2>
              <p style={styles.subtitle}>Welcome back, {user.displayName}</p>
            </div>

            <div style={styles.actions}>
              {!isPremium && (
                <button style={styles.upgradeBtn} onClick={handleUpgrade}>
                  Upgrade
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
              <h3>{isPremium ? "Premium" : "Free"}</h3>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Usage</p>
              <h3>{isPremium ? "Unlimited" : `${usage}/3`}</h3>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Status</p>
              <h3>{isPremium ? "Active" : "Limited"}</h3>
            </div>
          </div>

          {/* MAIN CARD */}
          <div style={styles.mainCard}>
            <h3>🚀 Start Practicing</h3>
            <p>
              Go to Analyze section and generate AI-powered interview questions
              based on your job role.
            </p>

            <button style={styles.primaryBtn}>
              Go to Analyze →
            </button>
          </div>

          {/* FEATURES */}
          <div style={styles.features}>
            <div style={styles.featureCard}>
              <h4>AI Interview Questions</h4>
              <p>Personalized based on your job role</p>
            </div>

            <div style={styles.featureCard}>
              <h4>Answer Feedback</h4>
              <p>Get score + improvement tips</p>
            </div>

            <div style={styles.featureCard}>
              <h4>Progress Tracking</h4>
              <p>View your history & growth</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 MODERN STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f19",
    color: "#e5e7eb",
    padding: "20px",
  },
  wrapper: {
    maxWidth: "1000px",
    margin: "auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
  },
  subtitle: {
    color: "#9ca3af",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },
  card: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
  },
  cardLabel: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  mainCard: {
    background: "#111827",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "25px",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },
  featureCard: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
  },
  primaryBtn: {
    marginTop: "10px",
    background: "#6366f1",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  upgradeBtn: {
    background: "#22c55e",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
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
