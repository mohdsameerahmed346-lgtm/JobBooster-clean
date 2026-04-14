"use client";

import Menu from "../../components/Menu";

export default function PricingPage() {
  const upgrade = () => {
    localStorage.setItem("premium", "true");
    alert("Premium Activated 💎");
  };

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Menu />

      <div className="ml-0 md:ml-64 p-8 w-full">
        <h1 className="text-3xl mb-8">💎 Pricing</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FREE */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl mb-3">Free Plan</h2>
            <p className="mb-4">₹0/month</p>
            <ul className="text-gray-400 space-y-2">
              <li>✔ Resume Analyzer</li>
              <li>✔ Interview Questions</li>
              <li>❌ Limited AI quality</li>
            </ul>
          </div>

          {/* PREMIUM */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl">
            <h2 className="text-xl mb-3">Premium</h2>
            <p className="mb-4">₹199/month</p>

            <ul className="space-y-2">
              <li>✔ OpenAI AI (better answers)</li>
              <li>✔ Unlimited usage</li>
              <li>✔ Skill gap analysis</li>
            </ul>

            <button
              onClick={upgrade}
              className="mt-4 bg-black px-5 py-2 rounded"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
    }
