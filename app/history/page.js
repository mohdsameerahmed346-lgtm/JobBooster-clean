"use client";

import { useEffect, useState } from "react";
import { getHistory } from "../../lib/history";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function History() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const res = await getHistory(u.uid);
        setData(res);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">History</h1>

      {data.map((item) => (
        <div key={item.id} className="glass p-4 rounded">
          <p className="font-semibold">{item.data.name}</p>
          <p>Score: {item.data.score}</p>
        </div>
      ))}
    </div>
  );
          }
