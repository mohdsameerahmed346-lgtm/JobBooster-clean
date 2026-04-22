"use client";

import { useState, useEffect } from "react";
import { useAI } from "../../lib/useAI";
import { getChat, saveMessage } from "../../lib/chat";
import ChatSidebar from "../../components/ChatSidebar";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";

export default function ChatPage() {
  const { generateStream, loading } = useAI();

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  // 🔄 Load chat
  useEffect(() => {
    if (!chatId) return;

    const load = async () => {
      const chat = await getChat(chatId);
      setMessages(chat?.messages || []);
    };

    load();
  }, [chatId]);

  // 📤 SEND MESSAGE (STREAMING)
  const sendMessage = async (input) => {
    if (!input || !chatId) return;

    const userMsg = { role: "user", content: input };
    const aiMsg = { role: "assistant", content: "" };

    const tempMessages = [...messages, userMsg, aiMsg];
    setMessages(tempMessages);

    let currentText = "";

    const final = await generateStream(input, (chunk) => {
      currentText += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: currentText,
        };
        return updated;
      });
    });

    const finalMessages = [
      ...messages,
      userMsg,
      { role: "assistant", content: final },
    ];

    setMessages(finalMessages);
    await saveMessage(chatId, finalMessages);
  };

  // 🔁 REGENERATE (FIXED)
  const regenerate = async (index) => {
    const prevMessages = messages.slice(0, index);

    const lastUser = [...prevMessages]
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUser) return;

    let currentText = "";

    const baseMessages = messages.slice(0, index);

    // Insert empty AI message
    setMessages([...baseMessages, { role: "assistant", content: "" }]);

    const final = await generateStream(lastUser.content, (chunk) => {
      currentText += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: currentText,
        };
        return updated;
      });
    });

    const finalMessages = [
      ...baseMessages,
      { role: "assistant", content: final },
    ];

    setMessages(finalMessages);
    await saveMessage(chatId, finalMessages);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <ChatSidebar setChatId={setChatId} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              msg={msg}
              onCopy={(text) => navigator.clipboard.writeText(text)}
              onRegenerate={() => regenerate(i)}
              onLike={() => console.log("liked")}
              onDislike={() => console.log("disliked")}
            />
          ))}

          {loading && (
            <ChatMessage
              msg={{ role: "assistant", content: "" }}
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
