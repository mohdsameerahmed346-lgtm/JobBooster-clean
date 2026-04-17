"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <div
        className={`bg-black border-r border-gray-800 p-5 space-y-6 transition-all duration-300 ${
          open ? "w-64" : "w-16"
        }`}
      >
        {/* LOGO */}
        <h1 className="text-xl font-bold">
          {open ? "🚀 JobBooster" : "🚀"}
        </h1>

        {/* NAV */}
        <nav className="flex flex-col gap-3 text-sm">

          <Link href="/dashboard" className="hover:text-blue-400">
            🏠 {open && "Dashboard"}
          </Link>

          <Link href="/analyze" className="hover:text-blue-400">
            📄 {open && "Analyze"}
          </Link>

          <Link href="/interview" className="hover:text-blue-400">
            🎤 {open && "Interview"}
          </Link>

          <Link href="/skill-gap" className="hover:text-blue-400">
            📉 {open && "Skill Gap"}
          </Link>

          <Link href="/job-match" className="hover:text-blue-400">
            🎯 {open && "Job Match"}
          </Link>

          <Link href="/history" className="hover:text-blue-400">
            📊 {open && "History"}
          </Link>

          <Link href="/pricing" className="hover:text-yellow-400">
            💎 {open && "Pricing"}
          </Link>

          <Link href="/account" className="hover:text-blue-400">
            ⚙️ {open && "Account"}
          </Link>

        </nav>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-slate-950">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="text-xl"
            >
              ☰
            </button>

            <h2 className="text-lg font-semibold">
              Dashboard
            </h2>
          </div>

          {/* RIGHT */}
          <div className="text-sm text-gray-400">
            Plan:{" "}
            {typeof window !== "undefined" &&
            localStorage.getItem("premium") === "true"
              ? "💎 Premium"
              : "🆓 Free"}
          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-6">{children}</div>

      </div>
    </div>
  );
}
