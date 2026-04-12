"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Menu from "../../components/Menu"; // ✅ FIXED
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const init = () => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (!user) {
            setLoading(false);
            return;
          }

          const db = getFirestore();

          // ⚠️ TEMP FIX (matches your API)
          const q = query(
            collection(db, "users", "demo-user", "history"),
            orderBy("createdAt", "desc")
          );

          const snap = await getDocs(q);

          const results = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setData(results);
        } catch (err) {
          console.error(err);
          alert("Failed to load history");
        } finally {
          setLoading(false);
        }
      });
    };

    init();

    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div style={styles.page}>
      <Menu />

      <div style={styles.container}>
        <h1>📊 Analysis History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No history yet</p>
        ) : (
          data.map((item, i) => (
            <motion.div
              key={item.id}
              style={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 style={styles.score}>{item.score}/100</h2>

              <p>{item.feedback}</p>

              <small style={styles.date}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "No date"}
              </small>
            </motion.div>
          ))
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
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  score: {
    fontSize: "28px",
    color: "#22c55e",
  },
  date: {
    color: "#94a3b8",
    fontSize: "12px",
  },
};
