"use client";

import { useEffect, useState } from "react";
import {
  getChats,
  createChat,
  deleteChat,
  renameChat,
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
        className="btn-primary mb-4"
      >
        + New Chat
      </button>

      <div className="space-y-2 overflow-y-auto">

        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-3 bg-gray-900 rounded text-sm flex justify-between items-center"
          >
            <span
              onClick={() => setChatId(chat.id)}
              className="cursor-pointer"
            >
              {chat.title}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const name = prompt("Rename chat:");
                  if (name) renameChat(chat.id, name).then(load);
                }}
              >
                ✏️
              </button>

              <button
                onClick={() => deleteChat(chat.id).then(load)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
    }
