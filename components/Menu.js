"use client";

import Link from "next/link";

export default function Menu() {
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[#020617] border-r border-gray-800 p-6 flex flex-col">
      
      <h1 className="text-2xl font-bold mb-8">🚀 JobBooster</h1>

      <nav className="flex flex-col gap-4 text-gray-400">
        <Link href="/dashboard" className="hover:text-white block">
          🏠 Dashboard
        </Link>

        <Link href="/analyze" className="hover:text-white block">
          📄 Analyze
        </Link>

        <Link href="/interview" className="hover:text-white block">
          🎤 Interview
        </Link>

        <Link href="/skill-gap" className="hover:text-white block">
          📉 Skill Gap
        </Link>

        <Link href="/history" className="hover:text-white block">
          📊 History
        </Link>

        <Link href="/pricing" className="hover:text-white block">
          💎 Pricing
        </Link>

        <Link href="/account" className="hover:text-white block">
          ⚙️ Account
        </Link>
      </nav>
    </div>
  );
    }
