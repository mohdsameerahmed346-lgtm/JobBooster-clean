"use client";

import { useEffect } from "react";

export default function CursorSpotlight() {
  useEffect(() => {
    const move = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      document.documentElement.style.setProperty("--x", x + "px");
      document.documentElement.style.setProperty("--y", y + "px");
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div className="cursor-spotlight" />;
            }
