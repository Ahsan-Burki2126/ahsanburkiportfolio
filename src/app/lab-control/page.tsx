"use client";

import { useState, useEffect, useCallback } from "react";
import LoginPanel from "./LoginPanel";
import DashboardStats from "./DashboardStats";
import MessagesPanel from "./MessagesPanel";
import ProjectsPanel from "./ProjectsPanel";
import ProfilePanel from "./ProfilePanel";
import AssetManager from "./AssetManager";

type Tab = "stats" | "messages" | "projects" | "profile" | "assets";

export default function LabControlPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const handleLogin = useCallback((t: string) => {
    sessionStorage.setItem("admin_token", t);
    setToken(t);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  }, []);

  if (!token) return <LoginPanel onLogin={handleLogin} />;

  const tabs: { id: Tab; label: string }[] = [
    { id: "stats", label: "OVERVIEW" },
    { id: "messages", label: "TRANSMISSIONS" },
    { id: "projects", label: "EXPERIMENTS" },
    { id: "profile", label: "PROFILE" },
    { id: "assets", label: "ASSETS" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Admin header */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[var(--accent-purple)] rounded flex items-center justify-center">
              <span className="text-[var(--accent-purple)] font-bold text-xs">
                LC
              </span>
            </div>
            <span className="text-xs tracking-widest font-semibold">
              LAB <span className="text-[var(--accent-purple)]">CONTROL</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-[10px] tracking-widest border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 border-b border-[var(--border-color)] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-[10px] tracking-widest rounded transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "stats" && <DashboardStats token={token} />}
        {activeTab === "messages" && <MessagesPanel token={token} />}
        {activeTab === "projects" && <ProjectsPanel token={token} />}
        {activeTab === "profile" && <ProfilePanel token={token} />}
        {activeTab === "assets" && <AssetManager token={token} />}
      </div>
    </div>
  );
}
