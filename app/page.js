"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ padding: 20 }}>
      <h1>🚀 JobBoost 2.0</h1>
      <button onClick={() => router.push("/login")}>
        Go to Login
      </button>
    </main>
  );
}
