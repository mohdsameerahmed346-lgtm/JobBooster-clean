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
  User,
  LogOut,
} from "lucide-react";

import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
    });

    return () => unsub();
  }, [router]);

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

        <button
          onClick={logout}
          className="mt-auto bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-black border-b border-gray-800 px-6 py-4">

          <h2 className="text-lg font-semibold capitalize">
            {pathname.replace("/", "")}
          </h2>

          <div className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded">
            <User size={16} />
            <span className="text-sm">
              {user?.email}
            </span>
          </div>

        </div>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
    }
