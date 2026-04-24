"use client";

export default function Sidebar({
  chats,
  activeChat,
  onSelect,
  onNew,
}) {
  return (
    <div className="w-64 bg-black border-r border-gray-800 h-screen p-4">

      <button
        onClick={onNew}
        className="w-full bg-blue-600 p-2 rounded mb-4"
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat)}
            className={`p-2 rounded cursor-pointer ${
              activeChat?.id === chat.id
                ? "bg-gray-800"
                : "hover:bg-gray-900"
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>

    </div>
  );
    }
