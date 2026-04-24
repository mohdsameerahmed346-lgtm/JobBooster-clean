"use client";

export default function Sidebar({
  chats,
  activeChat,
  onSelect,
  onNew,
}) {
  return (
    <div className="w-64 bg-[#020617] border-r border-gray-800 h-screen p-4 flex flex-col">

      <h1 className="text-xl font-bold mb-6">🚀 JobBooster</h1>

      <button
        onClick={onNew}
        className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl mb-4 hover:opacity-90"
      >
        + New Chat
      </button>

      <div className="space-y-2 text-sm overflow-y-auto">
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
