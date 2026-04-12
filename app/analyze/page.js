"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

export default function AnalyzePage() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluation, setEvaluation] = useState(null);

  const generateQuestions = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ role, skills }),
    });

    const data = await res.json();
    setQuestions(data.result.questions);
  };

  const evaluateAnswer = async (q) => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        role,
        skills,
        question: q,
        answer: answers[q],
      }),
    });

    const data = await res.json();
    setEvaluation(data.result);
  };

  return (
    <div style={{ padding: 20 }}>
      <Menu />

      <h1>🎤 AI Interview Trainer</h1>

      <input placeholder="Job Role" onChange={(e) => setRole(e.target.value)} />
      <input placeholder="Skills" onChange={(e) => setSkills(e.target.value)} />

      <button onClick={generateQuestions}>Generate Questions</button>

      {questions.map((q, i) => (
        <div key={i}>
          <p>{q}</p>
          <textarea
            onChange={(e) =>
              setAnswers({ ...answers, [q]: e.target.value })
            }
          />
          <button onClick={() => evaluateAnswer(q)}>Submit Answer</button>
        </div>
      ))}

      {evaluation && (
        <div>
          <h2>{evaluation.score}/100</h2>
          <p>{evaluation.feedback}</p>
        </div>
      )}
    </div>
  );
    }
