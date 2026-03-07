"use client";

import { useState } from "react";

export default function LoginPanel({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="w-full max-w-sm">
        <div className="border border-[var(--border-color)] rounded-lg p-8 bg-[var(--bg-card)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 border border-[var(--accent-purple)] rounded-lg mx-auto flex items-center justify-center">
              <span className="text-[var(--accent-purple)] font-bold text-lg">
                LC
              </span>
            </div>
            <h1 className="text-sm tracking-[0.3em] font-bold">LAB CONTROL</h1>
            <p className="text-[10px] text-[var(--text-secondary)] tracking-wider">
              AUTHENTICATION REQUIRED
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                OPERATOR ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                ACCESS KEY
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)] text-xs tracking-[0.3em] rounded hover:bg-[var(--accent-purple)]/20 transition-all disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "INITIALIZE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
