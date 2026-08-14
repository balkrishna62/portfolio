"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (!target) return;
      const isHoverable = window.getComputedStyle(target).cursor === 'pointer' || target.tagName?.toLowerCase() === 'a' || target.tagName?.toLowerCase() === 'button';
      setIsPointer(isHoverable);
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <>
      <div 
        style={{
          position: "fixed", top: 0, left: 0,
          width: 8, height: 8,
          backgroundColor: isPointer ? "transparent" : "#fff",
          borderRadius: "50%",
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          pointerEvents: "none",
          zIndex: 9999,
          transition: "background-color 0.2s ease"
        }}
      />
      <div 
        style={{
          position: "fixed", top: 0, left: 0,
          width: 40, height: 40,
          border: `1px solid ${isPointer ? "#06b6d4" : "rgba(255,255,255,0.2)"}`,
          backgroundColor: isPointer ? "rgba(6, 182, 212, 0.1)" : "transparent",
          borderRadius: "50%",
          transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isPointer ? 1.5 : 1})`,
          pointerEvents: "none",
          zIndex: 9998,
          transition: "transform 0.15s ease-out, border-color 0.2s ease, background-color 0.2s ease",
          // The trailing effect is achieved by the slight delay in mousemove vs transform if we were using springs,
          // but for simplicity and extreme performance, native CSS transitions work beautifully.
        }}
      />
    </>
  );
}
