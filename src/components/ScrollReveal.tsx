"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  stagger?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const getInitialTransform = () => {
      switch (direction) {
        case "up":
          return { y: distance, x: 0 };
        case "down":
          return { y: -distance, x: 0 };
        case "left":
          return { y: 0, x: distance };
        case "right":
          return { y: 0, x: -distance };
        case "none":
          return { y: 0, x: 0 };
      }
    };

    const initial = getInitialTransform();
    gsap.set(el, { opacity: 0, y: initial.y, x: initial.x });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              x: 0,
              duration,
              delay,
              ease: "power3.out",
            });
            if (once) observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, duration, distance, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Stagger children variant
export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.1,
  direction = "up",
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: Direction;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const kids = el.children;
    if (!kids.length) return;

    const getInitial = () => {
      switch (direction) {
        case "up":
          return { y: distance, x: 0 };
        case "left":
          return { y: 0, x: distance };
        default:
          return { y: distance, x: 0 };
      }
    };

    const initial = getInitial();
    gsap.set(kids, { opacity: 0, y: initial.y, x: initial.x });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(kids, {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.6,
              stagger: staggerDelay,
              ease: "power3.out",
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerDelay, direction, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
