"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/skill-gap");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button onClick={login} className="btn-primary">
        Login with Google
      </button>
    </div>
  );
                       }
