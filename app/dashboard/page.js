"use client";

import { useState, useEffect } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 important

  // 🔐 LOGIN
  const login = async () => {
    await signInWithRedirect(auth, provider);
  };

  // 🔁 HANDLE REDIRECT RESULT
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // 🔥 AUTH STATE LISTENER (MAIN FIX)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // ✅ stop loading after check
    });

    return () => unsubscribe();
  }, []);

  // ⏳ WAIT UNTIL AUTH CHECKED
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {!user ? (
        <button
          onClick={login}
          className="bg-white text-black px-6 py-3 rounded-xl"
        >
          Login with Google 🚀
        </button>
      ) : (
        <h1 className="text-2xl">
          Welcome, {user.displayName} 🎉
        </h1>
      )}
    </div>
  );
            }
