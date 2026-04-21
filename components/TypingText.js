"use client";

import { useEffect, useState } from "react";

export default function TypingText({ text, speed = 15 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) return;

    let i = 0;
    setDisplayed("");

    const type = () => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;

      if (i < text.length) {
        setTimeout(type, speed);
      }
    };

    type();
  }, [text, speed]);

  return (
    <div className="whitespace-pre-line leading-relaxed text-gray-200">
      {displayed}
      <span className="animate-pulse">|</span>
    </div>
  );
            }
