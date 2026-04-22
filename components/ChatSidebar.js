"use client";

export default function ChatSidebar({ history, setMessages }) {
  return (
    <div className="w-64 bg-black border-r border-gray-800 p-4 hidden md:flex flex-col">

      <h2 className="font-bold mb-4">💬 Chats</h2>

      <div className="space-y-2 overflow-y-auto">

        {history.map((item, i) => (
          <div
            key={i}
            onClick={() =>
              setMessages([
                { role: "user", content: item.input },
                { role: "assistant", content: item.output },
              ])
            }
            className="p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800 text-sm"
          >
            {item.input.slice(0, 40)}...
          </div>
        ))}

      </div>
    </div>
  );
    }
