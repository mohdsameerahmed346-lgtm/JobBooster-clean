"use client";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">

        {/* spinner */}
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-400 text-sm">Loading JobBooster...</p>

      </div>
    </div>
  );
    }
