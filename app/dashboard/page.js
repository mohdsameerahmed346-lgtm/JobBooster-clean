"use client";

import Menu from "@/components/Menu";

export default function Dashboard() {
  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-6 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-5 rounded-xl">
            <h2 className="text-lg">Plan</h2>
            <p className="text-2xl font-bold">Free</p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <h2 className="text-lg">Usage</h2>
            <p className="text-2xl font-bold">0/3</p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <h2 className="text-lg">Status</h2>
            <p className="text-2xl font-bold">Active</p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">🎤 Interview Prep</h2>
            <p>Practice AI-generated interview questions.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">📄 Resume Analysis</h2>
            <p>Improve resume with AI feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
          }
