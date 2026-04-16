"use client";
export const dynamic = "force-dynamic";

export default function Pricing() {
  const upgrade = () => {
    localStorage.setItem("premium", "true");
    alert("Premium Activated 💎");
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">💎 Pricing</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* FREE PLAN */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl mb-2">Free</h2>
          <p className="text-2xl mb-4">₹0</p>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Limited AI usage</li>
            <li>Basic analysis</li>
          </ul>
        </div>

        {/* PREMIUM PLAN */}
        <div className="bg-blue-600 p-6 rounded-xl">
          <h2 className="text-xl mb-2">Premium</h2>
          <p className="text-2xl mb-4">₹199/month</p>

          <ul className="text-sm space-y-2 mb-4">
            <li>Unlimited AI</li>
            <li>Better responses</li>
            <li>Faster speed</li>
          </ul>

          <button
            onClick={upgrade}
            className="bg-black px-5 py-2 rounded"
          >
            Upgrade
          </button>
        </div>

      </div>
    </div>
  );
    }
