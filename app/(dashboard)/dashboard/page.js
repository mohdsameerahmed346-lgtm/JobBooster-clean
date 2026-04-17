"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back 👋</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <Link href="/analyze">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800 cursor-pointer"
          >
            <h2 className="text-lg mb-2">📄 Resume Analyzer</h2>
            <p className="text-gray-400 text-sm">
              Improve your resume instantly
            </p>
          </motion.div>
        </Link>

        <Link href="/interview">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800 cursor-pointer"
          >
            <h2 className="text-lg mb-2">🎤 Interview Practice</h2>
            <p className="text-gray-400 text-sm">
              Practice with AI questions
            </p>
          </motion.div>
        </Link>

        <Link href="/skill-gap">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800 cursor-pointer"
          >
            <h2 className="text-lg mb-2">📉 Skill Gap</h2>
            <p className="text-gray-400 text-sm">
              Find missing skills
            </p>
          </motion.div>
        </Link>

      </div>
    </div>
  );
    }
