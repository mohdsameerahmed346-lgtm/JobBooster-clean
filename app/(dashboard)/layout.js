"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <div className={`fixed md:static z-50 bg-black w-64 h-full p-5 border-r border-gray-800 transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition`}>
        
        <h1 className="text-2xl font-bold mb-8">🚀 JobBooster</h1>

        <nav className="space-y-4 text-sm">
          <Link href="/dashboard">🏠 Dashboard</Link><br/>
          <Link href="/analyze">📄 Analyze</Link><br/>
          <Link href="/interview">🎤 Interview</Link><br/>
          <Link href="/skill-gap">📉 Skill Gap</Link><br/>
          <Link href="/history">📊 History</Link><br/>
          <Link href="/pricing">💎 Pricing</Link><br/>
          <Link href="/account">⚙️ Account</Link>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-xl"
          >
            ☰
          </button>

          <h2 className="text-lg font-semibold">Dashboard</h2>

          <span className="text-sm text-gray-400">
            Plan: {typeof window !== "undefined" && localStorage.getItem("premium") === "true" ? "💎 Premium" : "🆓 Free"}
          </span>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-6">{children}</div>

      </div>
    </div>
  );
  }
