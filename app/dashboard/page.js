"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function Dashboard() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const [optimized, setOptimized] = useState("");
  const [cover, setCover] = useState("");
  const [score, setScore] = useState("");

  const [usage, setUsage] = useState(0);

  // 🔐 Protect route
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");

    const used = localStorage.getItem("usage") || 0;
    setUsage(Number(used));
  }, []);

  const isPro = localStorage.getItem("paid");

  // 📄 Resume Optimizer (LIMITED)
  const optimizeResume = () => {
    if (!isPro && usage >= 1) {
      alert("Free limit reached. Upgrade to Pro 🚀");
      return;
    }

    const keywords = jobDesc.split(" ").slice(0, 5);

    const text = `
OPTIMIZED RESUME

${resumeText}

Added Keywords:
${keywords.join(", ")}
    `;

    setOptimized(text);

    const match = keywords.filter(k => resumeText.includes(k)).length;
    setScore(`ATS Score: ${match + 5}/10`);

    if (!isPro) {
      localStorage.setItem("usage", usage + 1);
      setUsage(usage + 1);
    }
  };

  // ✉️ Cover Letter (LIMITED)
  const generateCover = () => {
    if (!isPro && usage >= 1) {
      alert("Free limit reached. Upgrade to Pro 🚀");
      return;
    }

    const text = `
Dear Hiring Manager,

I am applying for ${role}. I am motivated and ready to grow.

Thank you,
${name}
    `;

    setCover(text);

    if (!isPro) {
      localStorage.setItem("usage", usage + 1);
      setUsage(usage + 1);
    }
  };

  // 📥 PDF Download (PRO ONLY)
  const downloadPDF = () => {
    if (!isPro) {
      alert("Upgrade to Pro to download PDF 🚀");
      return;
    }

    const doc = new jsPDF();
    doc.text(optimized || cover, 10, 10);
    doc.save("jobboost.pdf");
  };

  // 💰 Activate Pro (Fake payment)
  const activatePro = () => {
    localStorage.setItem("paid", "true");
    alert("Pro Activated 🚀");
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>🚀 JobBoost AI</h1>

      <button onClick={logout}>Logout</button>

      <p>Free Usage: {usage}/1</p>

      <hr />

      {/* Resume Optimizer */}
      <h2>🔥 Optimize Resume</h2>

      <textarea
        placeholder="Paste resume"
        onChange={(e) => setResumeText(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Paste job description"
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <br /><br />

      <button onClick={optimizeResume}>Optimize</button>

      <pre>{optimized}</pre>
      <h3>{score}</h3>

      <hr />

      {/* Cover Letter */}
      <h2>✉️ Cover Letter</h2>

      <input
        placeholder="Your Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Role"
        onChange={(e) => setRole(e.target.value)}
      />

      <br /><br />

      <button onClick={generateCover}>Generate</button>

      <pre>{cover}</pre>

      <br />

      {/* PDF */}
      <button onClick={downloadPDF}>Download PDF</button>

      <hr />

      {/* PRO */}
      {!isPro && (
        <>
          <h2>💎 Upgrade to Pro</h2>
          <button onClick={activatePro}>
            Activate Pro ₹299
          </button>
        </>
      )}
    </main>
  );
}
