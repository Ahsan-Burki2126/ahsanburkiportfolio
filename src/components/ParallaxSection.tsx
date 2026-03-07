"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxSection({
  children,
  speed = 0.3,
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        // Only apply when element is in viewport
        if (rect.top < viewH && rect.bottom > 0) {
          const center = rect.top + rect.height / 2 - viewH / 2;
          const offset = center * speed * -1;
          el.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
