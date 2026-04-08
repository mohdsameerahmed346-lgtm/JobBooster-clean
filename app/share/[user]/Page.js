export default function SharePage({ params }) {
  const { user } = params;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold">
        🚀 {user}'s Resume Score
      </h1>

      <p className="text-5xl font-bold mt-4">85%</p>

      <p className="mt-4 text-gray-600">
        Built using JobBoost AI
      </p>

      <a
        href="/"
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
      >
        Try for Free 🔥
      </a>
    </div>
  );
    }
