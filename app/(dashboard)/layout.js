"use client";

import Menu from "../../components/Menu";

export default function Layout({ children }) {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      
      <Menu />

      {/* CONTENT */}
      <main className="pt-16 md:pt-0 md:ml-64 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
