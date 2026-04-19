"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Mic,
  BarChart,
  History,
  CreditCard,
  Settings,
  Target,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [premium, setPremium] = useState(false);

  // ✅ AUTH PROTECTION
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsub();
  }, [router]);

  // ✅ PREMIUM STATUS (local for now)
  useEffect(() => {
    setPremium(localStorage.getItem("premium") === "true");
  }, []);

  // ✅ LOGOUT FUNCTION
  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analyze", href: "/analyze", icon: FileText },
    { name: "Interview", href: "/interview", icon: Mic },
    { name: "Skill Gap", href: "/skill-gap", icon: BarChart },
    { name: "Job Match", href: "/job-match", icon: Target },
    { name: "History", href: "/history", icon: History },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "Account", href: "/account", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-black border-r border-gray-800 p-5">
        <h1 className="text-xl font-bold mb-6">🚀 JobBooster</h1>

        <nav className="flex flex-col gap-2">
          {links.map((link, i) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={i}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black border-b border-gray-800 p-4 flex justify-between items-center z-50">
        <span className="text-sm font-semibold">Menu</span>
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-gray-800 p-6 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold">Menu</h1>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {links.map((link, i) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={i}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <div className="hidden md:flex justify-between items-center bg-black border-b border-gray-800 px-6 py-4">

          <h2 className="text-lg font-semibold capitalize">
            {pathname.replace("/", "") || "dashboard"}
          </h2>

          <div className="flex items-center gap-4">

            <span className={`px-3 py-1 text-sm rounded-full
              ${premium ? "bg-blue-600" : "bg-gray-700"}`}>
              {premium ? "💎 Premium" : "🆓 Free"}
            </span>

            <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
              <User size={16} />
              <span className="text-sm">User</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <LogOut size={16} />
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 mt-16 md:mt-0">
          {children}
        </main>

      </div>
    </div>
  );
    }
