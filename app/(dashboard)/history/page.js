export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("history")) || [];
    setData(stored);
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">📊 History</h1>

      {data.map((item, i) => (
        <div key={i} className="bg-gray-900 p-4 rounded mb-3">
          {item}
        </div>
      ))}
    </div>
  );
    }
