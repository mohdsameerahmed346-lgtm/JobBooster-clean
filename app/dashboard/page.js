"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Menu from "../../components/Menu";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return <div style={styles.center}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <Menu />

      <div style={styles.container}>
        {!user ? (
          <h2>Please login to continue</h2>
        ) : (
          <>
            <h1>🚀 Dashboard</h1>

            <div style={styles.card}>
              <h2>Welcome, {user.displayName} 👋</h2>
              <p>{user.email}</p>
            </div>

            <div style={styles.card}>
              <h3>📌 What you can do:</h3>
              <ul>
                <li>Go to Analyze → Practice Interview</li>
                <li>Answer AI-generated questions</li>
                <li>Get feedback & improve</li>
                <li>View History → Track your progress</li>
              </ul>
            </div>
          </>
        )}
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
    maxWidth: "800px",
    margin: "auto",
  },
  card: {
    background: "#020617",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
