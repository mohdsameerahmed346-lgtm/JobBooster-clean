"use client";

import Link from "next/link";
import TiltCard from "../../../components/TiltCard";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="glass p-8 rounded-2xl">
        <h1>Welcome back 👋</h1>
        <p className="mt-2">
          Your AI-powered career assistant is ready.
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        <TiltCard>
          <Link href="/analyze">
            <div className="card glass">
              <h2>📄 Resume Analyzer</h2>
              <p className="mt-2">
                Get instant AI feedback to improve your resume.
              </p>
            </div>
          </Link>
        </TiltCard>

        <TiltCard>
          <Link href="/interview">
            <div className="card glass">
              <h2>🎤 Interview Practice</h2>
              <p className="mt-2">
                Practice real questions with AI coaching.
              </p>
            </div>
          </Link>
        </TiltCard>

        <TiltCard>
          <Link href="/skill-gap">
            <div className="card glass">
              <h2>📉 Skill Gap</h2>
              <p className="mt-2">
                Discover what skills you need next.
              </p>
            </div>
          </Link>
        </TiltCard>

      </div>
    </div>
  );
    }
