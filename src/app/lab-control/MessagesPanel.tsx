"use client";

import { useEffect, useState, useCallback } from "react";

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  content: string;
  receivedAt: string;
  isRead: boolean;
}

export default function MessagesPanel({ token }: { token: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(() => {
    setLoading(true);
    fetch("/api/messages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleRead = async (id: string, isRead: boolean) => {
    await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isRead: !isRead }),
    });
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this transmission?")) return;
    await fetch(`/api/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMessages();
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
        Loading transmissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm tracking-widest text-[var(--accent-purple)] mb-1">
            TRANSMISSION LOGS
          </h2>
          <p className="text-[var(--text-secondary)] text-xs">
            {messages.length} total / {messages.filter((m) => !m.isRead).length}{" "}
            unread
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="px-3 py-1.5 text-[10px] tracking-widest border border-[var(--border-color)] text-[var(--text-secondary)] rounded hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors"
        >
          REFRESH
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
          <p className="text-[var(--text-secondary)] text-sm">
            No transmissions received.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-lg p-5 bg-[var(--bg-card)] ${
                msg.isRead
                  ? "border-[var(--border-color)]"
                  : "border-[var(--accent-cyan)]/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
                    )}
                    <span className="text-sm font-semibold truncate">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {msg.senderEmail}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
                    {msg.content}
                  </p>
                  <p className="text-[9px] text-[var(--text-secondary)] mt-3">
                    {new Date(msg.receivedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleRead(msg.id, msg.isRead)}
                    className="px-2 py-1 text-[9px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    {msg.isRead ? "UNREAD" : "READ"}
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="px-2 py-1 text-[9px] tracking-wider border border-red-500/30 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
