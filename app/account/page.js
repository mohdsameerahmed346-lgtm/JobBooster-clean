"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Menu from "../../components/Menu"; // ✅ FIXED PATH
import { motion } from "framer-motion";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  // ✅ FIXED AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    // 🔥 PREMIUM CHECK
    const premium = localStorage.getItem("premium");
    if (premium === "true") {
      setIsPremium(true);
    }

    return () => unsubscribe();
  }, []);

  // 💎 TEMP UPGRADE
  const handleUpgrade = () => {
    localStorage.setItem("premium", "true");
    setIsPremium(true);
    alert("Premium activated 🚀 (temporary)");
  };

  return (
    <div style={styles.page}>
      <Menu />

      <div style={styles.container}>
        <h1>⚙️ Account & Billing</h1>

        {/* USER INFO */}
        <motion.div style={styles.card}>
          <h2>User Info</h2>
          <p><strong>Name:</strong> {user?.displayName || "Not logged in"}</p>
          <p><strong>Email:</strong> {user?.email || "Not available"}</p>
        </motion.div>

        {/* PLAN INFO */}
        <motion.div style={styles.card}>
          <h2>Current Plan</h2>
          <p>
            {isPremium ? "💎 Premium Plan" : "🆓 Free Plan (3/month limit)"}
          </p>

          {!isPremium && (
            <button style={styles.button} onClick={handleUpgrade}>
              Upgrade to Premium 💎
            </button>
          )}
        </motion.div>

        {/* FEATURES */}
        <motion.div style={styles.card}>
          <h2>Premium Benefits</h2>
          <ul>
            <li>Unlimited resume analysis</li>
            <li>Better AI model (high accuracy)</li>
            <li>Faster response</li>
            <li>Future advanced features</li>
          </ul>
        </motion.div>
      </div>
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
    maxWidth: "700px",
    margin: "auto",
  },
  card: {
    background: "#020617",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  button: {
    marginTop: "10px",
    background: "#22c55e",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};
