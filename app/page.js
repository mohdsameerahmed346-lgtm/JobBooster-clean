export default function Home() {
  return (
    <div className="min-h-screen bg-white text-center p-6">

      <h1 className="text-4xl font-bold mb-4">
        🚀 JobBoost AI
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Improve your resume, skills & interviews using AI
      </p>

      <a
        href="/dashboard"
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Start Free →
      </a>

      <div className="mt-10 text-gray-500">
        <p>🔥 Built for students & freshers</p>
      </div>

      <div className="mt-12 space-y-6">

        <div>
          <h2 className="text-xl font-semibold">📄 Resume Scanner</h2>
          <p>Get ATS score instantly</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">📊 Skill Gap</h2>
          <p>Find missing skills for your role</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">🎯 Interview AI</h2>
          <p>Practice real questions</p>
        </div>

      </div>

    </div>
  );
    }
