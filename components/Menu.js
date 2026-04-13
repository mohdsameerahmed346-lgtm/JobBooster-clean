"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  const path = usePathname();

  const linkClass = (href) =>
    `block px-4 py-2 rounded-lg transition ${
      path === href
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-5">
      <h2 className="text-xl font-bold mb-8">🚀 JobBooster</h2>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          🏠 Dashboard
        </Link>

        <Link href="/analyze" className={linkClass("/analyze")}>
          🎯 Interview Trainer
        </Link>

        <Link href="/history" className={linkClass("/history")}>
          📊 History
        </Link>

        <Link href="/account" className={linkClass("/account")}>
          ⚙️ Account
        </Link>
      </nav>
    </div>
  );
    }
