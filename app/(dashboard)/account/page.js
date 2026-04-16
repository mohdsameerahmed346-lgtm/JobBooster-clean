"use client";

export const dynamic = "force-dynamic";
export default function Account() {
  const upgrade = () => {
    localStorage.setItem("premium", "true");
    alert("Premium Activated 💎");
  };

  const logout = () => {
    alert("Logged out");
  };

  const clear = () => {
    localStorage.removeItem("history");
    alert("History cleared");
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">⚙️ Account</h1>

      <div className="space-y-4">
        <button onClick={upgrade} className="bg-blue-600 px-5 py-2 rounded">
          Upgrade
        </button>

        <button onClick={clear} className="bg-red-600 px-5 py-2 rounded">
          Delete History
        </button>

        <button onClick={logout} className="bg-gray-700 px-5 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
    }
