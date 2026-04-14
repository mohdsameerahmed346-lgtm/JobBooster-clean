"use client";

import { useEffect, useState } from "react";
import Menu from "../../components/Menu";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/history");
      const d = await res.json();
      setData(d.data || []);
    };

    load();
  }, []);

  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-8">
        <h1 className="text-2xl font-semibold mb-6">History</h1>

        <div className="space-y-4">
          {data.map((item, i) => (
            <div
              key={i}
              className="bg-[#020617] border border-gray-800 p-5 rounded-lg"
            >
              <p className="text-green-400 font-bold">
                Score: {item.score}
              </p>
              <p className="text-gray-300 mt-2">{item.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    }
