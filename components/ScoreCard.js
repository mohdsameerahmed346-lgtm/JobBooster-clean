"use client";

export default function ScoreCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">

      <p className="text-gray-400 text-sm mb-2">{title}</p>

      <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        {value}
      </div>

      <div className="w-full bg-gray-800 h-2 rounded mt-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded"
          style={{ width: `${value}%` }}
        />
      </div>

    </div>
  );
    }
