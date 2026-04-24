"use client";

import { motion } from "framer-motion";

export default function ScoreCircle({ value, label }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">

      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#1f2937"
          strokeWidth="10"
          fill="transparent"
        />

        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#grad)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="text-center -mt-20">
        <p className="text-xl font-bold">{value}%</p>
      </div>

      <p className="text-sm text-gray-400 mt-2">{label}</p>

    </div>
  );
    }
