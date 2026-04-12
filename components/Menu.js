"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // 🔒 CLOSE MENU ON ROUTE CHANGE (optional smooth UX)
  useEffect(() => {
    setOpen(false);
  }, []);

  // 🔓 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/"); // redirect to login/home
  };

  return (
    <div style={styles.wrapper}>
      {/* ☰ BUTTON */}
      <div style={styles.icon} onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* MENU PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            style={styles.menu}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/dashboard" style={styles.link}>
              🏠 Dashboard
            </Link>

            <Link href="/analyze" style={styles.link}>
              📄 Analyze Resume
            </Link>

            <Link href="/history" style={styles.link}>
              📊 History
            </Link>

            <Link href="/account" style={styles.link}>
              ⚙️ Account
            </Link>

            <hr style={styles.divider} />

            <button onClick={handleLogout} style={styles.logout}>
              🚪 Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  wrapper: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1000,
  },
  icon: {
    fontSize: "26px",
    cursor: "pointer",
    background: "#1e293b",
    padding: "8px 12px",
    borderRadius: "8px",
  },
  menu: {
    marginTop: "10px",
    background: "#020617",
    padding: "15px",
    borderRadius: "10px",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "8px",
    borderRadius: "6px",
    background: "#1e293b",
  },
  divider: {
    borderColor: "#334155",
  },
  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
