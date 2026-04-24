"use client";

import { motion } from "framer-motion";

export default function SkillTags({ items, type }) {
  return (
    <div className="flex flex-wrap gap-2">

      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`px-3 py-1 text-sm rounded-full border ${
            type === "good"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {item}
        </motion.span>
      ))}

    </div>
  );
                   }
