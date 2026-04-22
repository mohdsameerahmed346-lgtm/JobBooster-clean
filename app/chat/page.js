"use client";

import { useState, useEffect } from "react";
import { useAI } from "../../lib/useAI";
import { saveHistory, getHistory } from "../../lib/history";
import ChatSidebar from "../../components/ChatSidebar";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";

export default function ChatPage() {
  const { result, loading, generate } = useAI();

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  // load history
  useEffect(() => {
    const load = async () => {
      const data = await getHistory();
      setHistory(data);
    };
    load();
  }, []);

  // send message
  const sendMessage = async (input) => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    const aiReply = await generate(input);

    const aiMsg = { role: "assistant", content: aiReply };

    setMessages((prev) => [...prev, aiMsg]);

    await saveHistory("chat", input, aiReply);

    // refresh sidebar
    const updated = await getHistory();
    setHistory(updated);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <ChatSidebar history={history} setMessages={setMessages} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

          {loading && (
            <ChatMessage
              msg={{ role: "assistant", content: "Thinking..." }}
              loading
            />
          )}

        </div>

        {/* INPUT */}
        <ChatInput onSend={sendMessage} />

      </div>
    </div>
  );
  }
