"use client";

import Menu from "../../components/Menu";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Menu />
      <main className="flex-1 md:ml-64 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
