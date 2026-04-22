"use client";

import { useEffect } from "react";

export default function Parallax() {
  useEffect(() => {
    const handle = () => {
      const scrollY = window.scrollY;

      document.querySelectorAll(".parallax").forEach((el, i) => {
        const speed = 0.2 + i * 0.1;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return null;
}
