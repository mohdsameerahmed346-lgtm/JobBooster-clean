"use client";

import { useEffect, useState } from "react";
import {
  getChats,
  createChat,
} from "../lib/chat";

export default function ChatSidebar({ setChatId }) {
  const [chats, setChats] = useState([]);

  const load = async () => {
    const data = await getChats();
    setChats(data);
  };

  useEffect(() => {
    load();
  }, []);

  const newChat = async () => {
    const id = await createChat();
    setChatId(id);
    load();
  };

  return (
    <div className="w-64 bg-black border-r border-gray-800 p-4 flex flex-col">

      <button
        onClick={newChat}
        className="bg-blue-600 mb-4 p-2 rounded"
      >
        + New Chat
      </button>

      <div className="space-y-2 overflow-y-auto">

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setChatId(chat.id)}
            className="p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800 text-sm"
          >
            {chat.title}
          </div>
        ))}

      </div>
    </div>
  );
          }
