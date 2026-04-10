"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // 🔐 LOGIN WITH POPUP (NO REDIRECT)
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in:", result.user);
      setUser(result.user);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message);
    }
  };

  // 🔥 AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state:", currentUser);
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div style={{ background: "black", color: "white", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "black",
        color: "white",
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
