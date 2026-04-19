"use client";

import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created ✅");
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-80 space-y-4">
        <h1 className="text-xl font-bold">Create Account</h1>

        <input
          placeholder="Email"
          className="w-full p-3 bg-black border border-gray-700 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-black border border-gray-700 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={signup} className="bg-blue-600 w-full py-2 rounded">
          Sign Up
        </button>
      </div>
    </div>
  );
  }
