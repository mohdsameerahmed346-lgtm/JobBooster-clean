"use client";

import Menu from "../../components/Menu";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white">
      
      {/* SIDEBAR */}
      <Menu />

      {/* MAIN */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
    }
