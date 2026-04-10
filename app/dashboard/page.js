"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // 🔐 LOGIN (simple + reliable)
  const handleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // 🔥 AUTH STATE (MAIN SOURCE OF TRUTH)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ WAIT
  if (checking) {
    return (
      <div style={{ color: "white", background: "black", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        color: "white",
        background: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!user ? (
        <button onClick={handleLogin}>
          Login with Google 🚀
        </button>
      ) : (
        <h1>Welcome, {user.displayName} 🎉</h1>
      )}
    </div>
  );
      }
