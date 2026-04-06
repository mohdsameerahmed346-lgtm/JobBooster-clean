"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </main>
  );
}
