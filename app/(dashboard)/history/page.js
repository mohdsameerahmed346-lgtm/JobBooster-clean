"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">📊 History</h1>

      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 p-4 rounded border border-gray-800"
          >
            <p className="text-sm text-gray-400 mb-2">{item.type}</p>

            <pre className="text-gray-200 text-sm whitespace-pre-wrap">
              {JSON.stringify(item.content, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
              }
