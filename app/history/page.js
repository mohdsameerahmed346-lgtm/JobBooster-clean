"use client";

import { useEffect, useState } from "react";
import Menu from "../../components/Menu";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/history");
      const d = await res.json();
      setData(d.data || []);
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Menu />

      <div className="ml-0 md:ml-64 w-full p-6 bg-gray-900 text-white min-h-screen">
        <h1 className="text-2xl mb-4">📊 History</h1>

        {data.map((item, i) => (
          <div key={i} className="bg-gray-800 p-4 mb-3 rounded">
            <p>{item.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
                  }
