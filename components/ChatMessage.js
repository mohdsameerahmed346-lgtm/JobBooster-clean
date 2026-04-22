"use client";

import MarkdownRenderer from "./MarkdownRenderer";

export default function ChatMessage({ msg, loading }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <div
        className={`max-w-xl p-4 rounded-2xl ${
          isUser
            ? "bg-blue-600"
            : "bg-gray-800"
        }`}
      >
        {loading ? (
          <span className="animate-pulse">Thinking...</span>
        ) : (
          <>
            <MarkdownRenderer content={msg.content} />

            {/* typing cursor */}
            {msg.role === "assistant" && (
              <span className="animate-pulse">▍</span>
            )}
          </>
        )}
      </div>

    </div>
  );
  }
