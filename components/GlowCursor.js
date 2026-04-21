"use client";

import { useEffect } from "react";

export default function GlowCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");

    cursor.style.position = "fixed";
    cursor.style.width = "120px";
    cursor.style.height = "120px";
    cursor.style.borderRadius = "50%";
    cursor.style.background =
      "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "9999";
    cursor.style.transform = "translate(-50%, -50%)";

    document.body.appendChild(cursor);

    const move = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
      cursor.remove();
    };
  }, []);

  return null;
      }
