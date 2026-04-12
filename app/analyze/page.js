"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Menu from "../../components/Menu"; // ✅ FIXED PATH

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText) {
      alert("Paste resume first");
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

      // ✅ FIXED (NO PARSE NEEDED)
      setResult(data.result);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Menu />

      <div style={styles.container}>
        <h1>📄 Resume Analyzer</h1>

        <motion.textarea
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={styles.textarea}
        />

        <motion.button
          style={styles.button}
          onClick={handleAnalyze}
          whileHover={{ scale: 1.05 }}
        >
          {loading ? "Analyzing..." : "Analyze Resume 🧠"}
        </motion.button>

        {result && (
          <motion.div style={styles.resultBox}>
            <h2 style={styles.score}>{result.score}/100</h2>
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
    </div>
  );
}

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
  textarea: {
    width: "100%",
    height: "180px",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "none",
  },
  button: {
    background: "#3b82f6",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "20px",
    background: "#020617",
    padding: "20px",
    borderRadius: "10px",
  },
  score: {
    fontSize: "36px",
    color: "#22c55e",
  },
};
