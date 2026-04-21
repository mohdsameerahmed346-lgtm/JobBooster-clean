"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

import Particles from "../../components/Particles";
import GlowCursor from "../../components/GlowCursor";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
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
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND */}
      <Particles />
      <GlowCursor />

      {/* CONTENT */}
      <div className="flex h-screen relative z-10">

        {/* SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 p-5">

          <h1 className="text-xl font-bold mb-6 text-blue-400">
            🚀 JobBooster
          </h1>

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
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
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
            className="mt-auto flex items-center gap-2 text-red-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* NAVBAR */}
          <div className="flex justify-between items-center px-6 py-4 bg-black/30 backdrop-blur-xl border-b border-white/10">

            <h2 className="capitalize">
              {pathname.replace("/", "")}
            </h2>

            <div className="flex items-center gap-3">

              <span className="bg-blue-600/20 px-3 py-1 rounded-full text-sm">
                🆓 Free
              </span>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <User size={16} />
                <span className="text-sm">
                  {user?.email}
                </span>
              </div>

            </div>
          </div>

          {/* PAGE */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
    }
