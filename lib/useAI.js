"use client";

import { useState } from "react";

export function useAI() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (prompt) => {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value);

      // ⚠️ simple stream parsing
      const lines = chunk.split("\n");

      for (let line of lines) {
        if (line.includes("content")) {
          try {
            const json = JSON.parse(line.replace("data: ", ""));
            const text = json.choices?.[0]?.delta?.content;
            if (text) {
              setResult((prev) => prev + text);
            }
          } catch {}
        }
      }
    }

    setLoading(false);
  };

  return { result, loading, generate };
  }
