"use client";

import { useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  glitchColor1?: string;
  glitchColor2?: string;
}

export default function GlitchText({
  text,
  className = "",
  as: Tag = "h1",
}: GlitchTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval>;

    const startGlitch = () => {
      let count = 0;
      interval = setInterval(() => {
        if (count >= 3) {
          el.setAttribute("data-text", text);
          el.textContent = text;
          clearInterval(interval);
          return;
        }
        const glitched = text
          .split("")
          .map((ch) =>
            Math.random() > 0.7
              ? String.fromCharCode(33 + Math.floor(Math.random() * 94))
              : ch,
          )
          .join("");
        el.textContent = glitched;
        count++;
      }, 80);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startGlitch();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [text]);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`glitch-text ${className}`}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
