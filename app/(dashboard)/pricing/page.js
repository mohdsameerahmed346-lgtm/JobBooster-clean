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

        <div className="bg-gray-900 p-6 rounded">
          <h2>Free</h2>
          <p>₹0</p>
        </div>

        <div className="bg-blue-600 p-6 rounded">
          <h2>Premium</h2>
          <p>₹199/month</p>

          <button onClick={upgrade} className="mt-4 bg-black px-5 py-2 rounded">
            Upgrade
          </button>
        </div>

      </div>
    </div>
  );
    }
