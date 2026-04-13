"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Menu from "../../components/Menu";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("usageData"));
    if (saved) setUsage(saved.count);

    if (localStorage.getItem("premium") === "true") {
      setIsPremium(true);
    }
  }, []);

  const handleLogin = async () => {
    const res = await signInWithPopup(auth, provider);
    setUser(res.user);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleUpgrade = () => {
    localStorage.setItem("premium", "true");
    setIsPremium(true);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={handleLogin}
          className="bg-indigo-600 px-6 py-3 rounded-lg"
        >
          Login 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="flex">
      <Menu />

      <div className="ml-64 p-8 w-full">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-slate-400">
              Welcome, {user.displayName}
            </p>
          </div>

          <div className="flex gap-3">
            {!isPremium && (
              <button
                onClick={handleUpgrade}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Upgrade 💎
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Plan</p>
            <h2 className="text-xl">
              {isPremium ? "💎 Premium" : "Free"}
            </h2>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Usage</p>
            <h2 className="text-xl">
              {isPremium ? "Unlimited" : `${usage}/3`}
            </h2>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Status</p>
            <h2 className="text-xl">
              {isPremium ? "Active" : "Limited"}
            </h2>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">
            🚀 Start Interview Practice
          </h2>
          <p className="text-sm text-slate-200 mt-1">
            Generate AI questions based on your job role
          </p>

          <button
            onClick={() => (window.location.href = "/analyze")}
            className="mt-4 bg-white text-black px-5 py-2 rounded-lg"
          >
            Start Now →
          </button>
        </div>
      </div>
    </div>
  );
      }
