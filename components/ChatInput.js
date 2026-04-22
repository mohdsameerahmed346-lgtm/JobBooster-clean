"use client";

import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    let finalInput = input;

    // 🔥 SLASH COMMANDS
    if (input.startsWith("/analyze")) {
      finalInput = `Analyze this resume:\n${input.replace("/analyze", "")}`;
    }

    if (input.startsWith("/interview")) {
      finalInput = `Conduct a mock interview:\n${input.replace("/interview", "")}`;
    }

    if (input.startsWith("/skills")) {
      finalInput = `Identify skill gaps:\n${input.replace("/skills", "")}`;
    }

    onSend(finalInput);
    setInput("");
  };

  return (
    <div className="p-4 border-t border-gray-800 flex gap-3">

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type /analyze, /interview, /skills..."
        className="flex-1 p-3 bg-black border border-gray-700 rounded-lg outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 px-5 rounded-lg"
      >
        Send
      </button>

    </div>
  );
    }
