"use client";

export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">

      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-gray-800 rounded-xl" />
        <div className="h-24 bg-gray-800 rounded-xl" />
      </div>

      <div className="h-20 bg-gray-800 rounded-xl" />
      <div className="h-32 bg-gray-800 rounded-xl" />

    </div>
  );
    }
