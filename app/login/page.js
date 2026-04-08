"use client";
import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name) return alert("Enter name");

    localStorage.setItem("user", name);
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <input
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
