"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  // 🔐 Protect dashboard
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
    }
  }, []);

  // 📄 Generate Resume
  const generateResume = () => {
    const text = `
PROFESSIONAL RESUME

Name: ${name}
Role: ${role}

----------------------------------

SUMMARY:
Motivated and passionate ${role} ready to grow and contribute.

----------------------------------

SKILLS:
- Communication
- Problem Solving
- Teamwork

----------------------------------

EXPERIENCE:
Fresher
    `;

    setResult(text);
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>📊 Dashboard</h1>

      {/* Logout */}
      <button onClick={handleLogout}>
        Logout
      </button>

      <br /><br />

      {/* Inputs */}
      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br /><br />

      {/* Generate Resume */}
      <button onClick={generateResume}>
        Generate Resume
      </button>

      <br /><br />

      {/* Output */}
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {result}
      </pre>
    </main>
  );
    }
