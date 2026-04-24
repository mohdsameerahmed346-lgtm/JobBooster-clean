"use client";

import { motion } from "framer-motion";

export default function ChatBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-xl p-3 rounded-lg ${
        isUser
          ? "ml-auto bg-blue-600 text-white"
          : "bg-[#020617] border border-gray-800"
      }`}
    >
      {msg.content}
    </motion.div>
  );
               }
