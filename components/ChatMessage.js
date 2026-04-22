"use client";

export default function ChatMessage({ msg, loading }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <div
        className={`max-w-lg p-4 rounded-xl whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600"
            : "bg-gray-800"
        }`}
      >
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          msg.content
        )}
      </div>

    </div>
  );
          }
