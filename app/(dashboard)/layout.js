"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-black border-r border-gray-800 p-5 space-y-6">
        <h1 className="text-xl font-bold">🚀 JobBooster</h1>

        <nav className="flex flex-col gap-4 text-gray-400">
          <Link href="/dashboard">🏠 Dashboard</Link>
          <Link href="/analyze">📄 Analyze</Link>
          <Link href="/interview">🎤 Interview</Link>
          <Link href="/skill-gap">📉 Skill Gap</Link>
          <Link href="/job-match">🎯 Job Match</Link>
          <Link href="/history">📊 History</Link>
          <Link href="/pricing">💎 Pricing</Link>
          <Link href="/account">⚙️ Account</Link>
        </nav>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black border-b border-gray-800 p-4 flex justify-between items-center z-50">
        <h1>🚀 JobBooster</h1>
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed top-16 left-0 w-full bg-black p-5 space-y-4 z-50">
          <Link href="/dashboard">🏠 Dashboard</Link>
          <Link href="/analyze">📄 Analyze</Link>
          <Link href="/interview">🎤 Interview</Link>
          <Link href="/skill-gap">📉 Skill Gap</Link>
          <Link href="/job-match">🎯 Job Match</Link>
          <Link href="/history">📊 History</Link>
          <Link href="/pricing">💎 Pricing</Link>
          <Link href="/account">⚙️ Account</Link>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 mt-16 md:mt-0">
        {children}
      </main>

    </div>
  );
    }
