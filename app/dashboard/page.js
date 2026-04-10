"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithRedirect,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // 🔐 LOGIN (SET PERSISTENCE BEFORE LOGIN)
  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence); // 🔥 FIX
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("USER:", currentUser);
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
