"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const db = getFirestore();
  const storage = getStorage();

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

  // 📄 FILE SELECT
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🚀 UPLOAD TO FIREBASE STORAGE
  const handleUpload = async () => {
    if (!file || !user) {
      alert("Select file first");
      return;
    }

    try {
      setUploading(true);

      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      console.log("File URL:", downloadURL);

      // 💾 Save resume URL
      await setDoc(doc(db, "resumes", user.uid), {
        fileName: file.name,
        url: downloadURL,
      });

      alert("Resume uploaded successfully 🚀");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
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

          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Resume 📄"}
          </button>

          {/* 🔓 Logout */}
          <button onClick={handleLogout} style={{ marginTop: "20px" }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
