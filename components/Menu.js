"use client";

import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex justify-between items-center p-4 bg-black border-b border-gray-800">
        <h1 className="font-bold text-lg">🚀 JobBooster</h1>
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-gray-800 p-6 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-300`}
      >
        {/* DESKTOP TITLE ONLY */}
        <h1 className="text-2xl font-bold mb-10 hidden md:block">
          🚀 JobBooster
        </h1>

        <nav className="flex flex-col gap-4 text-gray-400">
          <Link href="/dashboard" className="hover:text-white">🏠 Dashboard</Link>
          <Link href="/analyze" className="hover:text-white">📄 Analyze</Link>
          <Link href="/interview" className="hover:text-white">🎤 Interview</Link>
          <Link href="/skill-gap" className="hover:text-white">📉 Skill Gap</Link>
          <Link href="/history" className="hover:text-white">📊 History</Link>
          <Link href="/pricing" className="hover:text-white">💎 Pricing</Link>
          <Link href="/account" className="hover:text-white">⚙️ Account</Link>
        </nav>
      </aside>
    </>
  );
    }
