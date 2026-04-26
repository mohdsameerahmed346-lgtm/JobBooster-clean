"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

export default function Sidebar({
  chats,
  activeChat,
  onSelect,
  onNew,
  onDelete,
  onRename,
}) {
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  return (
    <div className="w-64 bg-[#020617] border-r border-gray-800 flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-800">
        <button onClick={onNew} className="btn-primary w-full">
          + New Chat
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {chats.map((chat) => {
          const isActive = activeChat?.id === chat.id;

          return (
            <div
              key={chat.id}
              onClick={() => onSelect(chat)}
              className={`group p-3 rounded-xl flex justify-between items-center cursor-pointer ${
                isActive
                  ? "bg-blue-500/20 border border-blue-500/40"
                  : "hover:bg-white/5"
              }`}
            >

              {editingId === chat.id ? (
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => {
                    onRename(chat.id, newTitle);
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(chat.id, newTitle);
                      setEditingId(null);
                    }
                  }}
                  autoFocus
                  className="bg-transparent outline-none text-sm w-full"
                />
              ) : (
                <span className="text-sm truncate">
                  {chat.title || "New Chat"}
                </span>
              )}

              <div className="hidden group-hover:flex gap-2">
                <Pencil
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(chat.id);
                    setNewTitle(chat.title);
                  }}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <Trash2
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                  className="text-gray-400 hover:text-red-400 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  }
