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

  // 🔐 LOGIN
  const login = async () => {
    try {
      console.log("Login started");
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // 🔁 HANDLE REDIRECT RESULT
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Redirect error:", error);
      }
    };

    checkRedirect();
  }, []);

  // 🔥 AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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
