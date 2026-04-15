"use client";

import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOP BAR (MOBILE) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-[#020617]">
        <h1 className="text-lg font-bold">🚀 JobBooster</h1>
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#020617] border-r border-gray-800 p-6 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <h1 className="text-2xl font-bold mb-8 hidden md:block">
          🚀 JobBooster
        </h1>

        <nav className="flex flex-col gap-5 text-gray-400">
          <Link href="/dashboard">🏠 Dashboard</Link>
          <Link href="/analyze">📄 Analyze</Link>
          <Link href="/interview">🎤 Interview</Link>
          <Link href="/skill-gap">📉 Skill Gap</Link>
          <Link href="/history">📊 History</Link>
          <Link href="/pricing">💎 Pricing</Link>
          <Link href="/account">⚙️ Account</Link>
        </nav>
      </div>
    </>
  );
    }
