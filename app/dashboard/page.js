"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    // 🔥 HANDLE REDIRECT RESULT (VERY IMPORTANT)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Redirect user:", result.user);
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect error:", error);
      });

    // 🔥 AUTH STATE LISTENER (MAIN SOURCE)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth user:", currentUser);
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ WAIT UNTIL AUTH READY
  if (checking) {
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
