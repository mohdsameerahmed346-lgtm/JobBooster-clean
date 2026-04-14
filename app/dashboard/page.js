"use client";

import Menu from "../../components/Menu";

export default function Dashboard() {
  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#020617] border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400">Plan</p>
            <h2 className="text-2xl font-bold">Free</h2>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400">Usage</p>
            <h2 className="text-2xl font-bold">0 / 3</h2>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400">Status</p>
            <h2 className="text-2xl font-bold text-green-400">Active</h2>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-[#020617] border border-gray-800 p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">
            🚀 AI Interview Trainer
          </h2>
          <p className="text-gray-400 mb-6">
            Practice real interview questions based on your job role and get AI feedback.
          </p>

          <a
            href="/analyze"
            className="bg-blue-600 px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start Practicing →
          </a>
        </div>
      </div>
    </div>
  );
          }
