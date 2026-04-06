"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    localStorage.setItem("user", email);
    window.location.href = "/dashboard";
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Login Page</h1>

      <input
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "10px" }}
      />

      <button onClick={handleLogin}>Login</button>
    </main>
  );
}
