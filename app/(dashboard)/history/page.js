"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "history"),
        where("userId", "==", auth.currentUser?.uid)
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => doc.data());

      setData(items);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📊 History</h1>

      {data.map((item, i) => (
        <div key={i} className="bg-gray-900 p-4 rounded">
          <p className="text-sm text-gray-400">{item.type}</p>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
            }
