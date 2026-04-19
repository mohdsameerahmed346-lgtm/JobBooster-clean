"use client";

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

      {/* FREE PLAN */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-2">🆓 Free</h2>

        <p className="text-3xl font-bold mb-4">₹0</p>

        <ul className="text-gray-400 text-sm space-y-2 mb-6">
          <li>✔ Resume Analyze (3 times only)</li>
          <li>❌ Interview Practice</li>
          <li>❌ Skill Gap Analysis</li>
          <li>❌ Job Match</li>
        </ul>

        <button
          disabled
          className="bg-gray-700 px-5 py-2 rounded w-full cursor-not-allowed"
        >
          Current Plan
        </button>
      </div>

      {/* PREMIUM PLAN */}
      <div className="bg-blue-600 p-6 rounded-xl shadow-lg relative">

        <span className="absolute top-3 right-3 text-xs bg-black px-2 py-1 rounded">
          🔥 Popular
        </span>

        <h2 className="text-xl font-semibold mb-2">💎 Premium</h2>

        <p className="text-3xl font-bold mb-4">₹149/month</p>

        <ul className="text-sm space-y-2 mb-6">
          <li>✔ Unlimited Resume Analysis</li>
          <li>✔ Interview AI Questions</li>
          <li>✔ Skill Gap Insights</li>
          <li>✔ Job Match Score</li>
          <li>✔ Faster AI Responses</li>
        </ul>

        <button
          onClick={() => {
            localStorage.setItem("premium", "true");
            alert("Premium Activated 💎 (Demo Mode)");
          }}
          className="bg-black px-5 py-2 rounded w-full hover:scale-105 transition"
        >
          Upgrade Now
        </button>

      </div>

    </div>
  );
    }
