"use client";

export default function TypingBubble() {
  return (
    <div className="bg-[#020617] border border-gray-800 px-4 py-2 rounded-lg w-fit">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
      </div>
    </div>
  );
    }
