"use client";

import { useEffect, useState } from "react";

export default function TerminalText() {
  const [text, setText] = useState("");
  const fullText =
    "> INITIALIZING SYSTEM... GRADUATION_DATE: 2026-06-21... STATUS: ACTIVE... LOCATION: WAZIRISTAN... MODULE: AI_SYSTEMS... LOADING SAFARDOST... READY.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        i = 0;
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden border border-[var(--border-color)] rounded bg-[var(--bg-secondary)]/50 px-4 py-2">
      <span className="text-[var(--accent-green)] text-xs font-mono">
        {text}
        <span className="animate-pulse">█</span>
      </span>
    </div>
  );
}
