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

  // 🔥 usage + premium
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

  // 🔥 AUTH
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

    const premium = localStorage.getItem("premium");
    if (premium === "true") setIsPremium(true);
  }, []);

  // 💎 UPGRADE
  const handleUpgrade = () => {
    localStorage.setItem("premium", "true");
    setIsPremium(true);
    alert("Premium activated 🚀");
  };

  if (checking) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      <Menu />

      {!user ? (
        <div style={styles.center}>
          <button style={styles.btn} onClick={handleLogin}>
            Login with Google 🚀
          </button>
        </div>
      ) : (
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h2>Welcome, {user.displayName} 👋</h2>
              <p>{user.email}</p>
              <p>
                {isPremium
                  ? "💎 Premium Plan"
                  : `Free Plan: ${usage}/3 used`}
              </p>
            </div>

            <div style={styles.actions}>
              <button style={styles.logout} onClick={handleLogout}>
                Logout
              </button>

              {!isPremium && (
                <button style={styles.premium} onClick={handleUpgrade}>
                  Upgrade 💎
                </button>
              )}
            </div>
          </div>

          {/* STATS */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3>📊 Usage</h3>
              <p>{isPremium ? "Unlimited" : `${usage}/3 this month`}</p>
            </div>

            <div style={styles.card}>
              <h3>🎯 Goal</h3>
              <p>Practice daily interviews</p>
            </div>

            <div style={styles.card}>
              <h3>⚡ Status</h3>
              <p>{isPremium ? "Premium Active" : "Free User"}</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={styles.card}>
            <h3>🚀 Quick Actions</h3>
            <ul>
              <li>👉 Go to Analyze → Start Interview Practice</li>
              <li>👉 Answer questions & get feedback</li>
              <li>👉 Check History → Track improvement</li>
            </ul>
          </div>

          {/* FEATURES */}
          <div style={styles.card}>
            <h3>💡 Features</h3>
            <ul>
              <li>AI-generated interview questions</li>
              <li>Answer evaluation with score</li>
              <li>Personalized feedback</li>
              <li>Progress tracking</li>
            </ul>
          </div>
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
    maxWidth: "900px",
    margin: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  card: {
    background: "#020617",
    padding: "20px",
    borderRadius: "10px",
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
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    color: "white",
  },
  premium: {
    background: "#22c55e",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    color: "white",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
