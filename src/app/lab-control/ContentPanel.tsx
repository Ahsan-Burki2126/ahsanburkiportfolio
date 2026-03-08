"use client";

import { useEffect, useState, useCallback } from "react";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
  page: string;
  label: string;
}

const PAGES = ["home", "about", "experience", "skills", "contact", "global"];

const PAGE_LABELS: Record<string, string> = {
  home: "HOME PAGE",
  about: "ABOUT PAGE",
  experience: "EXPERIENCE PAGE",
  skills: "SKILLS PAGE",
  contact: "CONTACT PAGE",
  global: "FOOTER / GLOBAL",
};

export default function ContentPanel({ token }: { token: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  const fetchContent = useCallback(() => {
    setLoading(true);
    fetch(`/api/content?page=${activePage}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activePage]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const startEdit = (item: ContentItem) => {
    setEditingKey(item.key);
    setJsonError(null);
    if (item.type === "json") {
      try {
        setEditValue(JSON.stringify(JSON.parse(item.value), null, 2));
      } catch {
        setEditValue(item.value);
      }
    } else {
      setEditValue(item.value);
    }
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
    setJsonError(null);
  };

  const saveEdit = async (key: string, type: string) => {
    if (type === "json") {
      try {
        JSON.parse(editValue);
      } catch {
        setJsonError("Invalid JSON format");
        return;
      }
    }

    setSaving(true);
    const valueToSave =
      type === "json" ? JSON.stringify(JSON.parse(editValue)) : editValue;

    const res = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key, value: valueToSave }),
    });

    if (res.ok) {
      setEditingKey(null);
      setEditValue("");
      setJsonError(null);
      setSuccessKey(key);
      setTimeout(() => setSuccessKey(null), 2000);
      fetchContent();
    }
    setSaving(false);
  };

  const filteredItems = items.filter((i) => i.page === activePage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm tracking-widest text-[var(--accent-purple)]">
          CONTENT EDITOR
        </h2>
        <span className="text-[10px] text-[var(--text-secondary)] tracking-wider">
          {filteredItems.length} ITEMS
        </span>
      </div>

      {/* Page Filter Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--border-color)] pb-3">
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => {
              setActivePage(page);
              setEditingKey(null);
            }}
            className={`px-3 py-1.5 text-[9px] tracking-widest rounded transition-all ${
              activePage === page
                ? "bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
            }`}
          >
            {PAGE_LABELS[page] || page.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
          Loading content...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
          No content items for this page.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.key}
              className={`border rounded-lg p-5 bg-[var(--bg-card)] transition-all ${
                successKey === item.key
                  ? "border-[var(--accent-green)]/50"
                  : editingKey === item.key
                    ? "border-[var(--accent-cyan)]/50"
                    : "border-[var(--border-color)]"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {item.label || item.key}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[8px] tracking-widest rounded border ${
                      item.type === "json"
                        ? "text-[var(--accent-purple)] border-[var(--accent-purple)]/20 bg-[var(--accent-purple)]/5"
                        : "text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5"
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {successKey === item.key && (
                    <span className="text-[10px] text-[var(--accent-green)] tracking-wider">
                      SAVED ✓
                    </span>
                  )}
                  <span className="text-[9px] text-[var(--text-secondary)] font-mono">
                    {item.key}
                  </span>
                </div>
              </div>

              {/* Content */}
              {editingKey === item.key ? (
                <div className="space-y-3">
                  <textarea
                    value={editValue}
                    onChange={(e) => {
                      setEditValue(e.target.value);
                      setJsonError(null);
                    }}
                    rows={
                      item.type === "json"
                        ? Math.min(
                            20,
                            Math.max(8, editValue.split("\n").length + 2),
                          )
                        : 3
                    }
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:outline-none resize-y font-mono"
                    spellCheck={item.type !== "json"}
                  />
                  {jsonError && (
                    <p className="text-red-400 text-[10px] tracking-wider">
                      {jsonError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(item.key, item.type)}
                      disabled={saving}
                      className="px-4 py-1.5 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-[10px] tracking-widest rounded hover:bg-[var(--accent-cyan)]/20 transition-colors disabled:opacity-50"
                    >
                      {saving ? "SAVING..." : "SAVE"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-1.5 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] tracking-widest rounded hover:bg-white/5 transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => startEdit(item)}
                  className="cursor-pointer group"
                >
                  {item.type === "json" ? (
                    <pre className="text-[var(--text-secondary)] text-xs leading-relaxed font-mono bg-[var(--bg-secondary)] rounded p-3 max-h-40 overflow-y-auto group-hover:border-[var(--accent-cyan)]/20 border border-transparent transition-colors">
                      {(() => {
                        try {
                          return JSON.stringify(
                            JSON.parse(item.value),
                            null,
                            2,
                          ).slice(0, 500);
                        } catch {
                          return item.value.slice(0, 500);
                        }
                      })()}
                      {item.value.length > 500 && "..."}
                    </pre>
                  ) : (
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed group-hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-secondary)] rounded p-3 border border-transparent group-hover:border-[var(--accent-cyan)]/20">
                      {item.value}
                    </p>
                  )}
                  <p className="text-[9px] text-[var(--text-secondary)]/50 mt-1 tracking-wider">
                    CLICK TO EDIT
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
