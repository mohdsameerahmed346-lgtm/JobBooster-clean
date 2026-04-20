"use client";

import { useEffect, useState } from "react";
import { getHistory } from "../../../lib/history";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getHistory();
      setData(res);
    };

    load();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold">📊 Your History</h1>

      {data.length === 0 && (
        <p className="text-gray-400">No history yet</p>
      )}

      {data.map((item) => (
        <div
          key={item.id}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700"
        >
          <p className="text-sm text-gray-400 mb-2">
            {item.type.toUpperCase()}
          </p>

          <p className="text-sm mb-2">
            <strong>Input:</strong> {item.input}
          </p>

          <p className="text-sm text-gray-300">
            <strong>Result:</strong> {item.result}
          </p>
        </div>
      ))}

    </div>
  );
      }
