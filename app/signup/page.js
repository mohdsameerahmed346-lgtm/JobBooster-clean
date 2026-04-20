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
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl w-80 shadow-lg">

        <h1 className="text-xl font-bold mb-4">Signup</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 bg-black rounded"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-black rounded"
        />

        <button
          onClick={signup}
          className="bg-gradient-to-r from-blue-500 to-purple-500 w-full py-2 rounded-lg"
        >
          Create Account
        </button>

      </div>

    </div>
  );
            }
