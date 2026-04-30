"use client";

import { useState } from "react";

export default function InlineEditable({
  value,
  onChange,
  placeholder = "Click to edit...",
  className = "",
  multiline = false,
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value || "");

  const save = () => {
    setEditing(false);
    onChange(temp);
  };

  if (editing) {
    return multiline ? (
      <textarea
        autoFocus
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={save}
        className={`w-full border p-1 ${className}`}
      />
    ) : (
      <input
        autoFocus
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={save}
        className={`w-full border p-1 ${className}`}
      />
    );
  }

  return (
    <div
      onClick={() => {
        setTemp(value || "");
        setEditing(true);
      }}
      className={`cursor-text ${className}`}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  );
                                 }
