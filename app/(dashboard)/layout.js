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
  LogOut,
} from "lucide-react";

import GlowCursor from "../../components/GlowCursor";

import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    setPremium(localStorage.getItem("premium") === "true");
  }, []);

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
    <div className="flex h-screen text-white bg-animated relative">

      <GlowCursor />

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black/70 backdrop-blur-lg border-b border-white/10 px-5 py-4 flex justify-between z-50">
        <span className="font-semibold">🚀 JobBooster</span>
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 glass p-6">
        <h1 className="text-xl font-bold mb-6">🚀 JobBooster</h1>

        {links.map((link, i) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={i}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-2
              ${active ? "bg-blue-600" : "hover:bg-white/10 text-gray-400"}`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="hidden md:flex justify-between items-center px-8 py-4 glass">

          <h2 className="capitalize">{pathname.replace("/", "")}</h2>

          <div className="flex items-center gap-4">

            <span className={`px-3 py-1 rounded-full text-sm
              ${premium ? "bg-blue-600" : "bg-gray-700"}`}>
              {premium ? "💎 Premium" : "🆓 Free"}
            </span>

            <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
              <span className="text-sm truncate max-w-[120px]">
                {user?.email}
              </span>
            </div>

            <button onClick={logout}>
              <LogOut />
            </button>

          </div>

        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-10 mt-20 md:mt-0">
          {children}
        </main>

      </div>
    </div>
  );
      }
