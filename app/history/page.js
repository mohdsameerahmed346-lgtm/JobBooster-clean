"use client";

import { useEffect, useState } from "react";
import Menu from "../../components/Menu";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();

        const snap = await getDocs(
          collection(db, "users", "demo-user", "history")
        );

        setData(snap.docs.map((doc) => doc.data()));
      } catch (err) {
        console.error(err);
        alert("Failed to load history");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Menu />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-6">
          📊 Interview History
        </h1>

        {data.length === 0 ? (
          <p className="text-slate-400">No history yet</p>
        ) : (
          data.map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 p-4 rounded mb-3"
            >
              <p className="text-sm text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <p className="mt-2">{item.feedback}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
    }
