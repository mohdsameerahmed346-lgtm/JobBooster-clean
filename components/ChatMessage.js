"use client";

export default function ChatMessage({ msg, loading }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <div
        className={`max-w-xl p-4 rounded-2xl whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600"
            : "bg-gray-800"
        }`}
      >
        {loading ? (
          <span className="animate-pulse">Thinking...</span>
        ) : (
          <>
            {msg.content}
            {msg.role === "assistant" && (
              <span className="animate-pulse">▍</span>
            )}
          </>
        )}
      </div>

    </div>
  );
          }
