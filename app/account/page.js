"use client";

import Menu from "../../components/Menu";

export default function AccountPage() {
  const upgrade = () => {
    localStorage.setItem("premium", "true");
    alert("Premium Activated 💎");
  };

  const clearHistory = () => {
    localStorage.removeItem("history");
    alert("History deleted");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Menu />

      <div className="md:ml-64 p-6 md:p-8">
        <h1 className="text-3xl mb-6">⚙️ Account</h1>

        <div className="space-y-4">

          <button onClick={upgrade} className="bg-blue-600 px-5 py-2 rounded">
            Upgrade to Premium
          </button>

          <button onClick={clearHistory} className="bg-red-600 px-5 py-2 rounded">
            Delete History
          </button>

          <button className="bg-gray-700 px-5 py-2 rounded">
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
