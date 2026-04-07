"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "auto" }}>

      {/* HERO */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <h1 style={{ fontSize: 40 }}>
          🚀 JobBoost AI
        </h1>

        <p style={{ fontSize: 18, marginTop: 10 }}>
          AI-powered Resume, Cover Letter & Career Coach for Freshers
        </p>

        <button
          onClick={() => router.push("/login")}
          style={btnPrimary}
        >
          Get Started Free
        </button>
      </div>

      {/* FEATURES */}
      <div style={{ marginTop: 60 }}>
        <h2>🔥 Features</h2>

        <div style={grid}>
          <div style={card}>
            <h3>📄 Resume Optimizer</h3>
            <p>Improve your resume for any job instantly</p>
          </div>

          <div style={card}>
            <h3>📊 ATS Score</h3>
            <p>See how your resume performs</p>
          </div>

          <div style={card}>
            <h3>🧠 Skill Gap</h3>
            <p>Know what skills you're missing</p>
          </div>

          <div style={card}>
            <h3>🎯 Interview Prep</h3>
            <p>Get real interview questions</p>
          </div>

          <div style={card}>
            <h3>🗺️ Career Guidance</h3>
            <p>Step-by-step career roadmap</p>
          </div>

          <div style={card}>
            <h3>📊 Job Tracker</h3>
            <p>Track all your job applications</p>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ marginTop: 60, textAlign: "center" }}>
        <h2>💎 Pricing</h2>

        <div style={grid}>
          <div style={card}>
            <h3>Free</h3>
            <p>1 Resume Optimization</p>
            <p>1 Cover Letter</p>
            <p>Basic Features</p>
          </div>

          <div style={{ ...card, border: "2px solid black" }}>
            <h3>Pro ₹299</h3>
            <p>Unlimited Access</p>
            <p>PDF Download</p>
            <p>Job Tracker</p>

            <button
              style={btnPrimary}
              onClick={() => router.push("/login")}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <h2>🚀 Start Your Career Today</h2>

        <button
          onClick={() => router.push("/login")}
          style={btnPrimary}
        >
          Try Now
        </button>
      </div>

    </main>
  );
}

/* STYLES */
const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  marginTop: 20
};

const card = {
  padding: 20,
  background: "#f5f5f5",
  borderRadius: 10
};

const btnPrimary = {
  marginTop: 20,
  padding: 12,
  background: "black",
  color: "white",
  borderRadius: 6,
  fontWeight: "bold"
};
