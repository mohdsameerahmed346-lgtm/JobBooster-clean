"use client";

export default function ScoreCard({ title, value }) {
  return (
    <div className="glass p-4 rounded-xl text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
