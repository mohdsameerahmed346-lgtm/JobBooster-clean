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
  const [file, setFile] = useState(null);

  const db = getFirestore();

  // 🔐 LOGIN
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  // 🔓 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🔥 AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // 💾 SAVE USER
  useEffect(() => {
    if (user) {
      setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
      });
    }
  }, [user]);

  // 📄 HANDLE FILE
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    console.log("File selected:", file.name);

    // 🚀 NEXT: We will upload + analyze
    alert("Resume uploaded (next: AI scan)");
  };

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
          <p>{user.email}</p>

          {/* 📄 Upload */}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ marginTop: "20px" }}
          />

          <button onClick={handleUpload} style={{ marginTop: "10px" }}>
            Upload Resume 📄
          </button>

          {/* 🔓 Logout */}
          <button
            onClick={handleLogout}
            style={{ marginTop: "20px" }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
