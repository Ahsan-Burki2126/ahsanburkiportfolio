"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalDownloads: number;
  totalMessages: number;
  unreadMessages: number;
  totalProjects: number;
  totalAssets: number;
}

export default function DashboardStats({ token }: { token: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, [token]);

  if (!stats) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
        Loading system diagnostics...
      </div>
    );
  }

  const cards = [
    {
      label: "CV DOWNLOADS",
      value: stats.totalDownloads,
      color: "var(--accent-cyan)",
    },
    {
      label: "TOTAL MESSAGES",
      value: stats.totalMessages,
      color: "var(--accent-purple)",
    },
    {
      label: "UNREAD",
      value: stats.unreadMessages,
      color: "var(--accent-green)",
    },
    {
      label: "PROJECTS",
      value: stats.totalProjects,
      color: "var(--accent-cyan)",
    },
    {
      label: "ASSETS",
      value: stats.totalAssets,
      color: "var(--accent-purple)",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm tracking-widest text-[var(--accent-purple)] mb-1">
          SYSTEM DIAGNOSTICS
        </h2>
        <p className="text-[var(--text-secondary)] text-xs">
          Real-time overview of all modules.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)] text-center"
          >
            <p className="text-3xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="text-[9px] tracking-widest text-[var(--text-secondary)] mt-1">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
