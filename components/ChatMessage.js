"use client";

import MarkdownRenderer from "./MarkdownRenderer";

export default function ChatMessage({
  msg,
  loading,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
}) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>

      {/* AVATAR (AI LEFT) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm">
          🤖
        </div>
      )}

      {/* MESSAGE */}
      <div className="max-w-xl">

        <div
          className={`p-4 rounded-2xl ${
            isUser ? "bg-blue-600" : "bg-gray-800"
          }`}
        >
          {loading ? (
            <TypingBubble />
          ) : (
            <>
              <MarkdownRenderer content={msg.content} />
            </>
          )}
        </div>

        {/* ACTIONS */}
        {!isUser && !loading && (
          <div className="flex gap-3 mt-2 text-xs text-gray-400">

            <button onClick={() => onCopy(msg.content)}>
              📋 Copy
            </button>

            <button onClick={onRegenerate}>
              🔁 Regenerate
            </button>

            <button onClick={onLike}>
              👍
            </button>

            <button onClick={onDislike}>
              👎
            </button>

          </div>
        )}

      </div>

      {/* AVATAR (USER RIGHT) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm">
          🧑
        </div>
      )}

    </div>
  );
}

/* ===== TYPING BUBBLE ===== */
function TypingBubble() {
  return (
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
    </div>
  );
    }
