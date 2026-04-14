"use client";

import { useEffect, useState } from "react";
import Menu from "../../components/Menu";

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 TEMP LOCAL HISTORY (WORKING VERSION)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("history")) || [];
      setData(saved.reverse()); // latest first
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-8">
        <h1 className="text-3xl font-semibold mb-6">📊 History</h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-400">No history yet</p>
        ) : (
          <div className="space-y-4">
            {data.map((item, i) => (
              <div
                key={i}
                className="bg-[#020617] border border-gray-800 p-5 rounded-xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-green-400">
                    {item.score || 0}/100
                  </h2>
                  <span className="text-sm text-gray-400">
                    {item.date
                      ? new Date(item.date).toLocaleString()
                      : "No date"}
                  </span>
                </div>

                <p className="text-gray-300 mb-3">
                  {item.feedback || "No feedback"}
                </p>

                {item.role && (
                  <p className="text-blue-400 text-sm">
                    Role: {item.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
      }
