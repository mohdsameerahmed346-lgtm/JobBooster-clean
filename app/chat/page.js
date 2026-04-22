"use client";

import { useState, useEffect } from "react";
import { useAI } from "../../lib/useAI";
import { getChat, saveMessage } from "../../lib/chat";
import ChatSidebar from "../../components/ChatSidebar";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";

export default function ChatPage() {
  const { generate, loading } = useAI();

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  // load selected chat
  useEffect(() => {
    if (!chatId) return;

    const load = async () => {
      const chat = await getChat(chatId);
      setMessages(chat?.messages || []);
    };

    load();
  }, [chatId]);

  const sendMessage = async (input) => {
    if (!input || !chatId) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);

    const reply = await generate(input);

    const updated = [
      ...newMessages,
      { role: "assistant", content: reply },
    ];

    setMessages(updated);

    await saveMessage(chatId, updated);
  };

  return (
    <div className="flex h-screen text-white bg-slate-950">

      <ChatSidebar setChatId={setChatId} />

      <div className="flex-1 flex flex-col">

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <ChatMessage key={i} msg={m} />
          ))}

          {loading && <ChatMessage msg={{ role: "assistant", content: "..." }} />}
        </div>

        <ChatInput onSend={sendMessage} />

      </div>
    </div>
  );
  }
