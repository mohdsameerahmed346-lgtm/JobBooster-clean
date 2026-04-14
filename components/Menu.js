"use client";

import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white px-3 py-2 rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-950 text-white p-5 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform`}
      >
        <h1 className="text-2xl font-bold mb-8">🚀 JobBooster</h1>

        <nav className="flex flex-col gap-4">
          <Link href="/dashboard">🏠 Dashboard</Link>
          <Link href="/analyze">📄 Analyze</Link>
          <Link href="/interview">🎤 Interview</Link>
          <Link href="/history">📊 History</Link>
          <Link href="/account">⚙️ Account</Link>
        </nav>
      </div>
    </>
  );
          }
