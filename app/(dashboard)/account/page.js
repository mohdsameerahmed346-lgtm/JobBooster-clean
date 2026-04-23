"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    setPremium(localStorage.getItem("premium") === "true");

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-gray-400">
          Manage your profile and subscription
        </p>
      </div>

      {/* USER CARD */}
      <div className="glass p-6 rounded-2xl flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl">
          {user?.email?.[0]?.toUpperCase() || "U"}
        </div>

        <div>
          <p className="font-semibold">{user?.email}</p>
          <p className="text-sm text-gray-400">
            {premium ? "Premium Member 💎" : "Free Plan 🆓"}
          </p>
        </div>

      </div>

      {/* PLAN CARD */}
      <div className="glass p-6 rounded-2xl space-y-4">

        <h2 className="text-xl font-semibold">Subscription</h2>

        <div className="flex justify-between items-center">

          <div>
            <p className="font-medium">
              {premium ? "Premium Plan 💎" : "Free Plan 🆓"}
            </p>
            <p className="text-sm text-gray-400">
              {premium
                ? "Unlimited AI usage"
                : "Limited AI access"}
            </p>
          </div>

          {!premium && (
            <button
              onClick={() => {
                localStorage.setItem("premium", "true");
                setPremium(true);
              }}
              className="bg-blue-600 px-5 py-2 rounded-lg"
            >
              Upgrade
            </button>
          )}

        </div>

      </div>

      {/* USAGE CARD */}
      <div className="glass p-6 rounded-2xl space-y-4">

        <h2 className="text-xl font-semibold">Usage</h2>

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-black p-4 rounded-xl">
            <p className="text-sm text-gray-400">Messages</p>
            <p className="text-xl font-bold">120</p>
          </div>

          <div className="bg-black p-4 rounded-xl">
            <p className="text-sm text-gray-400">Chats</p>
            <p className="text-xl font-bold">8</p>
          </div>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center">

        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300"
        >
          Logout
        </button>

      </div>

    </div>
  );
                                     }
