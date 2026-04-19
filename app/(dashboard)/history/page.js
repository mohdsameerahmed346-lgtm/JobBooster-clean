"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "history"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data());

      setData(results);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📊 History</h1>

      {data.length === 0 && (
        <p className="text-gray-400">No history yet</p>
      )}

      {data.map((item, i) => (
        <div key={i} className="bg-gray-900 p-4 rounded">

          <p className="text-sm text-blue-400 mb-1">
            {item.type.toUpperCase()}
          </p>

          <p className="text-sm text-gray-400">
            <b>Input:</b> {item.input}
          </p>

          <p className="mt-2">
            <b>Output:</b> {item.output}
          </p>

        </div>
      ))}

    </div>
  );
}
