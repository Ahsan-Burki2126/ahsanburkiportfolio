"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  labelClassName?: string;
  label?: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  labelClassName = "",
  label,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
              },
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, prefix, duration, hasAnimated]);

  return (
    <div className="text-center">
      <span ref={ref} className={className}>
        {prefix}0{suffix}
      </span>
      {label && <p className={labelClassName}>{label}</p>}
    </div>
  );
}
