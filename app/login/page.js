"use client";

import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      router.push("/dashboard");
    } catch (err) {
      alert(err.code);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="bg-gray-900 p-6 rounded-xl w-80 space-y-4">
        <h1 className="text-xl font-bold">Login</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-black rounded"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-black rounded"
        />

        <button
          onClick={login}
          className="bg-blue-600 w-full py-2 rounded"
        >
          Login
        </button>
      </div>

    </div>
  );
    }
