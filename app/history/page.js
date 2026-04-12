"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Menu from "../../components/Menu";

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();

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
    };

    fetchData();
  }, []);

  return (
    <div style={styles.page}>
      <Menu />

      <div style={styles.container}>
        <h1>📊 Interview History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No history yet</p>
        ) : (
          data.map((item, i) => (
            <div key={item.id} style={styles.card}>
              <h3>{item.role}</h3>
              <p><strong>Skills:</strong> {item.skills}</p>

              {item.score && (
                <p><strong>Score:</strong> {item.score}/100</p>
              )}

              {item.feedback && <p>{item.feedback}</p>}

              {item.questions && (
                <ul>
                  {item.questions.map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              )}

              <small style={styles.date}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : ""}
              </small>
            </div>
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
  date: {
    fontSize: "12px",
    color: "#94a3b8",
  },
};
