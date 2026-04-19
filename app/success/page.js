"use client";

import { useEffect } from "react";

export default function Success() {

  useEffect(() => {
    localStorage.setItem("premium", "true");
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-white bg-slate-950">
      <div className="text-center">
        <h1 className="text-2xl mb-4">🎉 Payment Successful</h1>
        <p>You are now Premium 💎</p>
      </div>
    </div>
  );
    }
