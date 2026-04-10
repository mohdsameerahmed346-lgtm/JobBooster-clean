"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const db = getFirestore();

  // 🔐 LOGIN
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

  // 🔓 LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
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

  // 💾 SAVE USER TO FIRESTORE
  useEffect(() => {
    if (user) {
      setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
      })
        .then(() => console.log("User saved"))
        .catch((err) => console.error("Firestore error:", err));
    }
  }, [user, db]);

  // ⏳ LOADING
  if (checking) {
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!user ? (
        <button onClick={handleLogin}>
          Login with Google 🚀
        </button>
      ) : (
        <>
          <h1>Welcome, {user.displayName} 🎉</h1>

          <p style={{ marginTop: "10px" }}>{user.email}</p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "white",
              color: "black",
              borderRadius: "8px",
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
