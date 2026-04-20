import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-4xl font-bold mb-4 text-center">
        🚀 AI-Powered Career Growth
      </h1>

      <p className="text-gray-400 text-center max-w-xl mb-6">
        Land your dream job faster with smart resume analysis, interview coaching, and skill gap insights.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-lg hover:scale-105 transition"
        >
          Start for Free
        </Link>

        <Link
          href="/signup"
          className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Create Account
        </Link>
      </div>

    </div>
  );
    }
