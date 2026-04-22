"use client";

import { useState } from "react";

export function useAI() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (prompt) => {
    setLoading(true);
    setResult("");

    let finalText = "";

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunk = decoder.decode(value, { stream: true });

        // Split stream into lines
        const lines = chunk.split("\n");

        for (let line of lines) {
          line = line.trim();

          if (!line || !line.startsWith("data:")) continue;

          const jsonStr = line.replace("data:", "").trim();

          if (jsonStr === "[DONE]") {
            done = true;
            break;
          }

          try {
            const json = JSON.parse(jsonStr);
            const text = json.choices?.[0]?.delta?.content;

            if (text) {
              finalText += text;

              // Update UI live (streaming)
              setResult((prev) => prev + text);
            }
          } catch (err) {
            // Ignore partial JSON errors
          }
        }
      }

      return finalText; // ✅ IMPORTANT (used for saving history)

    } catch (error) {
      console.error("AI Error:", error);
      return "❌ Failed to generate response. Try again.";
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    generate,
  };
    }
