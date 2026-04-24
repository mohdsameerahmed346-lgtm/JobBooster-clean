"use client";

import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { createChat, getChats, saveMessages } from "../../lib/chat";

import ChatBubble from "../../components/ChatBubble";
import TypingBubble from "../../components/TypingBubble";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // AUTH + LOAD
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      setUser(u);

      const data = await getChats(u.uid);
      setChats(data);

      if (data.length) setActive(data[0]);
    });

    return () => unsub();
  }, []);

  // NEW CHAT
  const newChat = async () => {
    const id = await createChat(user.uid);

    const chat = {
      id,
      title: "New Chat",
      messages: [],
    };

    setChats([chat, ...chats]);
    setActive(chat);
  };

  // SEND MESSAGE
  const send = async () => {
    if (!input.trim() || !active) return;

    const newMessages = [
      ...(active.messages || []),
      { role: "user", content: input },
    ];

    setActive({ ...active, messages: newMessages });
    setLoading(true);

    setInput("");

    // 🔹 CALL AI
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    const finalMessages = [
      ...newMessages,
      { role: "assistant", content: data.reply },
    ];

    setActive({ ...active, messages: finalMessages });
    setLoading(false);

    await saveMessages(user.uid, active.id, finalMessages);
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 border-r border-gray-800 p-4 space-y-2">

        <button onClick={newChat} className="btn-primary w-full">
          + New Chat
        </button>

        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => setActive(c)}
            className="p-2 hover:bg-gray-800 rounded cursor-pointer"
          >
            {c.title}
          </div>
        ))}

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {active?.messages?.map((m, i) => (
            <ChatBubble key={i} msg={m} />
          ))}

          {loading && <TypingBubble />}

        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-gray-800 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 input"
            placeholder="Ask anything..."
          />

          <button onClick={send} className="btn-primary">
            Send
          </button>
        </div>

      </div>
    </div>
  );
  }
