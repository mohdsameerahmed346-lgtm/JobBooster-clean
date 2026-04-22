"use client";

import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 border-t border-gray-800 flex gap-3">

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
        className="flex-1 p-3 bg-black border border-gray-700 rounded-lg"
      />

      <button
        onClick={handleSend}
        className="btn-primary px-5 rounded-lg"
      >
        Send
      </button>

    </div>
  );
          }
