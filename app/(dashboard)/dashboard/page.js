"use client";

import Link from "next/link";
import TiltCard from "../../../components/TiltCard";

export default function Dashboard() {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-300 mt-2">
          Boost your career with AI-powered tools
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <TiltCard>
          <Link href="/analyze">
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">
                📄 Resume Analyzer
              </h2>
              <p className="text-gray-400 text-sm">
                Improve your resume instantly with AI
              </p>
            </div>
          </Link>
        </TiltCard>

        <TiltCard>
          <Link href="/interview">
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">
                🎤 Interview Practice
              </h2>
              <p className="text-gray-400 text-sm">
                Practice real interview questions
              </p>
            </div>
          </Link>
        </TiltCard>

        <TiltCard>
          <Link href="/skill-gap">
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">
                📉 Skill Gap
              </h2>
              <p className="text-gray-400 text-sm">
                Find missing skills for your role
              </p>
            </div>
          </Link>
        </TiltCard>

      </div>

    </div>
  );
    }
