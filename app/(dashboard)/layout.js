"use client";

import Particles from "../../components/Particles";
import GlowCursor from "../../components/GlowCursor";
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

    {/* CONTENT LAYER */}
    <div className="flex h-screen relative z-10">

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 p-5">
        {/* sidebar content */}
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          Navbar
        </div>

        {/* PAGE */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  </div>
);
