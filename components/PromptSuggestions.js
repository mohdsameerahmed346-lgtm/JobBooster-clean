"use client";

export default function PromptSuggestions({ onSelect }) {
  const prompts = [
    "Analyze my resume for frontend developer",
    "Ask me React interview questions",
    "What skills do I need for AI engineer?",
    "Improve my resume summary",
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {prompts.map((p, i) => (
        <button
          key={i}
          onClick={() => onSelect(p)}
          className="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-2 rounded-lg"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
