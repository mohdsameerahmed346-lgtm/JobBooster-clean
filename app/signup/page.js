"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());

      // ✅ Save user in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        plan: "free",
        createdAt: new Date(),
      });

      router.push("/dashboard");
    } catch (err) {
      alert(err.code);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="bg-gray-900 p-6 rounded-xl w-80 space-y-4">
        <h1 className="text-xl font-bold">Signup</h1>

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
          onClick={signup}
          className="bg-blue-600 w-full py-2 rounded"
        >
          Create Account
        </button>
      </div>

    </div>
  );
            }
